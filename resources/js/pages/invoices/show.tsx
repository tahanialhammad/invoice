import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Download, Edit, ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import invoiceRoutes from '@/routes/invoices';
import AppLayout from '@/layouts/app-layout';
import InvoiceStatusBadge, { InvoiceStatus } from './partials/InvoiceStatusBadge';
import InvoiceTotals from './partials/InvoiceTotals';
import SendInvoiceButton from './partials/SendInvoiceButton';

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
    status: InvoiceStatus;
    issue_date: string;
    due_date: string;
    subtotal: number;
    tax_total: number;
    total_amount: number;
    client: Client;
    items: InvoiceItem[];
}

export default function Show({ invoice }: { invoice: Invoice }) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(invoiceRoutes.destroy(invoice.id).url, {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setIsDeleting(false);
                toast.success('Invoice deleted successfully!');
            },
            onError: () => {
                setIsDeleting(false);
                toast.error('Failed to delete invoice.');
            },
        });
    };

    return (
        <>
            <Head title={`Invoice ${invoice.invoice_number}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
                <div className="flex items-center justify-between">
                    <Link
                        href={invoiceRoutes.index().url}
                        className="flex items-center text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors group"
                    >
                        <ArrowLeft className="mr-2 size-4 group-hover:-translate-x-1 transition-transform" /> 
                        Back to Invoices
                    </Link>
                    <div className="flex items-center gap-2">
                        <SendInvoiceButton 
                            invoiceId={invoice.id}
                            invoiceNumber={invoice.invoice_number}
                            clientName={invoice.client.client_name}
                            clientEmail={invoice.client.email}
                            variant="outline"
                        />
                        <Link href={invoiceRoutes.edit(invoice.id).url}>
                            <Button variant="outline" size="sm">
                                <Edit className="mr-2 size-4" /> Edit
                            </Button>
                        </Link>
                        
                        {['pending', 'cancelled'].includes(invoice.status) && (
                            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" size="sm" className="shadow-sm">
                                        <Trash2 className="mr-2 size-4" /> Delete
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Delete Invoice</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to delete invoice {invoice.invoice_number}? This action cannot be undone.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                                            Cancel
                                        </Button>
                                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                                            {isDeleting ? 'Deleting...' : 'Delete'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                        
                        <a href={invoiceRoutes.pdf(invoice.id).url} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                                <Download className="mr-2 size-4" /> PDF
                            </Button>
                        </a>
                    </div>
                </div>

                <div className="bg-sidebar rounded-xl border border-sidebar-border/70 overflow-hidden shadow-md">
                    <div className="p-8 border-b border-sidebar-border/50 bg-sidebar-accent/5">
                        <div className="flex flex-col md:row justify-between gap-8">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xs font-bold uppercase tracking-widest text-sidebar-foreground/40 mb-2">Issued By</h2>
                                    <div className="font-serif text-xl font-bold text-blue-600">ZAIN INVOICE</div>
                                    <div className="text-sm text-sidebar-foreground/60 mt-1">Saas Address Line<br />City, Country</div>
                                </div>
                                <div>
                                    <h2 className="text-xs font-bold uppercase tracking-widest text-sidebar-foreground/40 mb-2">Bill To</h2>
                                    <div className="font-bold text-lg text-sidebar-foreground">{invoice.client.client_name}</div>
                                    <div className="text-sm text-sidebar-foreground/60">{invoice.client.email}</div>
                                    <div className="text-sm text-sidebar-foreground/60 whitespace-pre-line mt-1">{invoice.client.address}</div>
                                </div>
                            </div>

                            <div className="text-right space-y-6">
                                <div>
                                    <h1 className="text-4xl font-black tracking-tighter text-sidebar-foreground">
                                        INVOICE
                                    </h1>
                                    <div className="text-sidebar-foreground/60 font-mono text-sm mt-1">Ref: #{invoice.invoice_number}</div>
                                </div>
                                <div className="flex flex-col gap-3 items-end">
                                    <InvoiceStatusBadge status={invoice.status} className="text-sm px-3 py-1" />
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-end gap-2 text-sidebar-foreground/60">
                                            <span>Issued:</span> <span className="font-medium text-sidebar-foreground">{invoice.issue_date}</span>
                                        </div>
                                        <div className="flex justify-end gap-2 text-sidebar-foreground/60">
                                            <span>Due:</span> <span className="font-medium text-sidebar-foreground">{invoice.due_date}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b-2 border-sidebar-border text-xs font-bold uppercase tracking-wider text-sidebar-foreground/40">
                                        <th className="py-4 pr-4">Description</th>
                                        <th className="py-4 pr-4 text-right">Qty</th>
                                        <th className="py-4 pr-4 text-right">Price</th>
                                        <th className="py-4 pr-4 text-right">Tax %</th>
                                        <th className="py-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/30">
                                    {invoice.items.map((item) => (
                                        <tr key={item.id} className="hover:bg-sidebar-accent/10 transition-colors">
                                            <td className="py-5 pr-4 font-medium text-sidebar-foreground">{item.description}</td>
                                            <td className="py-5 pr-4 text-right text-sidebar-foreground/80">{item.quantity}</td>
                                            <td className="py-5 pr-4 text-right text-sidebar-foreground/80">{formatCurrency(item.unit_price)}</td>
                                            <td className="py-5 pr-4 text-right text-sidebar-foreground/80">{item.tax_rate}%</td>
                                            <td className="py-5 text-right font-bold text-sidebar-foreground">
                                                {formatCurrency((item.quantity * item.unit_price) * (1 + item.tax_rate/100))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-10 flex justify-end">
                            <InvoiceTotals 
                                subtotal={invoice.subtotal}
                                taxTotal={invoice.tax_total}
                                grandTotal={invoice.total_amount}
                            />
                        </div>
                    </div>

                    <div className="p-8 bg-sidebar-accent/10 text-xs text-sidebar-foreground/40 text-center border-t border-sidebar-border/50">
                        Professional Invoice generated by ZAIN INVOICE SaaS. Thank you for your business!
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
            { title: `Invoice Preview`, href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
