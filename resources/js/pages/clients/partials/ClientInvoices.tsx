import { Link } from '@inertiajs/react';
import { FileText, ExternalLink } from 'lucide-react';
import invoiceRoutes from '@/routes/invoices';
import InvoiceStatusBadge, { InvoiceStatus } from '../../invoices/partials/InvoiceStatusBadge';

interface Invoice {
    id: number;
    invoice_number: string;
    total: number;
    status: InvoiceStatus;
    issue_date: string;
}

interface ClientInvoicesProps {
    invoices: Invoice[];
}

export default function ClientInvoices({ invoices }: ClientInvoicesProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-sidebar-foreground">Billing History</h3>
            
            <div className="rounded-xl border border-sidebar-border/70 bg-sidebar overflow-hidden shadow-sm">
                <table className="w-full text-left font-medium">
                    <thead className="border-b border-sidebar-border/70 bg-sidebar-accent/50">
                        <tr>
                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-sidebar-foreground/40">Invoice #</th>
                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-sidebar-foreground/40">Date</th>
                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-sidebar-foreground/40">Amount</th>
                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-sidebar-foreground/40">Status</th>
                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-sidebar-foreground/40 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-sidebar-border/30">
                        {invoices.length > 0 ? (
                            invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-sidebar-accent/20 transition-colors">
                                    <td className="px-4 py-4 flex items-center gap-2">
                                        <FileText className="size-4 text-blue-500/60" />
                                        <Link href={invoiceRoutes.show(invoice.id).url} className="text-blue-600 hover:underline">
                                            {invoice.invoice_number}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-sidebar-foreground/60">{invoice.issue_date}</td>
                                    <td className="px-4 py-4 font-bold">{formatCurrency(invoice.total)}</td>
                                    <td className="px-4 py-4">
                                        <InvoiceStatusBadge status={invoice.status} />
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <a
                                            href={invoiceRoutes.pdf(invoice.id).url}
                                            target="_blank"
                                            className="inline-flex items-center gap-1 text-xs text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
                                        >
                                            <ExternalLink className="size-3" />
                                            PDF
                                        </a>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-sidebar-foreground/40 italic">
                                    No invoices generated for this client yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
