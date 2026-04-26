<?php

namespace App\Http\Controllers;

use App\Mail\PaymentConfirmationMail;
use App\Models\Invoice;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Spatie\LaravelPdf\Facades\Pdf;

class InvoiceController extends Controller
{
    public function pdf(Invoice $invoice)
    {
        $this->authorizeOwner($invoice);

        return Pdf::view('pdf.invoice', ['invoice' => $invoice->load(['client', 'user', 'items'])])
            ->driver('dompdf')
            ->format('a4')
            ->name("invoice-{$invoice->invoice_number}.pdf");
    }

    public function index()
    {
        return Inertia::render('invoices/index', [
            'invoices' => auth()->user()->invoices()->with('client')->latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('invoices/create', [
            'clients' => auth()->user()->clients()->orderBy('client_name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id'              => 'required|exists:clients,id',
            'invoice_number'         => 'required|string|unique:invoices,invoice_number',
            'status'                 => 'required|in:pending,paid,cancelled',
            'issue_date'             => 'required|date',
            'due_date'               => 'required|date|after_or_equal:issue_date',
            'is_recurring'           => 'boolean',
            'recurring_interval'     => 'nullable|required_if:is_recurring,true|in:weekly,monthly,yearly',
            'items'                  => 'required|array|min:1',
            'items.*.description'    => 'required|string',
            'items.*.quantity'       => 'required|numeric|min:0.01',
            'items.*.unit_price'     => 'required|numeric|min:0',
            'items.*.tax_rate'       => 'required|numeric|min:0|max:100',
        ]);

        if (!empty($validated['is_recurring']) && !empty($validated['recurring_interval'])) {
            if (!auth()->user()->hasFeature('create_recurring_invoices')) {
                return back()->withErrors(['is_recurring' => 'Your current plan does not support recurring invoices.']);
            }

            $issueDate = \Carbon\Carbon::parse($validated['issue_date']);
            $validated['next_recurring_date'] = match ($validated['recurring_interval']) {
                'weekly' => $issueDate->addWeek()->toDateString(),
                'monthly' => $issueDate->addMonth()->toDateString(),
                'yearly' => $issueDate->addYear()->toDateString(),
            };
        } else {
            $validated['is_recurring'] = false;
            $validated['recurring_interval'] = null;
            $validated['next_recurring_date'] = null;
        }

        // Ensure the client belongs to the authenticated user
        auth()->user()->clients()->findOrFail($validated['client_id']);

        // Create invoice without nested items array
        $invoice = auth()->user()->invoices()->create(Arr::except($validated, ['items']));

        foreach ($validated['items'] as $item) {
            $invoice->items()->create($item);
        }

        return redirect()->route('invoices.index')->with('success', 'Invoice created successfully.');
    }

    public function show(Invoice $invoice)
    {
        $this->authorizeOwner($invoice);

        return Inertia::render('invoices/show', [
            'invoice' => $invoice->load(['client', 'items'])
        ]);
    }

    public function edit(Invoice $invoice)
    {
        $this->authorizeOwner($invoice);

        return Inertia::render('invoices/edit', [
            'invoice' => $invoice->load('items'),
            'clients' => auth()->user()->clients()->orderBy('client_name')->get()
        ]);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $this->authorizeOwner($invoice);

        $validated = $request->validate([
            'client_id'              => 'required|exists:clients,id',
            'invoice_number'         => 'required|string|unique:invoices,invoice_number,' . $invoice->id,
            'status'                 => 'required|in:draft,sent,pending,paid,overdue,cancelled',
            'issue_date'             => 'required|date',
            'due_date'               => 'required|date|after_or_equal:issue_date',
            'is_recurring'           => 'boolean',
            'recurring_interval'     => 'nullable|required_if:is_recurring,true|in:weekly,monthly,yearly',
            'items'                  => 'required|array|min:1',
            'items.*.id'             => 'nullable|exists:invoice_items,id',
            'items.*.description'    => 'required|string',
            'items.*.quantity'       => 'required|numeric|min:0.01',
            'items.*.unit_price'     => 'required|numeric|min:0',
            'items.*.tax_rate'       => 'required|numeric|min:0|max:100',
        ]);

        if (!empty($validated['is_recurring']) && !empty($validated['recurring_interval'])) {
            if (!auth()->user()->hasFeature('create_recurring_invoices')) {
                return back()->withErrors(['is_recurring' => 'Your current plan does not support recurring invoices.']);
            }

            // Only recalculate next_recurring_date if it's currently null or interval changed, or issue_date changed 
            // Better to keep it updated relative to issue date if changing things around, but maybe simpler:
            $issueDate = \Carbon\Carbon::parse($validated['issue_date']);
            $validated['next_recurring_date'] = match ($validated['recurring_interval']) {
                'weekly' => $issueDate->addWeek()->toDateString(),
                'monthly' => $issueDate->addMonth()->toDateString(),
                'yearly' => $issueDate->addYear()->toDateString(),
            };
        } else {
            $validated['is_recurring'] = false;
            $validated['recurring_interval'] = null;
            $validated['next_recurring_date'] = null;
        }

        // Ensure the client belongs to the authenticated user
        auth()->user()->clients()->findOrFail($validated['client_id']);

        // ✅ Capture the OLD status BEFORE any update happens
        $oldStatus = $invoice->status;

        // ✅ Update only scalar invoice fields — never pass the 'items' array to update()
        $invoice->update(Arr::except($validated, ['items']));

        // Sync line items
        $itemIds = collect($validated['items'])->pluck('id')->filter()->toArray();
        $invoice->items()->whereNotIn('id', $itemIds)->delete();

        foreach ($validated['items'] as $itemData) {
            if (!empty($itemData['id'])) {
                $invoice->items()->find($itemData['id'])?->update($itemData);
            } else {
                $invoice->items()->create($itemData);
            }
        }

        // ✅ Payment confirmation email — fires whenever ANY status transitions to 'paid'
        if ($oldStatus !== 'paid' && $validated['status'] === 'paid') {
            // Reload relationships so the Mailable has fresh, complete data
            $invoice->load(['client', 'user', 'items']);

            if ($invoice->client && $invoice->client->email) {
                Mail::to($invoice->client->email)
                    ->send(new PaymentConfirmationMail($invoice));
            }
        }

        return redirect()->route('invoices.index')->with('success', 'Invoice updated successfully.');
    }

    public function send(Invoice $invoice)
    {
        $this->authorizeOwner($invoice);

        if (!$invoice->client->email) {
            return back()->with('error', 'Client has no email address.');
        }

        $invoice->load(['client', 'user', 'items']);

        $pdfContent = base64_decode(
            Pdf::view('pdf.invoice', ['invoice' => $invoice])
                ->driver('dompdf')
                ->format('a4')
                ->base64()
        );

        Mail::to($invoice->client->email)
            ->send(new \App\Mail\InvoiceMail($invoice, $pdfContent));

        $invoice->update(['status' => 'sent']);

        return back()->with('success', 'Invoice email sent successfully.');
    }

    public function destroy(Invoice $invoice)
    {
        $this->authorizeOwner($invoice);
        $invoice->delete();

        return redirect()->route('invoices.index')->with('success', 'Invoice deleted successfully.');
    }

    protected function authorizeOwner(Invoice $invoice)
    {
        if (auth()->user()->is_admin) {
            return;
        }

        if ($invoice->user_id !== auth()->id()) {
            abort(403);
        }
    }
}
