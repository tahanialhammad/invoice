import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Clock, FileText, ShieldCheck, CalendarRange } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface BillingInvoice {
    id: number;
    invoice_number: string;
    client_name: string;
    client_email: string;
    plan: string;
    amount: number;
    status: string;
    issue_date: string | null;
    due_date: string | null;
    period_start: string | null;
    period_end: string | null;
}

interface Stats {
    total_revenue: number;
    pending_amount: number;
    total_invoices: number;
}

interface Props {
    invoices: BillingInvoice[];
    stats: Stats;
}

const statusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
        case 'paid':      return 'default';
        case 'pending':   return 'secondary';
        case 'overdue':   return 'destructive';
        case 'cancelled': return 'destructive';
        default:          return 'outline';
    }
};

const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export default function AdminBillingIndex({ invoices, stats }: Props) {
    return (
        <>
            <Head title="Subscription Billing" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">

                {/* Header */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Admin Panel</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Subscription Billing</h1>
                    <p className="text-muted-foreground">
                        All subscription invoices generated for active subscribers.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-500" /> Total Revenue
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-green-600">{fmt(stats.total_revenue)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Clock className="h-4 w-4 text-amber-500" /> Pending
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-amber-600">{fmt(stats.pending_amount)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Total Invoices
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.total_invoices}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Invoice List */}
                <Card className="overflow-hidden">
                    {/* Column headers */}
                    <div className="hidden lg:grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-muted/40 border-b text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <span>Subscriber</span>
                        <span>Billing Period</span>
                        <span>Invoice #</span>
                        <span>Amount</span>
                        <span>Status</span>
                        <span>Due Date</span>
                    </div>

                    {invoices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground">
                            <FileText className="h-8 w-8 opacity-30" />
                            <p className="text-sm">No subscription invoices yet.</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {invoices.map((inv) => (
                                <div
                                    key={inv.id}
                                    className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] gap-3 items-center px-6 py-4 hover:bg-muted/20 transition-colors"
                                >
                                    {/* Subscriber */}
                                    <div>
                                        <p className="font-medium">{inv.client_name}</p>
                                        <p className="text-xs text-muted-foreground">{inv.client_email}</p>
                                    </div>

                                    {/* Billing Period */}
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <CalendarRange className="h-3.5 w-3.5 shrink-0" />
                                        {inv.period_start && inv.period_end ? (
                                            <span>{inv.period_start} → {inv.period_end}</span>
                                        ) : (
                                            <span className="italic">No period set</span>
                                        )}
                                    </div>

                                    {/* Invoice number */}
                                    <div>
                                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                            {inv.invoice_number}
                                        </code>
                                    </div>

                                    {/* Amount */}
                                    <div className="font-semibold">{fmt(inv.amount)}</div>

                                    {/* Status */}
                                    <div>
                                        <Badge variant={statusVariant(inv.status)}>
                                            {inv.status}
                                        </Badge>
                                    </div>

                                    {/* Due date */}
                                    <div className="text-sm text-muted-foreground">
                                        {inv.due_date ?? '—'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
}

AdminBillingIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Admin', href: '#' },
            { title: 'Billing', href: '/admin/billing' },
        ]}
    >
        {page}
    </AppLayout>
);
