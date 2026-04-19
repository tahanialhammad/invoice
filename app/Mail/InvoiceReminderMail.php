<?php

namespace App\Mail;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Attachment;
use Spatie\LaravelPdf\Facades\Pdf;

class InvoiceReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $invoice;

    public function __construct(Invoice $invoice)
    {
        $this->invoice = $invoice->load(['client', 'user', 'items']);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Reminder: Unpaid Invoice #{$this->invoice->invoice_number}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.invoice-reminder',
        );
    }

    public function attachments(): array
    {
        $pdfContent = base64_decode(
            Pdf::view('pdf.invoice', ['invoice' => $this->invoice])
                ->driver('dompdf')
                ->format('a4')
                ->base64()
        );

        return [
            Attachment::fromData(fn () => $pdfContent, "invoice-{$this->invoice->invoice_number}.pdf")
                ->withMime('application/pdf'),
        ];
    }
}
