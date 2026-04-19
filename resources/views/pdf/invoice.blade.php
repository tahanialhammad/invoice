<!DOCTYPE html>
<html dir="{{ (isset($invoice->arabic) && $invoice->arabic) ? 'rtl' : 'ltr' }}">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        @font-face {
            font-family: 'Amiri';
            src: url('https://fonts.googleapis.com/css2?family=Amiri&display=swap');
        }
        body {
            font-family: 'DejaVu Sans', 'Amiri', sans-serif;
            font-size: 13px;
            color: #333;
            line-height: 1.4;
            margin: 0;
            padding: 0;
        }
        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
        }
        table {
            width: 100%;
            line-height: inherit;
            text-align: left;
            border-collapse: collapse;
        }
        table td {
            padding: 5px;
            vertical-align: top;
        }
        .header-table td {
            padding-bottom: 40px;
        }
        .title {
            font-size: 45px;
            line-height: 45px;
            color: #333;
            font-weight: bold;
        }
        .info-table td {
            padding-bottom: 20px;
        }
        .heading {
            background: #f8fafc;
            border-bottom: 2px solid #e2e8f0;
            font-weight: bold;
            color: #64748b;
            font-size: 11px;
            text-transform: uppercase;
        }
        .item td {
            border-bottom: 1px solid #f1f5f9;
            padding: 12px 5px;
        }
        .item.last td {
            border-bottom: none;
        }
        .total-row td {
            padding-top: 10px;
            padding-bottom: 10px;
        }
        .grand-total td {
            border-top: 2px solid #333;
            font-weight: bold;
            font-size: 16px;
            color: #2563eb;
            padding-top: 15px;
        }
        .rtl {
            direction: rtl;
            font-family: 'Amiri', sans-serif;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .badge {
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 11px;
            text-transform: uppercase;
            font-weight: bold;
        }
        .badge-paid { background-color: #d1fae5; color: #065f46; }
        .badge-pending { background-color: #fef3c7; color: #92400e; }
        .badge-cancelled { background-color: #fee2e2; color: #991b1b; }
    </style>
</head>
<body>
    <div class="invoice-box {{ (isset($invoice->arabic) && $invoice->arabic) ? 'rtl' : '' }}">
        <table class="header-table">
            <tr>
                <td>
                    @if($invoice->user->company_logo_url)
                        <img src="{{ $invoice->user->company_logo_url }}" style="height: 60px;">
                    @else
                        <span class="title">INVOICE</span>
                    @endif
                </td>
                <td class="text-right">
                    <strong>{{ $invoice->user->company_name ?? $invoice->user->name }}</strong><br>
                    {!! nl2br(e($invoice->user->company_address)) !!}<br>
                    {{ $invoice->user->company_email ?? $invoice->user->email }}<br>
                    {{ $invoice->user->company_phone }}<br>
                    @if($invoice->user->company_vat_number)
                        VAT: {{ $invoice->user->company_vat_number }}
                    @endif
                </td>
            </tr>
        </table>

        <table class="info-table">
            <tr>
                <td>
                    <span style="color: #999; text-transform: uppercase; font-size: 11px; font-weight: bold;">Bill To</span><br>
                    <strong style="color: #2563eb; font-size: 16px;">{{ $invoice->client->client_name }}</strong><br>
                    @if($invoice->client->business_name)
                        {{ $invoice->client->business_name }}<br>
                    @endif
                    {!! nl2br(e($invoice->client->address)) !!}<br>
                    {{ $invoice->client->email }}<br>
                    @if($invoice->client->vat_number)
                        VAT: {{ $invoice->client->vat_number }}
                    @endif
                </td>
                <td class="text-right">
                    <span style="color: #999; text-transform: uppercase; font-size: 11px; font-weight: bold;">Invoice Details</span><br>
                    <strong>Invoice #:</strong> {{ $invoice->invoice_number }}<br>
                    <strong>Issued:</strong> {{ \Carbon\Carbon::parse($invoice->issue_date)->format('M d, Y') }}<br>
                    <strong>Due:</strong> {{ \Carbon\Carbon::parse($invoice->due_date)->format('M d, Y') }}<br>
                    <div style="margin-top: 10px;">
                        <span class="badge badge-{{ $invoice->status }}">
                            {{ $invoice->status }}
                        </span>
                    </div>
                </td>
            </tr>
        </table>

        <table style="margin-top: 40px;">
            <thead>
                <tr class="heading">
                    <td style="width: 40%;">Description</td>
                    <td class="text-right">Qty</td>
                    <td class="text-right">Unit Price</td>
                    <td class="text-right">Tax %</td>
                    <td class="text-right">Total</td>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                    <tr class="item">
                        <td>
                            <strong>{{ $item->description }}</strong>
                        </td>
                        <td class="text-right">{{ $item->quantity }}</td>
                        <td class="text-right">${{ number_format($item->unit_price, 2) }}</td>
                        <td class="text-right">{{ $item->tax_rate }}%</td>
                        <td class="text-right">
                            <strong>${{ number_format($item->row_total + $item->tax_amount, 2) }}</strong>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <table style="margin-top: 20px;">
            <tr>
                <td width="60%"></td>
                <td width="40%">
                    <table class="totals-table">
                        <tr class="total-row">
                            <td style="color: #666;">Subtotal</td>
                            <td class="text-right">${{ number_format($invoice->subtotal, 2) }}</td>
                        </tr>
                        <tr class="total-row">
                            <td style="color: #666;">Tax Total</td>
                            <td class="text-right">${{ number_format($invoice->tax_total, 2) }}</td>
                        </tr>
                        <tr class="grand-total">
                            <td>Total</td>
                            <td class="text-right">${{ number_format($invoice->total_amount, 2) }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <div style="margin-top: 100px; border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #999;">
            <p>Thank you for choosing {{ $invoice->user->company_name ?? $invoice->user->name }}.</p>
            <p style="font-size: 10px; margin-top: 5px; text-transform: uppercase; letter-spacing: 1px;">Generated on {{ now()->format('Y-m-d H:i') }}</p>
        </div>
    </div>
</body>
</html>
