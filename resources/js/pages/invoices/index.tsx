import { Head, Link, Deferred, usePage } from '@inertiajs/react';
import { Plus, AlertCircle } from 'lucide-react';
import profile from '@/routes/profile';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import invoiceRoutes from '@/routes/invoices';
import AppLayout from '@/layouts/app-layout';
import InvoiceTable from './partials/InvoiceTable';
import FilterBar from './partials/FilterBar';
import { InvoiceStatus } from './partials/InvoiceStatusBadge';
import { Loader2 } from 'lucide-react';

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

interface IndexProps {
    invoices?: Invoice[];
    clients?: { id: number; client_name: string }[];
    filters: { search?: string; status?: string; client_id?: string };
}

export default function Index({ invoices, clients, filters }: IndexProps) {
    const { auth } = usePage().props;

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

                {!auth.isProfileComplete && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                <AlertCircle className="size-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-blue-900">Your profile is incomplete!</h4>
                                <p className="text-xs text-blue-700">Add your company logo and VAT number to personalize your invoices.</p>
                            </div>
                        </div>
                        <Link 
                            href={profile.edit().url} 
                            className="text-xs font-bold text-blue-700 hover:text-blue-800 underline uppercase tracking-wider"
                        >
                            Complete Setup
                        </Link>
                    </div>
                )}

                <FilterBar filters={filters} clients={clients || []} />

                <Deferred data={['invoices', 'clients']} fallback={
                    <div className="flex h-64 items-center justify-center rounded-xl border border-sidebar-border/70 bg-sidebar/50">
                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                            <Loader2 className="size-8 animate-spin text-primary" />
                            <p className="text-sm font-medium">Loading invoices...</p>
                        </div>
                    </div>
                }>
                    <InvoiceTable invoices={invoices || []} />
                </Deferred>
            </div>
        </>
    );
}

Index.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Invoices', href: invoiceRoutes.index().url }]}>
        {page}
    </AppLayout>
);
