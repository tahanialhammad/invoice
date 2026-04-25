<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Plan;
use App\Models\User;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Gate;

class SubscriptionController extends Controller
{
    /**
     * Store a new subscription (Upgrade/Downgrade).
     */
    public function store(Request $request)
    {
        Log::info('Plan Change Request Payload:', ['data' => $request->all()]);
        $planId = $request->input('plan_id');

        $validated = $request->validate([
            'plan_id' => 'required|exists:plans,id',
        ]);

        $user = $request->user();
        $newPlan = Plan::findOrFail($validated['plan_id']);
        
        // Authorization check
        if ($user->is_admin) {
            abort(403, 'Admins cannot have subscriptions.');
        }

        try {
            \DB::transaction(function () use ($user, $newPlan) {
                // Cancel existing active subscriptions
                $user->subscriptions()->where('status', 'active')->update([
                    'status' => 'canceled', 
                    'ends_at' => now()
                ]);
                
                // Create new subscription
                $user->subscriptions()->create([
                    'plan_id' => $newPlan->id,
                    'status' => 'active',
                    'starts_at' => now(),
                ]);

                // Generate immediate invoice if paid plan
                if ($newPlan->price > 0) {
                    $this->generateImmediateInvoice($user, $newPlan);
                }
            });

            return redirect()->route('plans.index')->with('success', "Successfully switched to the {$newPlan->name} plan.");
        } catch (\Exception $e) {
            Log::error("Plan change failed for user {$user->id}: " . $e->getMessage());
            return back()->withErrors(['plan_id' => 'There was an error processing your subscription. Please try again.']);
        }
    }

    /**
     * Cancel subscription (Downgrade to Basic).
     */
    public function destroy(Request $request)
    {
        $user = auth()->user();
        
        $user->subscriptions()->where('status', 'active')->update([
            'status' => 'canceled', 
            'ends_at' => now()
        ]);

        return redirect()->route('plans.index')->with('success', 'Plan canceled successfully. You are now on the Basic plan.');
    }

    /**
     * Internal helper to generate an immediate invoice on plan change.
     */
    protected function generateImmediateInvoice(User $user, Plan $plan)
    {
        $admin = User::where('is_admin', true)->first();
        if (!$admin) return;

        // FIND THE SUBSCRIBER AS A CLIENT OF THE ADMIN
        $client = \App\Models\Client::where('user_id', $admin->id)
            ->where('email', $user->email)
            ->first();

        if (!$client) {
            Log::warning("Immediate invoice failed: User {$user->email} not found in Admin's client list.");
            return;
        }

        try {
            $invoiceNumber = 'CHG-' . strtoupper(substr($plan->slug, 0, 3)) . '-' . $user->id . '-' . now()->format('ymdHis');
            
            $invoice = Invoice::create([
                'user_id' => $admin->id,
                'client_id' => $client->id,
                'invoice_number' => $invoiceNumber,
                'subtotal' => $plan->price,
                'tax_total' => 0,
                'total_amount' => $plan->price,
                'total' => $plan->price,
                'status' => 'pending',
                'issue_date' => now()->toDateString(),
                'due_date' => now()->addDays(7)->toDateString(),
                'is_recurring' => false,
                'is_subscription_invoice' => true,
            ]);

            InvoiceItem::create([
                'invoice_id' => $invoice->id,
                'description' => "Plan Change: " . $plan->name . " (New cycle starts now)",
                'quantity' => 1,
                'unit_price' => $plan->price,
                'tax_rate' => 0,
            ]);

            Log::info("Plan change invoice generated: {$invoiceNumber} for user ID {$user->id}");
        } catch (\Exception $e) {
            Log::error("Failed to generate plan change invoice: " . $e->getMessage());
        }
    }
}
