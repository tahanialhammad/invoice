import { CheckCircle } from 'lucide-react';
import StatCard from './StatCard';

interface PaidInvoicesCardProps {
    count: number;
}

export default function PaidInvoicesCard({ count }: PaidInvoicesCardProps) {
    return (
        <StatCard 
            title="Invoices Paid"
            value={count}
            subtext="Lifetime settled invoices"
            icon={CheckCircle}
            iconClassName="text-green-500"
        />
    );
}
