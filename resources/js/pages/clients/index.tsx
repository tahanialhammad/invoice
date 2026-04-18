import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { clients as clientRoutes } from '@/routes';

interface Client {
    id: number;
    client_name: string;
    business_name: string;
    email: string;
    phone: string | null;
}

export default function Index({ clients }: { clients: Client[] }) {
    return (
        <>
            <Head title="Clients" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Clients</h1>
                    <Link
                        href={clientRoutes.create()}
                        className={cn(buttonVariants(), 'gap-2')}
                    >
                        <Plus className="size-4" />
                        Add Client
                    </Link>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-sidebar overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="border-b border-sidebar-border/70 bg-sidebar-accent/50">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-sidebar-foreground/70">Name</th>
                                <th className="px-4 py-3 font-semibold text-sidebar-foreground/70">Business</th>
                                <th className="px-4 py-3 font-semibold text-sidebar-foreground/70">Email</th>
                                <th className="px-4 py-3 font-semibold text-sidebar-foreground/70">Phone</th>
                                <th className="px-4 py-3 font-semibold text-sidebar-foreground/70 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/70">
                            {clients.length > 0 ? (
                                clients.map((client) => (
                                    <tr key={client.id} className="hover:bg-sidebar-accent/30 transition-colors">
                                        <td className="px-4 py-3 font-medium">{client.client_name}</td>
                                        <td className="px-4 py-3">{client.business_name}</td>
                                        <td className="px-4 py-3">{client.email}</td>
                                        <td className="px-4 py-3">{client.phone || '-'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={clientRoutes.edit(client.id)}
                                                className="text-sm font-medium text-blue-500 hover:text-blue-600 underline-offset-4 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-sidebar-foreground/50">
                                        No clients found. Click "Add Client" to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

// @ts-ignore
Index.layout = (page: any) => {
    // We can't easily import the layout here without knowing the exact structure
    // But usually in these starter kits it's wrapped in an AppShell
    // I'll try to find where AppShell is.
    return page;
};
