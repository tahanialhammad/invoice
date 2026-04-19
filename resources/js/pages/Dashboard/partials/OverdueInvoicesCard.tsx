import { AlertCircle } from 'lucide-react';
import StatCard from './StatCard';

interface OverdueInvoicesCardProps {
    amount: number;
}

export default function OverdueInvoicesCard({ amount }: OverdueInvoicesCardProps) {
    const formatted = new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(amount);

    return (
        <StatCard 
            title="Overdue"
            value={formatted}
            subtext="Needs immediate attention"
            icon={AlertCircle}
            iconClassName="text-red-500"
            valueClassName="text-red-600"
        />
    );
}
