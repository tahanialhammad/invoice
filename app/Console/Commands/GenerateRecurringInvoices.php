<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Spatie\LaravelPdf\Facades\Pdf;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('invoices:generate-recurring')]
#[Description('Generate new invoices from recurring templates')]
class GenerateRecurringInvoices extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Checking for recurring invoices...");

        $invoices = Invoice::with('items')
            ->where('is_recurring', true)
            ->whereNotNull('next_recurring_date')
            ->whereDate('next_recurring_date', '<=', Carbon::today())
            ->get();

        $count = 0;

        foreach ($invoices as $invoice) {
            $newIssueDate = Carbon::parse($invoice->next_recurring_date);
            $daysDiff = Carbon::parse($invoice->issue_date)->diffInDays(Carbon::parse($invoice->due_date));
            $newDueDate = $newIssueDate->copy()->addDays($daysDiff);

            $baseNumber = "{$invoice->invoice_number}-R" . $newIssueDate->format('ymd');
            $newInvoiceNumber = $baseNumber;
            $suffix = 1;
            while (Invoice::where('invoice_number', $newInvoiceNumber)->exists()) {
                $newInvoiceNumber = $baseNumber . '-' . $suffix;
                $suffix++;
            }

            // Create new invoice
            $newInvoice = $invoice->replicate(['is_recurring', 'recurring_interval', 'next_recurring_date']);
            $newInvoice->invoice_number = $newInvoiceNumber;
            $newInvoice->issue_date = $newIssueDate->toDateString();
            $newInvoice->due_date = $newDueDate->toDateString();
            $newInvoice->status = 'pending';
            $newInvoice->is_recurring = false;
            $newInvoice->save();

            // Replicate line items
            foreach ($invoice->items as $item) {
                $newItem = $item->replicate(['invoice_id']);
                $newItem->invoice_id = $newInvoice->id;
                $newItem->save();
            }

            // Immediately send the PDF email
            $newInvoice->load(['client', 'user', 'items']);
            
            if ($newInvoice->client && $newInvoice->client->email) {
                try {
                    $pdfContent = base64_decode(
                        Pdf::view('pdf.invoice', ['invoice' => $newInvoice])
                            ->driver('dompdf')
                            ->format('a4')
                            ->base64()
                    );

                    Mail::to($newInvoice->client->email)
                        ->send(new \App\Mail\InvoiceMail($newInvoice, $pdfContent));

                    $newInvoice->update(['status' => 'sent']);
                    
                    Log::info("Recurring invoice auto-sent: {$newInvoiceNumber} to {$newInvoice->client->email}");
                } catch (\Exception $e) {
                    Log::error("Failed to send recurring invoice {$newInvoiceNumber} to {$newInvoice->client->email}: " . $e->getMessage());
                }
            } else {
                Log::warning("Recurring invoice {$newInvoiceNumber} generated but not sent: Client has no email address.");
            }

            // Advance the next recurring date on the template
            $nextDate = match ($invoice->recurring_interval) {
                'weekly' => $newIssueDate->addWeek()->toDateString(),
                'monthly' => $newIssueDate->addMonth()->toDateString(),
                'yearly' => $newIssueDate->addYear()->toDateString(),
                default => null,
            };

            if ($nextDate) {
                $invoice->next_recurring_date = $nextDate;
                $invoice->save();
            }

            $count++;
            $this->info("Generated invoice {$newInvoiceNumber} from {$invoice->invoice_number}");
        }

        $this->info("Completed generating {$count} recurring invoices.");
    }
}
