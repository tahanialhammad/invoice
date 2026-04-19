import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import clientRoutes from '@/routes/clients';
import AppLayout from '@/layouts/app-layout';
import ClientsTable from './partials/ClientsTable';

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
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-black tracking-tight text-sidebar-foreground">Clients</h1>
                        <p className="text-sidebar-foreground/60 text-sm font-medium">Manage your customer relationships and contact database.</p>
                    </div>
                    <Link
                        href={clientRoutes.create()}
                        className={cn(buttonVariants(), 'gap-2 shadow-sm')}
                    >
                        <Plus className="size-4" />
                        Add Client
                    </Link>
                </div>

                <ClientsTable clients={clients} />
            </div>
        </>
    );
}

Index.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Clients', href: clientRoutes.index() }]}>
        {page}
    </AppLayout>
);
