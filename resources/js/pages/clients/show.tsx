import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import clientRoutes from '@/routes/clients';
import invoiceRoutes from '@/routes/invoices';
import AppLayout from '@/layouts/app-layout';
import ClientDetails from './partials/ClientDetails';
import ClientInvoices from './partials/ClientInvoices';
import { InvoiceStatus } from '../../invoices/partials/InvoiceStatusBadge';

interface Invoice {
    id: number;
    invoice_number: string;
    total: number;
    status: InvoiceStatus;
    issue_date: string;
}

interface Client {
    id: number;
    client_name: string;
    business_name: string;
    vat_number: string | null;
    address: string;
    email: string;
    phone: string | null;
    invoices: Invoice[];
}

export default function Show({ client }: { client: Client }) {
    return (
        <>
            <Head title={client.client_name} />
            <div className="flex h-full flex-1 flex-col gap-8 p-6 max-w-5xl mx-auto w-full">
                <div className="flex items-center justify-between">
                    <Link
                        href={clientRoutes.index()}
                        className="flex items-center text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors group"
                    >
                        <ArrowLeft className="mr-2 size-4 group-hover:-translate-x-1 transition-transform" /> 
                        Back to Clients
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href={invoiceRoutes.create()} data={{ client_id: client.id }}>
                            <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                                <PlusCircle className="mr-2 size-4" /> Create Invoice
                            </Button>
                        </Link>
                        <Link href={clientRoutes.edit(client.id)}>
                            <Button variant="outline" size="sm">
                                <Edit className="mr-2 size-4" /> Edit Profile
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-4xl font-black tracking-tight text-sidebar-foreground">
                            {client.client_name}
                        </h1>
                        <p className="text-sidebar-foreground/60 font-medium">Detailed overview for {client.business_name}</p>
                    </div>

                    <ClientDetails client={client} />

                    <ClientInvoices invoices={client.invoices} />
                </div>
            </div>
        </>
    );
}

Show.layout = (page: any) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Clients', href: clientRoutes.index() },
            { title: 'Client Details', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
