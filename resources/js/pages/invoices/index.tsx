import { Head, Link, router } from '@inertiajs/react';
import { Plus, FileText, Send, Loader2, ExternalLink } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import invoiceRoutes from '@/routes/invoices';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { toast } from 'sonner';

interface Client {
    client_name: string;
    email?: string;
}

interface Invoice {
    id: number;
    invoice_number: string;
    client: Client;
    total: number;
    status: 'draft' | 'sent' | 'pending' | 'paid' | 'overdue' | 'cancelled';
    issue_date: string;
}

export default function Index({ invoices }: { invoices: Invoice[] }) {
    const [sendingId, setSendingId] = useState<number | null>(null);

    const statusColors: Record<Invoice['status'], string> = {
        draft: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
        sent: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        paid: 'bg-green-500/10 text-green-500 border-green-500/20',
        overdue: 'bg-red-500/10 text-red-500 border-red-500/20',
        cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    };

    const handleSendEmail = (invoice: Invoice) => {
        if (!invoice.client.email) {
            toast.error('Client has no email address.');
            return;
        }

        if (!window.confirm(`Send invoice #${invoice.invoice_number} to ${invoice.client.client_name}?`)) {
            return;
        }

        setSendingId(invoice.id);
        
        router.post(invoiceRoutes.send(invoice.id).url, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Email sent!');
            },
            onError: () => {
                toast.error('Failed to send email.');
            },
            onFinish: () => setSendingId(null)
        });
    };

    return (
        <>
            <Head title="Invoices" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Invoices</h1>
                    <Link
                        href={invoiceRoutes.create().url}
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
                                            <Link href={invoiceRoutes.show(invoice.id).url} className="hover:underline text-blue-600">
                                                {invoice.invoice_number}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span>{invoice.client.client_name}</span>
                                                <span className="text-[10px] text-sidebar-foreground/40">{invoice.client.email || 'No email'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{invoice.issue_date}</td>
                                        <td className="px-4 py-3 font-bold">${Number(invoice.total).toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className={cn('capitalize font-medium px-2 py-0', statusColors[invoice.status])}>
                                                {invoice.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={() => handleSendEmail(invoice)}
                                                disabled={sendingId !== null || !invoice.client.email}
                                            >
                                                {sendingId === invoice.id ? (
                                                    <Loader2 className="size-3.5 animate-spin" />
                                                ) : (
                                                    <Send className="size-3.5" />
                                                )}
                                                <span className="ml-1.5">Send</span>
                                            </Button>

                                            <div className="h-4 w-px bg-sidebar-border mx-1" />

                                            <a
                                                href={invoiceRoutes.pdf(invoice.id).url}
                                                target="_blank"
                                                className="h-8 px-2 text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1.5 group"
                                            >
                                                <ExternalLink className="size-3.5 text-slate-400 group-hover:text-slate-600" />
                                                <span>PDF</span>
                                            </a>
                                            <Link
                                                href={invoiceRoutes.edit(invoice.id).url}
                                                className="h-8 px-2 text-sm font-medium text-blue-500 hover:text-blue-600 flex items-center"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-sidebar-foreground/50">
                                        No invoices found.
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
    <AppLayout breadcrumbs={[{ title: 'Invoices', href: invoiceRoutes.index().url }]}>
        {page}
    </AppLayout>
);
