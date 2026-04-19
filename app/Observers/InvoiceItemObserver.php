<?php

namespace App\Observers;

use App\Models\InvoiceItem;

class InvoiceItemObserver
{
    /**
     * Handle the InvoiceItem "saving" event.
     */
    public function saving(InvoiceItem $invoiceItem): void
    {
        $invoiceItem->row_total = $invoiceItem->quantity * $invoiceItem->unit_price;
        $invoiceItem->tax_amount = $invoiceItem->row_total * ($invoiceItem->tax_rate / 100);
    }

    /**
     * Handle the InvoiceItem "saved" event.
     */
    public function saved(InvoiceItem $invoiceItem): void
    {
        $this->recalculateInvoiceTotals($invoiceItem);
    }

    /**
     * Handle the InvoiceItem "deleted" event.
     */
    public function deleted(InvoiceItem $invoiceItem): void
    {
        $this->recalculateInvoiceTotals($invoiceItem);
    }

    /**
     * Recalculate the invoice totals.
     */
    protected function recalculateInvoiceTotals(InvoiceItem $invoiceItem): void
    {
        $invoice = $invoiceItem->invoice;
        
        if ($invoice) {
            $totals = $invoice->items()->selectRaw('SUM(row_total) as subtotal, SUM(tax_amount) as tax_total')->first();
            
            $subtotal = $totals->subtotal ?? 0;
            $tax_total = $totals->tax_total ?? 0;
            
            $invoice->update([
                'subtotal' => $subtotal,
                'tax_total' => $tax_total,
                'total_amount' => $subtotal + $tax_total,
                'total' => $subtotal + $tax_total, // Update the old field too for compatibility
            ]);
        }
    }
}
