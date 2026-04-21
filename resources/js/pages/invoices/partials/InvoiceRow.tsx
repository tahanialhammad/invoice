import { Link } from '@inertiajs/react';
import { FileText, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import invoiceRoutes from '@/routes/invoices';
import InvoiceStatusBadge, { InvoiceStatus } from './InvoiceStatusBadge';
import InvoiceActions from './InvoiceActions';

interface InvoiceRowProps {
    invoice: {
        id: number;
        invoice_number: string;
        total: number;
        status: InvoiceStatus;
        issue_date: string;
        is_recurring?: boolean;
        recurring_interval?: string;
        client: {
            client_name: string;
            email?: string;
        };
    };
}

export default function InvoiceRow({ invoice }: InvoiceRowProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    return (
        <tr className={cn(
            "hover:bg-sidebar-accent/30 transition-colors group",
            invoice.status === 'overdue' && "bg-red-50/30 font-medium",
            invoice.is_recurring && "bg-blue-50/10 border-l-2 border-l-blue-400"
        )}>
            <td className="px-4 py-3 font-medium flex items-center gap-2">
                <FileText className="size-4 text-sidebar-foreground/40" />
                <Link href={invoiceRoutes.show(invoice.id).url} className="hover:underline text-blue-600 font-semibold flex items-center gap-2">
                    {invoice.invoice_number}
                    {invoice.is_recurring && (
                        <RefreshCw className="size-3 text-blue-500" title={`Recurring (${invoice.recurring_interval})`} />
                    )}
                </Link>
            </td>
            <td className="px-4 py-3">
                <div className="flex flex-col">
                    <span className="font-medium text-sidebar-foreground">{invoice.client.client_name}</span>
                    <span className="text-[10px] text-sidebar-foreground/40">{invoice.client.email || 'No email'}</span>
                </div>
            </td>
            <td className="px-4 py-3 text-sm text-sidebar-foreground/60">{invoice.issue_date}</td>
            <td className="px-4 py-3 font-bold text-sidebar-foreground">{formatCurrency(invoice.total)}</td>
            <td className="px-4 py-3">
                <InvoiceStatusBadge status={invoice.status} />
            </td>
            <td className="px-4 py-3 text-right">
                <InvoiceActions invoice={invoice} />
            </td>
        </tr>
    );
}
