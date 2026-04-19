import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type InvoiceStatus = 'draft' | 'sent' | 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceStatusBadgeProps {
    status: InvoiceStatus;
    className?: string;
}

export const statusColors: Record<InvoiceStatus, string> = {
    draft: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    sent: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    paid: 'bg-green-500/10 text-green-500 border-green-500/20',
    overdue: 'bg-red-500/10 text-red-500 border-red-500/20',
    cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

export default function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
    return (
        <Badge 
            variant="outline" 
            className={cn('capitalize font-medium px-2 py-0', statusColors[status], className)}
        >
            {status}
        </Badge>
    );
}
