<?php

namespace App\Jobs;

use App\Models\Invoice;
use App\Mail\InvoiceReminderMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendWeeklyInvoiceReminders implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // First, mark any passed due dates as 'overdue'
        \Illuminate\Support\Facades\Artisan::call('invoices:check-overdue');

        // Find all pending or overdue invoices
        $invoices = Invoice::whereIn('status', ['pending', 'overdue'])
            ->with(['client', 'user', 'items'])
            ->get();

        foreach ($invoices as $invoice) {
            if ($invoice->client && $invoice->client->email) {
                Mail::to($invoice->client->email)->send(new InvoiceReminderMail($invoice));
            }
        }
    }
}
