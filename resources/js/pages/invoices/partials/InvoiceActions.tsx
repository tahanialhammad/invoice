import { Link } from '@inertiajs/react';
import { ExternalLink, Edit, Eye } from 'lucide-react';
import invoiceRoutes from '@/routes/invoices';
import SendInvoiceButton from './SendInvoiceButton';

interface InvoiceActionsProps {
    invoice: {
        id: number;
        invoice_number: string;
        client: {
            client_name: string;
            email?: string;
        };
    };
    showView?: boolean;
}

export default function InvoiceActions({ invoice, showView = true }: InvoiceActionsProps) {
    return (
        <div className="flex items-center justify-end gap-1">
            <SendInvoiceButton 
                invoiceId={invoice.id}
                invoiceNumber={invoice.invoice_number}
                clientName={invoice.client.client_name}
                clientEmail={invoice.client.email}
                className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            />

            <div className="h-4 w-px bg-sidebar-border mx-1" />

            <a
                href={invoiceRoutes.pdf(invoice.id).url}
                target="_blank"
                className="h-8 px-2 text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1.5 group transition-colors"
                title="Download PDF"
            >
                <ExternalLink className="size-3.5 text-slate-400 group-hover:text-slate-600" />
                <span>PDF</span>
            </a>

            {showView && (
                <Link
                    href={invoiceRoutes.show(invoice.id).url}
                    className="h-8 px-2 text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1.5 transition-colors"
                    title="View Invoice"
                >
                    <Eye className="size-3.5" />
                    <span>View</span>
                </Link>
            )}

            <Link
                href={invoiceRoutes.edit(invoice.id).url}
                className="h-8 px-2 text-sm font-medium text-blue-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                title="Edit Invoice"
            >
                <Edit className="size-3.5" />
                <span>Edit</span>
            </Link>
        </div>
    );
}
