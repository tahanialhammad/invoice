import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import clientRoutes from '@/routes/clients';
import AppLayout from '@/layouts/app-layout';

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
        post(clientRoutes.store().url);
    };

    return (
        <>
            <Head title="Create Client" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-2xl mx-auto w-full">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold">New Client</h1>
                    <p className="text-sidebar-foreground/60">Add a new client to your management system.</p>
                </div>

                <form onSubmit={submit} className="space-y-6 rounded-xl border border-sidebar-border/70 bg-sidebar p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="client_name">Client Name</Label>
                            <Input
                                id="client_name"
                                value={data.client_name}
                                onChange={(e) => setData('client_name', e.target.value)}
                                placeholder="e.g. John Doe"
                            />
                            {errors.client_name && <p className="text-sm text-red-500">{errors.client_name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="business_name">Business Name</Label>
                            <Input
                                id="business_name"
                                value={data.business_name}
                                onChange={(e) => setData('business_name', e.target.value)}
                                placeholder="e.g. Acme Corp"
                            />
                            {errors.business_name && <p className="text-sm text-red-500">{errors.business_name}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="client@example.com"
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number (Optional)</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="+1 (555) 000-0000"
                            />
                            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vat_number">VAT Number (Optional)</Label>
                            <Input
                                id="vat_number"
                                value={data.vat_number}
                                onChange={(e) => setData('vat_number', e.target.value)}
                                placeholder="e.g. US123456789"
                            />
                            {errors.vat_number && <p className="text-sm text-red-500">{errors.vat_number}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Full Address</Label>
                        <Textarea
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Street, City, Country"
                            className="min-h-[100px]"
                        />
                        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 size-4 animate-spin" />}
                            Create Client
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = (page: any) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Clients', href: clientRoutes.index() },
            { title: 'New Client', href: clientRoutes.create() },
        ]}
    >
        {page}
    </AppLayout>
);
