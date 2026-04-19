import { Banknote } from 'lucide-react';
import StatCard from './StatCard';

interface RevenueCardProps {
    amount: number;
}

export default function RevenueCard({ amount }: RevenueCardProps) {
    const formatted = new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(amount);

    return (
        <StatCard 
            title="Total Revenue"
            value={formatted}
            subtext={`Revenue for ${new Date().getFullYear()}`}
            icon={Banknote}
            iconClassName="text-blue-500"
        />
    );
}
