<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Inertia\Inertia;

class AdminBillingController extends Controller
{
    public function index()
    {
        if (!auth()->user()->is_admin) {
            abort(403);
        }

        $invoices = Invoice::with(['client', 'items'])
            ->where('user_id', auth()->id())
            ->where('is_subscription_invoice', true)
            ->orderByDesc('billing_period_start')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn(Invoice $inv) => [
                'id'             => $inv->id,
                'invoice_number' => $inv->invoice_number,
                'client_name'    => $inv->client?->client_name ?? '—',
                'client_email'   => $inv->client?->email ?? '—',
                'plan'           => $inv->items->first()?->description ?? '—',
                'amount'         => (float) $inv->total,
                'status'         => $inv->status,
                'issue_date'     => $inv->issue_date ? \Carbon\Carbon::parse($inv->issue_date)->toDateString() : null,
                'due_date'       => $inv->due_date ? \Carbon\Carbon::parse($inv->due_date)->toDateString() : null,
                'period_start'   => $inv->billing_period_start ? \Carbon\Carbon::parse($inv->billing_period_start)->toDateString() : null,
                'period_end'     => $inv->billing_period_end ? \Carbon\Carbon::parse($inv->billing_period_end)->toDateString() : null,
            ]);

        $stats = [
            'total_revenue'  => Invoice::where('user_id', auth()->id())
                ->where('is_subscription_invoice', true)
                ->where('status', 'paid')
                ->sum('total'),
            'pending_amount' => Invoice::where('user_id', auth()->id())
                ->where('is_subscription_invoice', true)
                ->where('status', 'pending')
                ->sum('total'),
            'total_invoices' => $invoices->count(),
        ];

        return Inertia::render('admin/billing/index', [
            'invoices' => $invoices,
            'stats'    => $stats,
        ]);
    }
}
