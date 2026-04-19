<x-mail::message>
# Payment Confirmation

Hi {{ $invoice->client->client_name }},

Thank you for your payment! This email confirms that we have received the full payment for invoice **#{{ $invoice->invoice_number }}**.

**Payment Details:**
- **Invoice Number:** #{{ $invoice->invoice_number }}
- **Total Paid:** {{ number_format($invoice->total, 2) }} EUR

We appreciate your prompt payment. Your updated invoice is attached to this email for your records.

<x-mail::button :url="config('app.url') . '/invoices/' . $invoice->id">
Download Receipt
</x-mail::button>

Thanks again for your business!

Regards,<br>
{{ config('app.name') }}
</x-mail::message>
