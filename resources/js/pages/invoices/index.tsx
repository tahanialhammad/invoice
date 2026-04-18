import { Head, Link } from '@inertiajs/react';
import { Plus, FileText } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import invoiceRoutes from '@/routes/invoices';
import AppLayout from '@/layouts/app-layout';

interface Client {
    client_name: string;
}

interface Invoice {
    id: number;
    invoice_number: string;
    client: Client;
    total: number;
    status: 'pending' | 'paid' | 'cancelled';
    issue_date: string;
}

export default function Index({ invoices }: { invoices: Invoice[] }) {
    const statusColors: Record<Invoice['status'], string> = {
        pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        paid: 'bg-green-500/10 text-green-500 border-green-500/20',
        cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    return (
        <>
            <Head title="Invoices" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Invoices</h1>
                    <Link
                        href={invoiceRoutes.create()}
                        className={cn(buttonVariants(), 'gap-2')}
                    >
                        <Plus className="size-4" />
                        Create Invoice
                    </Link>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-sidebar overflow-hidden">
                    <table className="w-full text-left">
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
                                    <tr key={invoice.id} className="hover:bg-sidebar-accent/30 transition-colors">
                                        <td className="px-4 py-3 font-medium flex items-center gap-2">
                                            <FileText className="size-4 text-sidebar-foreground/40" />
                                            {invoice.invoice_number}
                                        </td>
                                        <td className="px-4 py-3">{invoice.client.client_name}</td>
                                        <td className="px-4 py-3 text-sm">{invoice.issue_date}</td>
                                        <td className="px-4 py-3 font-bold">${Number(invoice.total).toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className={cn('capitalize', statusColors[invoice.status])}>
                                                {invoice.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right flex items-center justify-end gap-3">
                                            <a
                                                href={invoiceRoutes.pdf(invoice.id).url}
                                                target="_blank"
                                                className="text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1 group"
                                            >
                                                <FileText className="size-3 text-slate-400 group-hover:text-slate-600" />
                                                PDF
                                            </a>
                                            <Link
                                                href={invoiceRoutes.edit(invoice.id)}
                                                className="text-sm font-medium text-blue-500 hover:text-blue-600 underline-offset-4 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-sidebar-foreground/50">
                                        No invoices found. Click "Create Invoice" to generate one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

Index.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Invoices', href: invoiceRoutes.index() }]}>
        {page}
    </AppLayout>
);
