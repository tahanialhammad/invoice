import { BarChart3 } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import EmptyState from './EmptyState';

interface TopClientsCardProps {
    data: { name: string; revenue: number }[];
    formatCurrency: (val: number) => string;
}

export default function TopClientsCard({ data, formatCurrency }: TopClientsCardProps) {
    const chartData = {
        labels: data.map((c) => c.name),
        datasets: [
            {
                label: 'Revenue',
                data: data.map((c) => c.revenue),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderRadius: 6,
            },
        ],
    };

    const options = {
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
            y: { grid: { display: false } },
        },
    };

    return (
        <div className="lg:col-span-3 rounded-xl border border-sidebar-border/70 p-6 bg-sidebar shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 font-semibold">
                <BarChart3 className="size-4 text-orange-500" />
                Top 5 Clients by Revenue
            </div>
            <div className="h-[250px] w-full">
                {data.length > 0 ? (
                    <Bar data={chartData} options={options} />
                ) : (
                    <EmptyState message="No client revenue data available" />
                )}
            </div>
        </div>
    );
}
