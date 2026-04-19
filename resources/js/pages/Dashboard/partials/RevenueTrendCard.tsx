import { TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import EmptyState from './EmptyState';

interface RevenueTrendCardProps {
    data: { label: string; total: number }[];
    formatCurrency: (val: number) => string;
}

export default function RevenueTrendCard({ data, formatCurrency }: RevenueTrendCardProps) {
    const chartData = {
        labels: data.map((d) => d.label),
        datasets: [
            {
                fill: true,
                label: 'Revenue',
                data: data.map((d) => d.total),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: 'rgb(59, 130, 246)',
            },
        ],
    };

    const options = {
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
                grid: { color: 'rgba(156, 163, 175, 0.1)' },
            },
            x: { grid: { display: false } },
        },
    };

    return (
        <div className="lg:col-span-2 rounded-xl border border-sidebar-border/70 p-6 bg-sidebar shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 font-semibold">
                <TrendingUp className="size-4 text-blue-500" />
                Revenue Growth (12 Months)
            </div>
            <div className="h-[300px] w-full">
                {data.some(m => m.total > 0) ? (
                    <Line data={chartData} options={options} />
                ) : (
                    <EmptyState message="No revenue data available yet" />
                )}
            </div>
        </div>
    );
}
