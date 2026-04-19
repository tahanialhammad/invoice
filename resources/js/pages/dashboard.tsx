import { Head, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import AppLayout from '@/layouts/app-layout';
import { CheckCircle, Users, Banknote, Clock, AlertCircle, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

// Register ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface DashboardStats {
    totalUsers?: number;
    adminUsers?: number;
    total_paid_invoices: number;
    total_revenue_this_year: number;
    pending_total_amount: number;
    overdue_total_amount: number;
}

interface ChartData {
    monthlyRevenue: { label: string; total: number }[];
    statusDistribution: Record<string, { count: number; total: number }>;
    topClients: { name: string; revenue: number }[];
}

export default function Dashboard({ stats, charts }: { stats: DashboardStats; charts: ChartData }) {
    const { auth } = usePage().props;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Revenue Chart Data
    const revenueChartData = {
        labels: charts.monthlyRevenue.map((d) => d.label),
        datasets: [
            {
                fill: true,
                label: 'Revenue',
                data: charts.monthlyRevenue.map((d) => d.total),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: 'rgb(59, 130, 246)',
            },
        ],
    };

    const revenueChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context: any) => `Revenue: ${formatCurrency(context.raw)}`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value: any) => formatCurrency(value),
                    maxTicksLimit: 5,
                },
                grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                },
            },
            x: {
                grid: { display: false },
            },
        },
    };

    // Status Chart Data
    const statusLabels = Object.keys(charts.statusDistribution);
    
    const statusColors: Record<string, string> = {
        paid: 'rgba(34, 197, 94, 0.8)',      // Green
        pending: 'rgba(234, 179, 8, 0.8)',   // Yellow
        overdue: 'rgba(239, 68, 68, 0.8)',   // Red
        cancelled: 'rgba(100, 116, 139, 0.8)', // Gray
        draft: 'rgba(71, 85, 105, 0.8)',     // Slate
        sent: 'rgba(59, 130, 246, 0.8)',      // Blue
    };

    const statusChartData = {
        labels: statusLabels.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        datasets: [
            {
                data: Object.values(charts.statusDistribution).map((d) => d.count),
                backgroundColor: statusLabels.map(s => statusColors[s] || 'rgba(156, 163, 175, 0.8)'),
                borderWidth: 0,
                hoverOffset: 4,
            },
        ],
    };

    // Top Clients Data
    const clientsChartData = {
        labels: charts.topClients.map((c) => c.name),
        datasets: [
            {
                label: 'Revenue',
                data: charts.topClients.map((c) => c.revenue),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderRadius: 6,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y' as const,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context: any) => `Total: ${formatCurrency(context.raw)}`,
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: { callback: (value: any) => formatCurrency(value) },
                grid: { color: 'rgba(156, 163, 175, 0.1)' },
            },
            y: {
                grid: { display: false },
            },
        },
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
                    <p className="text-sidebar-foreground/60">
                        {auth.user.is_admin ? `Administrative control for ${auth.user.name}` : `Welcome back, ${auth.user.name}`}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Stats Cards */}
                    <div className="rounded-xl border border-sidebar-border/70 p-6 bg-sidebar shadow-sm">
                        <div className="flex items-center gap-2 text-sidebar-foreground/60 mb-4">
                            <Banknote className="size-4" />
                            <h3 className="text-sm font-medium uppercase tracking-wider">Revenue</h3>
                        </div>
                        <div className="text-3xl font-bold">{formatCurrency(stats.total_revenue_this_year)}</div>
                        <p className="text-xs text-sidebar-foreground/40 mt-2">Paid revenue this year</p>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 p-6 bg-sidebar shadow-sm">
                        <div className="flex items-center gap-2 text-sidebar-foreground/60 mb-4">
                            <Clock className="size-4 text-yellow-500" />
                            <h3 className="text-sm font-medium uppercase tracking-wider">Pending</h3>
                        </div>
                        <div className="text-3xl font-bold">{formatCurrency(stats.pending_total_amount)}</div>
                        <p className="text-xs text-sidebar-foreground/40 mt-2">Awaiting payment</p>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 p-6 bg-sidebar shadow-sm">
                        <div className="flex items-center gap-2 text-sidebar-foreground/60 mb-4">
                            <AlertCircle className="size-4 text-red-500" />
                            <h3 className="text-sm font-medium uppercase tracking-wider">Overdue</h3>
                        </div>
                        <div className="text-3xl font-bold text-red-500">{formatCurrency(stats.overdue_total_amount)}</div>
                        <p className="text-xs text-sidebar-foreground/40 mt-2">Urgent attention needed</p>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 p-6 bg-sidebar shadow-sm">
                        <div className="flex items-center gap-2 text-sidebar-foreground/60 mb-4">
                            <CheckCircle className="size-4 text-green-500" />
                            <h3 className="text-sm font-medium uppercase tracking-wider">Status</h3>
                        </div>
                        <div className="text-3xl font-bold">{stats.total_paid_invoices}</div>
                        <p className="text-xs text-sidebar-foreground/40 mt-2">Invoices settled total</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Trend */}
                    <div className="lg:col-span-2 rounded-xl border border-sidebar-border/70 p-6 bg-sidebar shadow-sm flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-semibold">
                                <TrendingUp className="size-4 text-blue-500" />
                                Revenue Growth (12 Months)
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            {charts.monthlyRevenue.some(m => m.total > 0) ? (
                                <Line data={revenueChartData} options={revenueChartOptions} />
                            ) : (
                                <EmptyState message="No revenue data available yet" />
                            )}
                        </div>
                    </div>

                    {/* Status Distribution */}
                    <div className="rounded-xl border border-sidebar-border/70 p-6 bg-sidebar shadow-sm flex flex-col gap-4">
                        <div className="flex items-center gap-2 font-semibold">
                            <PieChart className="size-4 text-purple-500" />
                            Invoices by Status
                        </div>
                        <div className="h-[300px] w-full flex items-center justify-center p-4">
                            {statusLabels.length > 0 ? (
                                <Doughnut 
                                    data={statusChartData} 
                                    options={{ 
                                        responsive: true, 
                                        maintainAspectRatio: false,
                                        plugins: { legend: { position: 'bottom' as const } } 
                                    }} 
                                />
                            ) : (
                                <EmptyState message="No invoices created yet" />
                            )}
                        </div>
                    </div>

                    {/* Top Clients */}
                    <div className="lg:col-span-3 rounded-xl border border-sidebar-border/70 p-6 bg-sidebar shadow-sm flex flex-col gap-4">
                        <div className="flex items-center gap-2 font-semibold">
                            <BarChart3 className="size-4 text-orange-500" />
                            Top 5 Clients by Revenue
                        </div>
                        <div className="h-[250px] w-full">
                            {charts.topClients.length > 0 ? (
                                <Bar data={clientsChartData} options={barOptions} />
                            ) : (
                                <EmptyState message="No client revenue data available" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center text-center p-12 bg-sidebar-accent/5 rounded-lg border border-dashed border-sidebar-border/50">
            <BarChart3 className="size-10 text-sidebar-foreground/10 mb-2" />
            <p className="text-sm text-sidebar-foreground/40 font-medium">{message}</p>
        </div>
    );
}

Dashboard.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: dashboard().url }]}>
        {page}
    </AppLayout>
);
