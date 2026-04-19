import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    icon: LucideIcon;
    iconClassName?: string;
    valueClassName?: string;
    children?: ReactNode;
    className?: string;
}

export default function StatCard({
    title,
    value,
    subtext,
    icon: Icon,
    iconClassName,
    valueClassName,
    children,
    className
}: StatCardProps) {
    return (
        <div className={cn("rounded-xl border border-sidebar-border/70 p-6 bg-sidebar shadow-sm flex flex-col justify-between", className)}>
            <div>
                <div className="flex items-center gap-2 text-sidebar-foreground/60 mb-4">
                    <Icon className={cn("size-4", iconClassName)} />
                    <h3 className="text-xs font-semibold uppercase tracking-wider">{title}</h3>
                </div>
                <div className={cn("text-3xl font-bold tracking-tight text-sidebar-foreground", valueClassName)}>
                    {value}
                </div>
                {subtext && (
                    <p className="text-xs text-sidebar-foreground/40 mt-2 font-medium">
                        {subtext}
                    </p>
                )}
            </div>
            {children && <div className="mt-4">{children}</div>}
        </div>
    );
}
