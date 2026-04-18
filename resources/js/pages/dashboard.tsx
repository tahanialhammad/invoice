import { Head, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';
import { CheckCircle, Users, Banknote, Clock, AlertCircle } from 'lucide-react';

interface DashboardStats {
    totalUsers?: number;
    adminUsers?: number;
    regularUsers?: number;
    total_paid_invoices: number;
    total_paid_invoices_this_year: number;
    total_revenue_this_year: number;
    pending_total_amount: number;
    pending_invoices_count: number;
    overdue_total_amount: number;
}

export default function Dashboard({ stats }: { stats?: DashboardStats | null }) {
    const { auth } = usePage().props;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border bg-sidebar text-sidebar-foreground">
                    <h2 className="text-xl font-semibold">
                        {auth.user.is_admin ? `Hello admin: ${auth.user.name}` : `Hello user: ${auth.user.name}`}
                    </h2>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    {/* System Overview (Admin Only) */}
                    {auth.user.is_admin && stats && (
                        <div className="flex flex-col justify-center rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border bg-sidebar">
                            <div className="flex items-center gap-2 text-sidebar-foreground/70">
                                <Users className="size-4" />
                                <h3 className="text-sm font-medium">Users Overview</h3>
                            </div>
                            <div className="mt-4 flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-sidebar-foreground">{stats.totalUsers}</span>
                                <span className="text-sm text-sidebar-foreground/70">Total</span>
                            </div>
                            <div className="mt-1 text-sm text-sidebar-foreground/70">
                                {stats.adminUsers} Admin{stats.adminUsers !== 1 ? 's' : ''} • {stats.regularUsers} Regular
                            </div>
                        </div>
                    )}

                    {/* Total Revenue */}
                    {stats && (
                        <div className="flex flex-col justify-center rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border bg-sidebar">
                            <div className="flex items-center gap-2 text-sidebar-foreground/70">
                                <Banknote className="size-4" />
                                <h3 className="text-sm font-medium">Total Revenue</h3>
                            </div>
                            <div className="mt-4 flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-sidebar-foreground">{formatCurrency(stats.total_revenue_this_year)}</span>
                            </div>
                            <div className="mt-1 text-sm text-sidebar-foreground/70">
                                Revenue for {new Date().getFullYear()}
                            </div>
                        </div>
                    )}

                    {/* Pending Invoices */}
                    {stats && (
                        <div className="flex flex-col justify-center rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border bg-sidebar">
                            <div className="flex items-center gap-2 text-sidebar-foreground/70">
                                <Clock className="size-4" />
                                <h3 className="text-sm font-medium">Pending</h3>
                            </div>
                            <div className="mt-4 flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-sidebar-foreground">{formatCurrency(stats.pending_total_amount)}</span>
                            </div>
                            <div className="mt-1 text-sm text-sidebar-foreground/70">
                                {stats.pending_invoices_count} invoice{stats.pending_invoices_count !== 1 ? 's' : ''} awaiting payment
                            </div>
                        </div>
                    )}

                    {/* Overdue Invoices */}
                    {stats && (
                        <div className="flex flex-col justify-center rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border bg-sidebar">
                            <div className="flex items-center gap-2 text-sidebar-foreground/70">
                                <AlertCircle className="size-4" />
                                <h3 className="text-sm font-medium text-red-500">Overdue</h3>
                            </div>
                            <div className="mt-4 flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-red-500">{formatCurrency(stats.overdue_total_amount)}</span>
                            </div>
                            <div className="mt-1 text-sm text-sidebar-foreground/70">
                                Needs immediate attention
                            </div>
                        </div>
                    )}

                    {/* Paid Invoices Success Count */}
                    {stats && (
                        <div className="flex flex-col justify-center rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border bg-sidebar">
                            <div className="flex items-center gap-2 text-sidebar-foreground/70">
                                <CheckCircle className="size-4" />
                                <h3 className="text-sm font-medium">Paid Invoices</h3>
                            </div>
                            <div className="mt-4 flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-sidebar-foreground">{stats.total_paid_invoices}</span>
                                <span className="text-sm text-sidebar-foreground/70">Total Paid</span>
                            </div>
                            <div className="mt-1 text-sm text-sidebar-foreground/70">
                                {stats.total_paid_invoices_this_year} paid this year
                            </div>
                        </div>
                    )}

                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
