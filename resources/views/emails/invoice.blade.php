<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 8px; }
        .header { border-bottom: 2px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; }
        .header h1 { margin: 0; color: #2563eb; }
        .details-grid { display: table; width: 100%; margin-bottom: 20px; }
        .details-col { display: table-cell; width: 50%; vertical-align: top; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th { background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 10px; text-align: left; font-size: 13px; color: #64748b; }
        .items-table td { border-bottom: 1px solid #f1f5f9; padding: 10px; font-size: 14px; }
        .text-right { text-align: right; }
        .totals { margin-top: 20px; width: 100%; }
        .totals td { padding: 5px 10px; }
        .grand-total { font-size: 18px; font-weight: bold; color: #2563eb; border-top: 2px solid #eee; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #999; }
        .badge { padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
        .badge-pending { background: #fef3c7; color: #92400e; }
        .badge-paid { background: #d1fae5; color: #065f46; }
        .badge-sent { background: #dbeafe; color: #1e40af; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>INVOICE #{{ $invoice->invoice_number }}</h1>
        </div>

        <div class="details-grid">
            <div class="details-col">
                <strong>Bill To:</strong><br>
                {{ $invoice->client->client_name }}<br>
                @if($invoice->client->business_name)
                    {{ $invoice->client->business_name }}<br>
                @endif
                {!! nl2br(e($invoice->client->address)) !!}<br>
                {{ $invoice->client->email }}
            </div>
            <div class="details-col text-right">
                <strong>From:</strong><br>
                {{ $invoice->user->company_name ?? $invoice->user->name }}<br>
                <strong>Date:</strong> {{ \Carbon\Carbon::parse($invoice->issue_date)->format('M d, Y') }}<br>
                <strong>Due:</strong> {{ \Carbon\Carbon::parse($invoice->due_date)->format('M d, Y') }}<br>
                <strong>Status:</strong> <span class="badge badge-{{ $invoice->status }}">{{ $invoice->status }}</span>
            </div>
        </div>

        <p>Dear {{ $invoice->client->client_name }},</p>
        <p>Please find the details of your invoice below. A PDF copy is also attached to this email.</p>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th class="text-right">Qty</th>
                    <th class="text-right">Price</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                    <tr>
                        <td>{{ $item->description }}</td>
                        <td class="text-right">{{ $item->quantity }}</td>
                        <td class="text-right">${{ number_format($item->unit_price, 2) }}</td>
                        <td class="text-right">${{ number_format(($item->quantity * $item->unit_price) + $item->tax_amount, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <table width="100%">
            <tr>
                <td align="right">
                    <table class="totals" style="width: 250px;">
                        <tr>
                            <td>Subtotal:</td>
                            <td class="text-right">${{ number_format($invoice->subtotal, 2) }}</td>
                        </tr>
                        <tr>
                            <td>Tax:</td>
                            <td class="text-right">${{ number_format($invoice->tax_total, 2) }}</td>
                        </tr>
                        <tr class="grand-total">
                            <td>Total:</td>
                            <td class="text-right">${{ number_format($invoice->total_amount, 2) }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <div class="footer">
            <p>Thank you for your business!</p>
            <p>&copy; {{ date('Y') }} {{ $invoice->user->company_name ?? $invoice->user->name }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
