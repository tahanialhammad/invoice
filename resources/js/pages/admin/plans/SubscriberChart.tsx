import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDataPoint {
    name: string;
    subscribers: number;
}

interface Props {
    data: ChartDataPoint[];
}

export default function SubscriberChart({ data }: Props) {
    const chartData = {
        labels: data.map(d => d.name),
        datasets: [
            {
                label: 'Active Subscribers',
                data: data.map(d => d.subscribers),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                }
            }
        }
    };

    return (
        <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Subscribers per Plan
                </CardTitle>
                <CardDescription>Overview of active subscriptions across all tiers.</CardDescription>
            </CardHeader>
            <CardContent>
                <Bar options={options} data={chartData} />
            </CardContent>
        </Card>
    );
}
