import { Link, router } from '@inertiajs/react';
import { Edit, Eye, Trash2, PlusCircle } from 'lucide-react';
import clientRoutes from '@/routes/clients';
import invoiceRoutes from '@/routes/invoices';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ClientActionsProps {
    client: {
        id: number;
        client_name: string;
    };
    showView?: boolean;
}

export default function ClientActions({ client, showView = true }: ClientActionsProps) {
    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        if (confirm(`Are you sure you want to delete ${client.client_name}? This will also delete all associated invoices.`)) {
            router.delete(clientRoutes.destroy(client.id));
        }
    };

    return (
        <div className="flex items-center justify-end gap-1">
            <Link
                href={invoiceRoutes.create()}
                data={{ client_id: client.id }}
                className="h-8 px-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 flex items-center gap-1.5 rounded-md transition-colors"
                title="Create Invoice"
            >
                <PlusCircle className="size-3.5" />
                <span className="hidden md:inline">Invoice</span>
            </Link>

            <div className="h-4 w-px bg-sidebar-border mx-1" />

            {showView && (
                <Link
                    href={clientRoutes.show(client.id)}
                    className="h-8 px-2 text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1.5 transition-colors"
                    title="View Details"
                >
                    <Eye className="size-3.5" />
                    <span className="hidden md:inline">View</span>
                </Link>
            )}

            <Link
                href={clientRoutes.edit(client.id)}
                className="h-8 px-2 text-sm font-medium text-blue-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                title="Edit Client"
            >
                <Edit className="size-3.5" />
                <span className="hidden md:inline">Edit</span>
            </Link>

            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50"
                onClick={handleDelete}
                title="Delete Client"
            >
                <Trash2 className="size-3.5" />
            </Button>
        </div>
    );
}
