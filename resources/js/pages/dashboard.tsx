import { Head, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';
import { CheckCircle, Users } from 'lucide-react';

interface DashboardStats {
    totalUsers?: number;
    adminUsers?: number;
    regularUsers?: number;
    total_paid_invoices: number;
    total_paid_invoices_this_year: number;
}

export default function Dashboard({ stats }: { stats?: DashboardStats | null }) {
    const { auth } = usePage().props;

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

                    {!auth.user.is_admin && (
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    )}

                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    {(!auth.user.is_admin || !stats) && (
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
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
