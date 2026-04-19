import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Edit, ArrowLeft } from 'lucide-react';
import invoiceRoutes from '@/routes/invoices';
import AppLayout from '@/layouts/app-layout';

interface Client {
    id: number;
    client_name: string;
    email: string;
    address: string;
}

interface InvoiceItem {
    id: number;
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
    tax_amount: number;
}

interface Invoice {
    id: number;
    invoice_number: string;
    status: string;
    issue_date: string;
    due_date: string;
    subtotal: number;
    tax_total: number;
    total_amount: number;
    client: Client;
    items: InvoiceItem[];
}

export default function Show({ invoice }: { invoice: Invoice }) {
    const statusColors = {
        draft: 'bg-slate-100 text-slate-800 border-slate-200',
        sent: 'bg-blue-100 text-blue-800 border-blue-200',
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        paid: 'bg-green-100 text-green-800 border-green-200',
        overdue: 'bg-red-100 text-red-800 border-red-200',
        cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
        <>
            <Head title={`Invoice ${invoice.invoice_number}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 max-w-5xl mx-auto w-full">
                <div className="flex items-center justify-between">
                    <Link
                        href={invoiceRoutes.index().url}
                        className="flex items-center text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
                    >
                        <ArrowLeft className="mr-2 size-4" /> Back to Invoices
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href={invoiceRoutes.edit(invoice.id).url}>
                            <Button variant="outline" size="sm">
                                <Edit className="mr-2 size-4" /> Edit
                            </Button>
                        </Link>
                        <a href={invoiceRoutes.pdf(invoice.id).url} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Download className="mr-2 size-4" /> Download PDF
                            </Button>
                        </a>
                    </div>
                </div>

                <div className="bg-sidebar rounded-xl border border-sidebar-border/70 overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-sidebar-border/50">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-sidebar-foreground/40">Invoice From</h2>
                                    <div className="mt-1 font-medium font-serif text-lg text-blue-600">ZAIN INVOICE</div>
                                    <div className="text-sm text-sidebar-foreground/60">Saas Address Line<br />City, Country</div>
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-sidebar-foreground/40">Invoice To</h2>
                                    <div className="mt-1 font-medium">{invoice.client.client_name}</div>
                                    <div className="text-sm text-sidebar-foreground/60">{invoice.client.email}</div>
                                    <div className="text-sm text-sidebar-foreground/60 whitespace-pre-line">{invoice.client.address}</div>
                                </div>
                            </div>

                            <div className="text-right space-y-4">
                                <div>
                                    <h1 className="text-3xl font-bold flex items-center justify-end gap-2">
                                        <FileText className="size-8 text-blue-600" />
                                        INVOICE
                                    </h1>
                                    <div className="mt-1 text-sidebar-foreground/60 font-medium">#{invoice.invoice_number}</div>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize', statusColors[invoice.status as keyof typeof statusColors])}>
                                        {invoice.status}
                                    </span>
                                    <div className="text-sm">
                                        <span className="text-sidebar-foreground/40">Issue Date:</span> <span className="font-medium">{invoice.issue_date}</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-sidebar-foreground/40">Due Date:</span> <span className="font-medium">{invoice.due_date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-sidebar-border text-sm font-semibold text-sidebar-foreground/40">
                                        <th className="py-4 pr-4">Description</th>
                                        <th className="py-4 pr-4 text-right">Qty</th>
                                        <th className="py-4 pr-4 text-right">Price</th>
                                        <th className="py-4 pr-4 text-right">Tax %</th>
                                        <th className="py-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/30">
                                    {invoice.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="py-4 pr-4 font-medium">{item.description}</td>
                                            <td className="py-4 pr-4 text-right">{item.quantity}</td>
                                            <td className="py-4 pr-4 text-right">${Number(item.unit_price).toFixed(2)}</td>
                                            <td className="py-4 pr-4 text-right">{item.tax_rate}%</td>
                                            <td className="py-4 text-right font-semibold">
                                                ${((item.quantity * item.unit_price) * (1 + item.tax_rate/100)).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <div className="w-full md:w-64 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-sidebar-foreground/60">Subtotal</span>
                                    <span className="font-medium">${Number(invoice.subtotal).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-sidebar-foreground/60">Tax Total</span>
                                    <span className="font-medium">${Number(invoice.tax_total).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold border-t border-sidebar-border pt-3 text-blue-600">
                                    <span>Total</span>
                                    <span>${Number(invoice.total_amount).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-sidebar-accent/30 text-xs text-sidebar-foreground/40 text-center border-t border-sidebar-border/50">
                        Thank you for your business! If you have any questions about this invoice, please contact us.
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = (page: any) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Invoices', href: invoiceRoutes.index().url },
            { title: 'Preview', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
