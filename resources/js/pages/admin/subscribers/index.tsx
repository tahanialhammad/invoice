import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, FileText, ShieldCheck, CalendarClock } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Subscriber {
    id: number;
    name: string;
    email: string;
    created_at: string;
    clients_count: number;
    invoices_count: number;
    plan: string;
    plan_slug: string;
    subscription_status: string;
    subscription_ends_at: string | null;
}

interface Props {
    subscribers: Subscriber[];
}

const planVariant = (slug: string): 'default' | 'secondary' | 'outline' => {
    if (['pro', 'business'].includes(slug)) return 'default';
    if (slug === 'basic') return 'secondary';
    return 'outline';
};

const statusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (status === 'active') return 'default';
    if (status === 'cancelled' || status === 'expired') return 'destructive';
    return 'outline';
};

export default function AdminSubscribersIndex({ subscribers }: Props) {
    const totalActive   = subscribers.filter(s => s.subscription_status === 'active').length;
    const totalInvoices = subscribers.reduce((sum, s) => sum + s.invoices_count, 0);

    return (
        <>
            <Head title="Subscriber Management" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">

                {/* Header */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Admin Panel</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Subscriber Management</h1>
                    <p className="text-muted-foreground">
                        All registered users and their subscription status across the platform.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Users className="h-4 w-4" /> Total Users
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{subscribers.length}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <CreditCard className="h-4 w-4" /> Active Subscriptions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-primary">{totalActive}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Total Invoices
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{totalInvoices}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* List */}
                <Card className="overflow-hidden">
                    {/* Table header row */}
                    <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_80px_80px_1fr_1fr] gap-4 px-6 py-3 bg-muted/40 border-b text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <span>User</span>
                        <span>Plan</span>
                        <span>Status</span>
                        <span className="text-center">Clients</span>
                        <span className="text-center">Invoices</span>
                        <span>Registered</span>
                        <span>Renews / Ends</span>
                    </div>

                    {subscribers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                            <Users className="h-8 w-8 opacity-30" />
                            <p className="text-sm">No subscribers found.</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {subscribers.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_80px_80px_1fr_1fr] gap-4 items-center px-6 py-4 hover:bg-muted/20 transition-colors"
                                >
                                    {/* User */}
                                    <div>
                                        <p className="font-medium leading-tight">{sub.name}</p>
                                        <p className="text-xs text-muted-foreground">{sub.email}</p>
                                    </div>

                                    {/* Plan */}
                                    <div>
                                        <span className="md:hidden text-xs text-muted-foreground mr-1">Plan:</span>
                                        <Badge variant={planVariant(sub.plan_slug)}>{sub.plan}</Badge>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <span className="md:hidden text-xs text-muted-foreground mr-1">Status:</span>
                                        <Badge variant={statusVariant(sub.subscription_status)}>
                                            {sub.subscription_status === 'none' ? 'No Sub' : sub.subscription_status}
                                        </Badge>
                                    </div>

                                    {/* Clients */}
                                    <div className="text-center">
                                        <span className="md:hidden text-xs text-muted-foreground mr-1">Clients:</span>
                                        <span className="font-semibold">{sub.clients_count}</span>
                                    </div>

                                    {/* Invoices */}
                                    <div className="text-center">
                                        <span className="md:hidden text-xs text-muted-foreground mr-1">Invoices:</span>
                                        <span className="font-semibold">{sub.invoices_count}</span>
                                    </div>

                                    {/* Registered */}
                                    <div className="text-sm text-muted-foreground">
                                        <span className="md:hidden text-xs mr-1">Registered:</span>
                                        {sub.created_at}
                                    </div>

                                    {/* Ends */}
                                    <div className="text-sm text-muted-foreground">
                                        {sub.subscription_ends_at ? (
                                            <span className="flex items-center gap-1">
                                                <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                                                {sub.subscription_ends_at}
                                            </span>
                                        ) : (
                                            <span>—</span>
                                        )}
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

AdminSubscribersIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Admin', href: '#' },
            { title: 'Subscribers', href: '/admin/subscribers' },
        ]}
    >
        {page}
    </AppLayout>
);
