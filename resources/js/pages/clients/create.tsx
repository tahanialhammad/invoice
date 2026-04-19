import { Head, useForm } from '@inertiajs/react';
import clientRoutes from '@/routes/clients';
import AppLayout from '@/layouts/app-layout';
import ClientForm from './partials/ClientForm';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        client_name: '',
        business_name: '',
        vat_number: '',
        address: '',
        email: '',
        phone: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(clientRoutes.store(), {
            onSuccess: () => {},
        });
    };

    return (
        <>
            <Head title="Add Client" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black tracking-tight text-sidebar-foreground">Add New Client</h1>
                    <p className="text-sidebar-foreground/60 text-sm font-medium">Create a new client profile for your billing system.</p>
                </div>

                <ClientForm 
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    submit={submit}
                    submitLabel="Save Client"
                />
            </div>
        </>
    );
}

Create.layout = (page: any) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Clients', href: clientRoutes.index() },
            { title: 'Add Client', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
