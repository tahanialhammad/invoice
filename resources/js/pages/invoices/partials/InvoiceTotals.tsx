import { cn } from '@/lib/utils';

interface InvoiceTotalsProps {
    subtotal: number;
    taxTotal: number;
    grandTotal: number;
    className?: string;
}

export default function InvoiceTotals({ subtotal, taxTotal, grandTotal, className }: InvoiceTotalsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    return (
        <div className={cn("w-full md:w-80 bg-sidebar p-6 rounded-xl border border-sidebar-border/70 space-y-3 shadow-sm", className)}>
            <div className="flex justify-between text-sm">
                <span className="text-sidebar-foreground/60 font-medium">Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-sidebar-foreground/60 font-medium">Tax Total</span>
                <span className="font-semibold">{formatCurrency(taxTotal)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-sidebar-border/50 pt-2 text-blue-600">
                <span>Grand Total</span>
                <span>{formatCurrency(grandTotal)}</span>
            </div>
        </div>
    );
}
