import { Head, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import AppLayout from '@/layouts/app-layout';
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

import DashboardHeader from './partials/DashboardHeader';
import StatsGrid from './partials/StatsGrid';
import RevenueCard from './partials/RevenueCard';
import PendingInvoicesCard from './partials/PendingInvoicesCard';
import OverdueInvoicesCard from './partials/OverdueInvoicesCard';
import PaidInvoicesCard from './partials/PaidInvoicesCard';
import RevenueTrendCard from './partials/RevenueTrendCard';
import StatusDistributionCard from './partials/StatusDistributionCard';
import TopClientsCard from './partials/TopClientsCard';

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

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6 max-w-7xl mx-auto w-full">
                
                <DashboardHeader 
                    name={auth.user.name} 
                    isAdmin={auth.user.is_admin} 
                />

                <StatsGrid>
                    <RevenueCard amount={stats.total_revenue_this_year} />
                    <PendingInvoicesCard amount={stats.pending_total_amount} />
                    <OverdueInvoicesCard amount={stats.overdue_total_amount} />
                    <PaidInvoicesCard count={stats.total_paid_invoices} />
                </StatsGrid>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <RevenueTrendCard 
                        data={charts.monthlyRevenue} 
                        formatCurrency={formatCurrency} 
                    />
                    
                    <StatusDistributionCard 
                        data={charts.statusDistribution} 
                    />

                    <TopClientsCard 
                        data={charts.topClients} 
                        formatCurrency={formatCurrency} 
                    />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: dashboard().url }]}>
        {page}
    </AppLayout>
);
