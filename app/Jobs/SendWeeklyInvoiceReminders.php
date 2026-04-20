<?php

namespace App\Jobs;

use App\Mail\InvoiceReminderMail;
use App\Models\Invoice;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendWeeklyInvoiceReminders
{
    use Dispatchable;

    /**
     * Execute the job synchronously.
     * Called either by the scheduler or manually via Tinker/artisan.
     */
    public function handle(): void
    {
        // Step 1 — Refresh overdue statuses before querying
        Artisan::call('invoices:check-overdue');

        // Step 2 — Fetch all pending / overdue invoices with their relations
        $invoices = Invoice::whereIn('status', ['pending', 'overdue'])
            ->with(['client', 'user', 'items'])
            ->get();

        $sent    = 0;
        $skipped = 0;

        // Step 3 — Send a reminder email per invoice
        foreach ($invoices as $invoice) {
            if (!$invoice->client || !$invoice->client->email) {
                Log::info("Invoice reminder skipped (no email): #{$invoice->invoice_number}");
                $skipped++;
                continue;
            }

            try {
                Mail::to($invoice->client->email)
                    ->send(new InvoiceReminderMail($invoice));

                Log::info("Invoice reminder sent: #{$invoice->invoice_number} → {$invoice->client->email}");
                $sent++;

                // Small delay to avoid Mailtrap / SMTP rate limiting on free plans
                usleep(500000); // 0.5 seconds between sends
            } catch (\Exception $e) {
                Log::error("Invoice reminder FAILED: #{$invoice->invoice_number} — " . $e->getMessage());
            }
        }

        Log::info("Weekly reminders complete: {$sent} sent, {$skipped} skipped.");
    }
}
