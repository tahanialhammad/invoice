<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Plan;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SubscriptionController extends Controller
{
    /**
     * Store a new subscription (Upgrade / Downgrade / First-time).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:plans,id',
        ]);

        $user    = $request->user();
        $newPlan = Plan::findOrFail($validated['plan_id']);

        if ($user->is_admin) {
            abort(403, 'Admins cannot have subscriptions.');
        }

        Log::info('Plan change requested', ['user' => $user->id, 'new_plan' => $newPlan->slug]);

        try {
            return DB::transaction(function () use ($user, $newPlan) {

                $today       = now()->startOfDay()->toMutable();
                $admin       = User::where('is_admin', true)->firstOrFail();
                $daysInMonth = (int) $today->format('t');

                $activeSub = $user->subscriptions()
                    ->where('status', 'active')
                    ->where(fn($q) => $q->whereNull('ends_at')->orWhere('ends_at', '>', now()))
                    ->latest('starts_at')
                    ->first();

                // ─────────────────────────────────────────────────────────────
                // DELAYED DOWNGRADE LOGIC
                // ─────────────────────────────────────────────────────────────
                if ($activeSub && $newPlan->price < $activeSub->plan->price) {
                    
                    // Determine when the current billing cycle actually ends
                    $cycleEndsAt = $activeSub->billing_cycle_ends_at;
                    
                    if (!$cycleEndsAt) {
                        // Fallback: calculate next anniversary if column is empty
                        $startDay = (int) $activeSub->starts_at->format('j');
                        $cycleEndsAt = now()->addMonthNoOverflow()->day($startDay)->startOfDay();
                        if ($cycleEndsAt <= $today) {
                            $cycleEndsAt = $cycleEndsAt->addMonthNoOverflow();
                        }
                    }

                    $activeSub->update([
                        'pending_plan_id' => $newPlan->id,
                        'billing_cycle_ends_at' => $cycleEndsAt,
                    ]);

                    return redirect()->route('plans.index')
                        ->with('success', "Your plan will change to {$newPlan->name} on " . $cycleEndsAt->format('M d, Y') . ".");
                }

                // ─────────────────────────────────────────────────────────────
                // IMMEDIATE UPGRADE LOGIC (Pro-Rata)
                // ─────────────────────────────────────────────────────────────
                if ($activeSub) {
                    $client = Client::firstOrCreate(
                        ['user_id' => $admin->id, 'email' => $user->email],
                        [
                            'client_name' => $user->name,
                            'business_name' => $user->name,
                            'address' => 'N/A',
                        ]
                    );

                    if ($client) {
                        // Find the open billing-period invoice for this subscription
                        $currentInvoice = Invoice::where('user_id', $admin->id)
                            ->where('client_id', $client->id)
                            ->where('is_subscription_invoice', true)
                            ->where('billing_period_start', '<=', $today->toDateString())
                            ->where(fn($q) => $q
                                ->whereNull('billing_period_end')
                                ->orWhere('billing_period_end', '>=', $today->toDateString())
                            )
                            ->orderByDesc('billing_period_start')
                            ->first();

                        if ($currentInvoice) {
                            // Pro-rate: user only pays for days used
                            $periodStart = \Carbon\Carbon::parse($currentInvoice->billing_period_start);
                            $daysUsed    = max(1, $periodStart->diffInDays($today) + 1);
                            $totalDays   = max(1, $periodStart->diffInDays(
                                \Carbon\Carbon::parse($currentInvoice->billing_period_end)
                            ) + 1);

                            $oldPlan       = $activeSub->plan;
                            $proRatedAmount = round(($daysUsed / $totalDays) * $oldPlan->price, 2);

                            $currentInvoice->update([
                                'billing_period_end' => $today->toDateString(),
                                'subtotal'           => $proRatedAmount,
                                'total_amount'       => $proRatedAmount,
                                'total'              => $proRatedAmount,
                            ]);

                            // Update the line-item description
                            $currentInvoice->items()->update([
                                'description' => sprintf(
                                    '%s Plan — %s to %s (%d days, pro-rated)',
                                    $oldPlan->name,
                                    $periodStart->format('M d'),
                                    $today->format('M d, Y'),
                                    $daysUsed
                                ),
                                'unit_price' => $proRatedAmount,
                            ]);

                            Log::info("Pro-rated old invoice #{$currentInvoice->id}: {$daysUsed}/{$totalDays} days = \${$proRatedAmount}");
                        }
                    }

                    // Cancel the old subscription immediately
                    $activeSub->update(['status' => 'canceled', 'ends_at' => $today]);
                }

                // Create new subscription
                $user->subscriptions()->create([
                    'plan_id'               => $newPlan->id,
                    'status'                => 'active',
                    'starts_at'             => $today,
                    'ends_at'               => null,
                    'billing_cycle_ends_at' => $today->copy()->addMonth(),
                ]);

                // Generate pro-rated invoice for new plan
                if ($newPlan->price > 0) {
                    $this->generateProRatedInvoice($user, $newPlan, $admin, $today, $daysInMonth);
                }

                return redirect()->route('plans.index')
                    ->with('success', "Successfully switched to the {$newPlan->name} plan.");
            });

        } catch (\Exception $e) {
            Log::error("Plan change failed for user #{$user->id}: " . $e->getMessage());
            return back()->withErrors([
                'plan_id' => 'There was an error processing your subscription. Please try again.',
            ]);
        }
    }

    /**
     * Cancel the active subscription (revert to Basic / free tier).
     */
    public function destroy(Request $request)
    {
        $user = auth()->user();

        $user->subscriptions()
            ->where('status', 'active')
            ->update(['status' => 'canceled', 'ends_at' => now()]);

        return redirect()->route('plans.index')
            ->with('success', 'Plan canceled successfully. You are now on the Basic plan.');
    }

    // =========================================================================
    // Private helpers
    // =========================================================================

    private function generateProRatedInvoice(
        User $user,
        Plan $plan,
        User $admin,
        CarbonInterface $today,
        int $daysInMonth
    ): void {
        $client = Client::firstOrCreate(
            ['user_id' => $admin->id, 'email' => $user->email],
            [
                'client_name' => $user->name,
                'business_name' => $user->name,
                'address' => 'N/A',
            ]
        );

        $nextAnniversary = $today->copy()->addMonth();
        $remainingDays   = max(1, $today->diffInDays($nextAnniversary));
        $proRatedAmount  = round(($remainingDays / $daysInMonth) * $plan->price, 2);
        $periodEnd = $today->copy()->addMonth()->subDay();

        $invoiceNumber = 'SUB-' . strtoupper(substr($plan->slug, 0, 3))
            . '-' . $user->id
            . '-' . $today->format('ymdHis');

        try {
            $invoice = Invoice::create([
                'user_id'                 => $admin->id,
                'client_id'               => $client->id,
                'invoice_number'          => $invoiceNumber,
                'subtotal'                => $proRatedAmount,
                'tax_total'               => 0,
                'total_amount'            => $proRatedAmount,
                'total'                   => $proRatedAmount,
                'status'                  => 'pending',
                'issue_date'              => $today->toDateString(),
                'due_date'                => $today->copy()->addDays(7)->toDateString(),
                'is_recurring'            => false,
                'is_subscription_invoice' => true,
                'billing_period_start'    => $today->toDateString(),
                'billing_period_end'      => $periodEnd->toDateString(),
            ]);

            InvoiceItem::create([
                'invoice_id'  => $invoice->id,
                'description' => sprintf(
                    '%s Plan — %s to %s (%d days, pro-rated)',
                    $plan->name,
                    $today->format('M d'),
                    $periodEnd->format('M d, Y'),
                    $remainingDays
                ),
                'quantity'   => 1,
                'unit_price' => $proRatedAmount,
                'tax_rate'   => 0,
            ]);

            Log::info("Pro-rated invoice {$invoiceNumber} created for user #{$user->id}: \${$proRatedAmount}");

        } catch (\Exception $e) {
            Log::error("Failed to generate pro-rated invoice for user #{$user->id}: " . $e->getMessage());
        }
    }
}
