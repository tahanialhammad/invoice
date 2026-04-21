import InvoiceRow from './InvoiceRow';
import { InvoiceStatus } from './InvoiceStatusBadge';

interface Invoice {
    id: number;
    invoice_number: string;
    total: number;
    status: InvoiceStatus;
    issue_date: string;
    client: {
        client_name: string;
        email?: string;
    };
}

interface InvoiceTableProps {
    invoices: Invoice[];
}

export default function InvoiceTable({ invoices }: InvoiceTableProps) {
    return (
        <div className="rounded-xl border border-sidebar-border/70 bg-sidebar overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="border-b border-sidebar-border/70 bg-sidebar-accent/50">
                    <tr>
                        <th className="px-4 py-3 font-semibold text-sidebar-foreground/70">Number</th>
                        <th className="px-4 py-3 font-semibold text-sidebar-foreground/70">Client</th>
                        <th className="px-4 py-3 font-semibold text-sidebar-foreground/70">Date</th>
                        <th className="px-4 py-3 font-semibold text-sidebar-foreground/70">Total</th>
                        <th className="px-4 py-3 font-semibold text-sidebar-foreground/70">Status</th>
                        <th className="px-4 py-3 font-semibold text-sidebar-foreground/70 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-sidebar-border/70">
                    {invoices.length > 0 ? (
                        invoices.map((invoice) => (
                            <InvoiceRow key={invoice.id} invoice={invoice} />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="px-4 py-12 text-center text-sidebar-foreground/50">
                                <div className="flex flex-col items-center gap-2">
                                    <p>No invoices found matching your criteria.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>
        </div>
    );
}
