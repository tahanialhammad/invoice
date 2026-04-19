import { Head, useForm } from '@inertiajs/react';
import clientRoutes from '@/routes/clients';
import AppLayout from '@/layouts/app-layout';
import ClientForm from './partials/ClientForm';

interface Client {
    id: number;
    client_name: string;
    business_name: string;
    vat_number: string | null;
    address: string;
    email: string;
    phone: string | null;
}

export default function Edit({ client }: { client: Client }) {
    const { data, setData, put, processing, errors } = useForm({
        client_name: client.client_name,
        business_name: client.business_name,
        vat_number: client.vat_number || '',
        address: client.address,
        email: client.email,
        phone: client.phone || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(clientRoutes.update(client.id));
    };

    return (
        <>
            <Head title={`Edit ${client.client_name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black tracking-tight text-sidebar-foreground">Edit Client Profile</h1>
                    <p className="text-sidebar-foreground/60 text-sm font-medium">Update contact information for {client.client_name}.</p>
                </div>

                <ClientForm 
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    submit={submit}
                    submitLabel="Update Client"
                />
            </div>
        </>
    );
}

Edit.layout = (page: any) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Clients', href: clientRoutes.index() },
            { title: 'Edit Client', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
