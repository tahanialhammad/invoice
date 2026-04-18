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
        
        return Pdf::view('pdf.invoice', ['invoice' => $invoice->load(['client', 'user'])])
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
            'total' => 'required|numeric|min:0',
            'status' => 'required|in:pending,paid,cancelled',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
        ]);

        // Ensure the client belongs to the user
        $client = auth()->user()->clients()->findOrFail($validated['client_id']);

        auth()->user()->invoices()->create($validated);

        return redirect()->route('invoices.index')->with('success', 'Invoice created successfully.');
    }

    public function show(Invoice $invoice)
    {
        $this->authorizeOwner($invoice);
        return Inertia::render('invoices/show', [
            'invoice' => $invoice->load('client')
        ]);
    }

    public function edit(Invoice $invoice)
    {
        $this->authorizeOwner($invoice);
        return Inertia::render('invoices/edit', [
            'invoice' => $invoice,
            'clients' => auth()->user()->clients()->orderBy('client_name')->get()
        ]);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $this->authorizeOwner($invoice);

        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'invoice_number' => 'required|string|unique:invoices,invoice_number,' . $invoice->id,
            'total' => 'required|numeric|min:0',
            'status' => 'required|in:pending,paid,cancelled',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
        ]);

        // Ensure the client belongs to the user
        auth()->user()->clients()->findOrFail($validated['client_id']);

        $invoice->update($validated);

        return redirect()->route('invoices.index')->with('success', 'Invoice updated successfully.');
    }

    public function destroy(Invoice $invoice)
    {
        $this->authorizeOwner($invoice);
        $invoice->delete();

        return redirect()->route('invoices.index')->with('success', 'Invoice deleted successfully.');
    }

    protected function authorizeOwner(Invoice $invoice)
    {
        if ($invoice->user_id !== auth()->id()) {
            abort(403);
        }
    }
}
