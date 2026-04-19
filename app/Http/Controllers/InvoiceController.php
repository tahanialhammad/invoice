<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Client;
use Illuminate\Http\Request;
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
            'client_id' => 'required|exists:clients,id',
            'invoice_number' => 'required|string|unique:invoices,invoice_number',
            'status' => 'required|in:pending,paid,cancelled',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.tax_rate' => 'required|numeric|min:0|max:100',
        ]);

        // Ensure the client belongs to the user
        $client = auth()->user()->clients()->findOrFail($validated['client_id']);

        $invoice = auth()->user()->invoices()->create($validated);

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
            'client_id' => 'required|exists:clients,id',
            'invoice_number' => 'required|string|unique:invoices,invoice_number,' . $invoice->id,
            'status' => 'required|in:draft,sent,pending,paid,overdue,cancelled',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'items' => 'required|array|min:1',
            'items.*.id' => 'nullable|exists:invoice_items,id',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.tax_rate' => 'required|numeric|min:0|max:100',
        ]);

        // Ensure the client belongs to the user
        auth()->user()->clients()->findOrFail($validated['client_id']);

        $invoice->update($validated);

        // Sync items
        $itemIds = collect($validated['items'])->pluck('id')->filter()->toArray();
        $invoice->items()->whereNotIn('id', $itemIds)->delete();

        foreach ($validated['items'] as $itemData) {
            if (isset($itemData['id'])) {
                $invoice->items()->find($itemData['id'])->update($itemData);
            } else {
                $invoice->items()->create($itemData);
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

        // Generate PDF content
        $pdfContent = base64_decode(
            Pdf::view('pdf.invoice', ['invoice' => $invoice])
                ->driver('dompdf')
                ->format('a4')
                ->base64()
        );

        // Send Email
        \Illuminate\Support\Facades\Mail::to($invoice->client->email)
            ->send(new \App\Mail\InvoiceMail($invoice, $pdfContent));

        // Update Status
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
