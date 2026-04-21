import { Head, useForm } from '@inertiajs/react';
import invoiceRoutes from '@/routes/invoices';
import AppLayout from '@/layouts/app-layout';
import InvoiceForm from './partials/InvoiceForm';

interface Client {
    id: number;
    client_name: string;
}

interface InvoiceItem {
    id?: number;
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
}

interface Invoice {
    id: number;
    client_id: string;
    invoice_number: string;
    status: string;
    issue_date: string;
    due_date: string;
    is_recurring?: boolean;
    recurring_interval?: string;
    items: InvoiceItem[];
}

export default function Edit({ invoice, clients }: { invoice: Invoice; clients: Client[] }) {
    const { data, setData, put, processing, errors } = useForm({
        client_id: invoice.client_id,
        invoice_number: invoice.invoice_number,
        status: invoice.status,
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
        is_recurring: invoice.is_recurring ?? false,
        recurring_interval: invoice.recurring_interval ?? 'monthly',
        items: invoice.items.length > 0 ? invoice.items : [{ description: '', quantity: 1, unit_price: 0, tax_rate: 0 }],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(invoiceRoutes.update(invoice.id).url);
    };

    return (
        <>
            <Head title="Edit Invoice" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Edit Invoice</h1>
                    <p className="text-sidebar-foreground/60">Update the details of your invoice #{invoice.invoice_number}.</p>
                </div>

                <InvoiceForm 
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    clients={clients}
                    submit={submit}
                    submitLabel="Update Invoice"
                />
            </div>
        </>
    );
}

Edit.layout = (page: any) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Invoices', href: invoiceRoutes.index().url },
            { title: 'Edit Invoice', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
