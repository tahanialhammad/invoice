import { Head, useForm } from '@inertiajs/react';
import invoiceRoutes from '@/routes/invoices';
import AppLayout from '@/layouts/app-layout';
import InvoiceForm from './partials/InvoiceForm';

interface Client {
    id: number;
    client_name: string;
}

export default function Create({ clients }: { clients: Client[] }) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: '',
        invoice_number: `INV-${Date.now()}`,
        status: 'pending',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [{ description: '', quantity: 1, unit_price: 0, tax_rate: 0 }],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(invoiceRoutes.store().url);
    };

    return (
        <>
            <Head title="Create Invoice" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
                    <p className="text-sidebar-foreground/60">Generate a professional invoice for your client.</p>
                </div>

                <InvoiceForm 
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    clients={clients}
                    submit={submit}
                    submitLabel="Create Invoice"
                />
            </div>
        </>
    );
}

Create.layout = (page: any) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Invoices', href: invoiceRoutes.index().url },
            { title: 'Create Invoice', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
