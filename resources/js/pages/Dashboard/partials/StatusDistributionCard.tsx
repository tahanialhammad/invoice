import { PieChart as PieChartIcon } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import EmptyState from './EmptyState';

interface StatusDistributionCardProps {
    data: Record<string, { count: number; total: number }>;
}

export default function StatusDistributionCard({ data }: StatusDistributionCardProps) {
    const statusLabels = Object.keys(data);
    
    const statusColors: Record<string, string> = {
        paid: 'rgba(34, 197, 94, 0.8)',
        pending: 'rgba(234, 179, 8, 0.8)',
        overdue: 'rgba(239, 68, 68, 0.8)',
        cancelled: 'rgba(100, 116, 139, 0.8)',
        draft: 'rgba(71, 85, 105, 0.8)',
        sent: 'rgba(59, 130, 246, 0.8)',
    };

    const chartData = {
        labels: statusLabels.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        datasets: [
            {
                data: Object.values(data).map((d) => d.count),
                backgroundColor: statusLabels.map(s => statusColors[s] || 'rgba(156, 163, 175, 0.8)'),
                borderWidth: 0,
                hoverOffset: 4,
            },
        ],
    };

    return (
        <div className="rounded-xl border border-sidebar-border/70 p-6 bg-sidebar shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 font-semibold">
                <PieChartIcon className="size-4 text-purple-500" />
                Invoices by Status
            </div>
            <div className="h-[300px] w-full flex items-center justify-center p-4">
                {statusLabels.length > 0 ? (
                    <Doughnut 
                        data={chartData} 
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
    );
}
