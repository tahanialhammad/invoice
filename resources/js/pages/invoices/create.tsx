import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { invoices as invoiceRoutes } from '@/routes';

interface Client {
    id: number;
    client_name: string;
}

export default function Create({ clients }: { clients: Client[] }) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: '',
        invoice_number: `INV-${Date.now()}`,
        total: '',
        status: 'pending',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(invoiceRoutes.store().url);
    };

    return (
        <>
            <Head title="Create Invoice" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-2xl mx-auto w-full">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold">Create Invoice</h1>
                    <p className="text-sidebar-foreground/60">Generate a new invoice for one of your clients.</p>
                </div>

                <form onSubmit={submit} className="space-y-6 rounded-xl border border-sidebar-border/70 bg-sidebar p-6">
                    <div className="space-y-2">
                        <Label htmlFor="client_id">Select Client</Label>
                        <select
                            id="client_id"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={data.client_id}
                            onChange={(e) => setData('client_id', e.target.value)}
                        >
                            <option value="">Choose a client...</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.client_name}
                                </option>
                            ))}
                        </select>
                        {errors.client_id && <p className="text-sm text-red-500">{errors.client_id}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="invoice_number">Invoice Number</Label>
                            <Input
                                id="invoice_number"
                                value={data.invoice_number}
                                onChange={(e) => setData('invoice_number', e.target.value)}
                                placeholder="INV-001"
                            />
                            {errors.invoice_number && <p className="text-sm text-red-500">{errors.invoice_number}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="total">Total Amount ($)</Label>
                            <Input
                                id="total"
                                type="number"
                                step="0.01"
                                value={data.total}
                                onChange={(e) => setData('total', e.target.value)}
                                placeholder="0.00"
                            />
                            {errors.total && <p className="text-sm text-red-500">{errors.total}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="issue_date">Issue Date</Label>
                            <Input
                                id="issue_date"
                                type="date"
                                value={data.issue_date}
                                onChange={(e) => setData('issue_date', e.target.value)}
                            />
                            {errors.issue_date && <p className="text-sm text-red-500">{errors.issue_date}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="due_date">Due Date</Label>
                            <Input
                                id="due_date"
                                type="date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                            />
                            {errors.due_date && <p className="text-sm text-red-500">{errors.due_date}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
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
                            Create Invoice
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

// @ts-ignore
Create.layout = (page: any) => page;
