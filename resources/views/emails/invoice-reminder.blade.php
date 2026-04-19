<x-mail::message>
# Payment Reminder

Hi {{ $invoice->client->client_name }},

This is a friendly reminder that invoice **#{{ $invoice->invoice_number }}** is currently unpaid.

**Invoice Details:**
- **Total Amount:** {{ number_format($invoice->total, 2) }} EUR
- **Due Date:** {{ $invoice->due_date }}

Please ensure payment is made at your earliest convenience. You can find the full invoice details in the attached PDF.

<x-mail::button :url="config('app.url') . '/invoices/' . $invoice->id">
View Invoice Online
</x-mail::button>

Thank you for your business!

Regards,<br>
{{ config('app.name') }}
</x-mail::message>
