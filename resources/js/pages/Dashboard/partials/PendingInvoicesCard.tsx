import { Clock } from 'lucide-react';
import StatCard from './StatCard';

interface PendingInvoicesCardProps {
    amount: number;
}

export default function PendingInvoicesCard({ amount }: PendingInvoicesCardProps) {
    const formatted = new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(amount);

    return (
        <StatCard 
            title="Pending Payment"
            value={formatted}
            subtext="Awaiting client action"
            icon={Clock}
            iconClassName="text-yellow-500"
        />
    );
}
