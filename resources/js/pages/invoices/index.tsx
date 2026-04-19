import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import invoiceRoutes from '@/routes/invoices';
import AppLayout from '@/layouts/app-layout';
import InvoiceTable from './partials/InvoiceTable';
import { InvoiceStatus } from './partials/InvoiceStatusBadge';

interface Client {
    client_name: string;
    email?: string;
}

interface Invoice {
    id: number;
    invoice_number: string;
    client: Client;
    total: number;
    status: InvoiceStatus;
    issue_date: string;
}

export default function Index({ invoices }: { invoices: Invoice[] }) {
    return (
        <>
            <Head title="Invoices" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
                        <p className="text-sidebar-foreground/60 text-sm">Manage your billing and client payments here.</p>
                    </div>
                    <Link
                        href={invoiceRoutes.create().url}
                        className={cn(buttonVariants(), 'gap-2 shadow-sm')}
                    >
                        <Plus className="size-4" />
                        Create Invoice
                    </Link>
                </div>

                <InvoiceTable invoices={invoices} />
            </div>
        </>
    );
}

Index.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Invoices', href: invoiceRoutes.index().url }]}>
        {page}
    </AppLayout>
);
