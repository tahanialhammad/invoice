<x-mail::message>
# Invoice #{{ $invoice->invoice_number }}

Hello {{ $invoice->client->client_name }},

Thank you for your business. Please find the details of your invoice below. A PDF copy is also attached for your records.

<x-mail::panel>
**Total Amount:** ${{ number_format($invoice->total_amount, 2) }}  
**Due Date:** {{ \Carbon\Carbon::parse($invoice->due_date)->format('M d, Y') }}
</x-mail::panel>

<x-mail::button :url="config('app.url') . '/invoices/' . $invoice->id">
View & Pay Invoice
</x-mail::button>

If you have any questions regarding this invoice, please don't hesitate to reach out.

Best regards,  
{{ $invoice->user->company_name ?? $invoice->user->name }}
<x-slot:subcopy>
@include('emails.company-info', ['user' => $invoice->user])
</x-slot:subcopy>
</x-mail::message>
