<?php

namespace App\Console\Commands;

use App\Mail\InvoiceReminderMail;
use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;

class TestNotifications extends Command
{
    protected $signature = 'notifications:test';
    protected $description = 'Diagnose and test the full notification system';

    public function handle(): void
    {
        $this->info('=== STEP 1: Run overdue check ===');
        Artisan::call('invoices:check-overdue', [], $this->getOutput());

        $this->newLine();
        $this->info('=== STEP 2: Invoices eligible for reminders ===');

        $invoices = Invoice::whereIn('status', ['pending', 'overdue'])
            ->with('client')
            ->get();

        if ($invoices->isEmpty()) {
            $this->warn('No pending or overdue invoices found.');
        }

        foreach ($invoices as $invoice) {
            $email = $invoice->client?->email ?? '(no email)';
            $this->line("  ID {$invoice->id} | {$invoice->invoice_number} | {$invoice->status} | due: {$invoice->due_date} | email: {$email}");
        }

        $this->newLine();
        $this->info('=== STEP 3: Sending reminder emails ===');

        $sent = 0;
        $skipped = 0;

        foreach ($invoices as $invoice) {
            if ($invoice->client && $invoice->client->email) {
                try {
                    Mail::to($invoice->client->email)
                        ->send(new InvoiceReminderMail($invoice));
                    $this->line("  ✅ Sent reminder for #{$invoice->invoice_number} → {$invoice->client->email}");
                    $sent++;
                } catch (\Exception $e) {
                    $this->error("  ❌ FAILED for #{$invoice->invoice_number}: " . $e->getMessage());
                }
            } else {
                $this->warn("  ⚠ Skipped #{$invoice->invoice_number} — client has no email");
                $skipped++;
            }
        }

        $this->newLine();
        $this->info("=== DONE: {$sent} sent, {$skipped} skipped ===");
        $this->info('Check storage/logs/laravel.log for email output.');
    }
}
