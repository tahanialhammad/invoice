<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Subscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class GenerateSubscriptionInvoices extends Command
{
    protected $signature = 'subscriptions:generate-invoices';
    protected $description = 'Generate monthly invoices for active subscriptions';

    public function handle()
    {
        $this->info("Checking for subscriptions that need invoicing...");

        // Get the admin user (first is_admin)
        $admin = User::where('is_admin', true)->first();

        if (!$admin) {
            $this->error("No admin user found. Subscription invoices cannot be generated.");
            return;
        }

        // We want to generate invoices for users who have an active subscription
        // and haven't been invoiced for the current month yet.
        $subscriptions = Subscription::with(['user', 'plan'])
            ->where('status', 'active')
            ->where('starts_at', '<=', now())
            ->where(function ($query) {
                $query->whereNull('ends_at')
                      ->orWhere('ends_at', '>', now());
            })
            ->get();

        $count = 0;

        foreach ($subscriptions as $subscription) {
            $user = $subscription->user;
            $plan = $subscription->plan;

            // Skip free plans (if price is 0)
            if ($plan->price <= 0) {
                continue;
            }

            // FIND THE SUBSCRIBER AS A CLIENT OF THE ADMIN
            // Each user is registered as a Client of the admin so the admin can invoice them.
            $client = Client::where('user_id', $admin->id)
                ->where('email', $user->email)
                ->first();

            if (!$client) {
                $this->warn("User {$user->email} is not registered as a client for the Admin. Skipping invoice.");
                continue;
            }

            // Check if we already generated a subscription invoice for this user in the last 28 days
            $exists = Invoice::where('client_id', $client->id)
                ->where('user_id', $admin->id)
                ->where('is_subscription_invoice', true)
                ->where('created_at', '>', now()->subDays(28))
                ->exists();

            if ($exists) {
                continue;
            }

            try {
                // Generate the invoice
                $invoiceNumber = 'SUB-' . strtoupper(substr($plan->slug, 0, 3)) . '-' . $user->id . '-' . now()->format('ymd');
                
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

                // Add the line item
                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'description' => "Subscription Plan: " . $plan->name . " (" . now()->format('F Y') . ")",
                    'quantity' => 1,
                    'unit_price' => $plan->price,
                    'tax_rate' => 0,
                ]);

                $this->info("Generated subscription invoice {$invoiceNumber} for {$user->email}");
                Log::info("Subscription invoice generated: {$invoiceNumber} for user ID {$user->id}");
                $count++;
            } catch (\Exception $e) {
                $this->error("Failed to generate invoice for user {$user->id}: " . $e->getMessage());
                Log::error("Failed subscription invoice generation: " . $e->getMessage());
            }
        }

        $this->info("Completed generating {$count} subscription invoices.");
    }
}
