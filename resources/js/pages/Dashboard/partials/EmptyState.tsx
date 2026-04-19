import { BarChart3 } from 'lucide-react';

export default function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center text-center p-12 bg-sidebar-accent/5 rounded-lg border border-dashed border-sidebar-border/50">
            <BarChart3 className="size-10 text-sidebar-foreground/10 mb-2" />
            <p className="text-sm text-sidebar-foreground/40 font-medium">{message}</p>
        </div>
    );
}
