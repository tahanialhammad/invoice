<?php

namespace App\Console\Commands;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Subscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

/**
 * Runs daily. Generates a monthly billing invoice for every active subscriber
 * whose billing anniversary falls on today's day-of-month.
 *
 * Example: User subscribed on the 15th → invoice generated every 15th of the month.
 */
class GenerateSubscriptionInvoices extends Command
{
    protected $signature   = 'subscriptions:generate-invoices';
    protected $description = 'Generate monthly subscription invoices on each subscriber\'s billing anniversary';

    public function handle(): void
    {
        $today          = now()->startOfDay();
        $todayDayOfMonth = (int) $today->format('j');   // 1-31

        $this->info("Running subscription invoicing for day {$todayDayOfMonth} of month...");

        $admin = User::where('is_admin', true)->first();

        if (!$admin) {
            $this->error('No admin user found. Cannot generate subscription invoices.');
            return;
        }

        // All active, unexpired subscriptions whose anniversary day == today
        $subscriptions = Subscription::with(['user', 'plan'])
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('ends_at')->orWhere('ends_at', '>', now());
            })
            ->get()
            ->filter(function (Subscription $sub) use ($today, $todayDayOfMonth) {
                // Billing anniversary: the same day-of-month as the original start
                $startDay = (int) Carbon::parse($sub->starts_at)->format('j');
                return $startDay === $todayDayOfMonth;
            });

        $generated = 0;

        foreach ($subscriptions as $subscription) {
            $user = $subscription->user;
            $plan = $subscription->plan;

            if (!$user || !$plan || $plan->price <= 0) {
                continue;
            }

            // Billing period: today → same day next month minus 1 day
            $periodStart = $today->copy();
            $periodEnd   = $today->copy()->addMonth()->subDay();

            // Find the subscriber as a Client of the Admin (or create them)
            $client = Client::firstOrCreate(
                ['user_id' => $admin->id, 'email' => $user->email],
                [
                    'client_name' => $user->name,
                    'business_name' => $user->name,
                    'address' => 'N/A',
                ]
            );

            // Idempotency guard: skip if already invoiced for this period
            $alreadyExists = Invoice::where('user_id', $admin->id)
                ->where('client_id', $client->id)
                ->where('is_subscription_invoice', true)
                ->where('billing_period_start', $periodStart->toDateString())
                ->exists();

            if ($alreadyExists) {
                $this->line("  → Invoice already exists for {$user->email} ({$periodStart->toDateString()}). Skipping.");
                continue;
            }

            try {
                $invoiceNumber = 'SUB-' . strtoupper(substr($plan->slug, 0, 3))
                    . '-' . $user->id
                    . '-' . $today->format('ymd');

                $invoice = Invoice::create([
                    'user_id'               => $admin->id,
                    'client_id'             => $client->id,
                    'invoice_number'        => $invoiceNumber,
                    'subtotal'              => $plan->price,
                    'tax_total'             => 0,
                    'total_amount'          => $plan->price,
                    'total'                 => $plan->price,
                    'status'               => 'pending',
                    'issue_date'            => $today->toDateString(),
                    'due_date'              => $today->copy()->addDays(7)->toDateString(),
                    'is_recurring'          => false,
                    'is_subscription_invoice' => true,
                    'billing_period_start'  => $periodStart->toDateString(),
                    'billing_period_end'    => $periodEnd->toDateString(),
                ]);

                InvoiceItem::create([
                    'invoice_id'  => $invoice->id,
                    'description' => sprintf(
                        '%s Plan — %s to %s',
                        $plan->name,
                        $periodStart->format('M d, Y'),
                        $periodEnd->format('M d, Y')
                    ),
                    'quantity'   => 1,
                    'unit_price' => $plan->price,
                    'tax_rate'   => 0,
                ]);

                $this->info("  ✓ Generated {$invoiceNumber} for {$user->email} ({$plan->name})");
                Log::info("Subscription invoice {$invoiceNumber} generated for user #{$user->id}");
                $generated++;

            } catch (\Exception $e) {
                $this->error("  ✗ Failed for {$user->email}: " . $e->getMessage());
                Log::error("GenerateSubscriptionInvoices failed for user #{$user->id}: " . $e->getMessage());
            }
        }

        $this->info("Done. Generated {$generated} invoice(s).");
    }
}
