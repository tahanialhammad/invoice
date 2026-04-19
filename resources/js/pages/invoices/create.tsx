import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import invoiceRoutes from '@/routes/invoices';
import AppLayout from '@/layouts/app-layout';
import { useEffect, useState } from 'react';

interface Client {
    id: number;
    client_name: string;
}

interface InvoiceItem {
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
}

export default function Create({ clients }: { clients: Client[] }) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: '',
        invoice_number: `INV-${Date.now()}`,
        status: 'pending',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [{ description: '', quantity: 1, unit_price: 0, tax_rate: 0 }] as InvoiceItem[],
    });

    const [totals, setTotals] = useState({
        subtotal: 0,
        tax_total: 0,
        grand_total: 0,
    });

    useEffect(() => {
        let subtotal = 0;
        let tax_total = 0;

        data.items.forEach((item) => {
            const row_total = (item.quantity || 0) * (item.unit_price || 0);
            const tax_amount = row_total * ((item.tax_rate || 0) / 100);
            subtotal += row_total;
            tax_total += tax_amount;
        });

        setTotals({
            subtotal,
            tax_total,
            grand_total: subtotal + tax_total,
        });
    }, [data.items]);

    const addItem = () => {
        setData('items', [...data.items, { description: '', quantity: 1, unit_price: 0, tax_rate: 0 }]);
    };

    const removeItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(invoiceRoutes.store().url);
    };

    return (
        <>
            <Head title="Create Invoice" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-5xl mx-auto w-full">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold">Create Invoice</h1>
                    <p className="text-sidebar-foreground/60">Generate a new invoice for one of your clients.</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-sidebar p-6 rounded-xl border border-sidebar-border/70">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="client_id">Select Client</Label>
                                <select
                                    id="client_id"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
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

                            <div className="grid grid-cols-2 gap-4">
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
                        </div>
                    </div>

                    <div className="bg-sidebar p-6 rounded-xl border border-sidebar-border/70 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Invoice Items</h2>
                            <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                <Plus className="mr-2 size-4" /> Add Item
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-sidebar-border/50 text-left text-sm font-medium text-sidebar-foreground/60">
                                        <th className="pb-2 pr-4">Description</th>
                                        <th className="pb-2 pr-4 w-24">Qty</th>
                                        <th className="pb-2 pr-4 w-32">Unit Price</th>
                                        <th className="pb-2 pr-4 w-24">Tax %</th>
                                        <th className="pb-2 pr-4 w-32 text-right">Total</th>
                                        <th className="pb-2 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/30">
                                    {data.items.map((item, index) => (
                                        <tr key={index} className="group">
                                            <td className="py-3 pr-4">
                                                <Input
                                                    value={item.description}
                                                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                    placeholder="Description"
                                                    className="bg-transparent"
                                                />
                                            </td>
                                            <td className="py-3 pr-4">
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                                                    className="bg-transparent uppercase"
                                                />
                                            </td>
                                            <td className="py-3 pr-4">
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.unit_price}
                                                    onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value))}
                                                    className="bg-transparent"
                                                />
                                            </td>
                                            <td className="py-3 pr-4">
                                                <Input
                                                    type="number"
                                                    value={item.tax_rate}
                                                    onChange={(e) => updateItem(index, 'tax_rate', parseFloat(e.target.value))}
                                                    className="bg-transparent"
                                                />
                                            </td>
                                            <td className="py-3 pr-4 text-right font-medium">
                                                {((item.quantity || 0) * (item.unit_price || 0) * (1 + (item.tax_rate || 0) / 100)).toFixed(2)}
                                            </td>
                                            <td className="py-3 text-right">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => removeItem(index)}
                                                    disabled={data.items.length === 1}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {errors.items && <p className="text-sm text-red-500 mt-2">{errors.items}</p>}
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1"></div>
                        <div className="w-full md:w-80 bg-sidebar p-6 rounded-xl border border-sidebar-border/70 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-sidebar-foreground/60">Subtotal</span>
                                <span>${totals.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-sidebar-foreground/60">Tax Total</span>
                                <span>${totals.tax_total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t border-sidebar-border/50 pt-2">
                                <span>Grand Total</span>
                                <span>${totals.grand_total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} size="lg">
                            {processing && <Loader2 className="mr-2 size-4 animate-spin" />}
                            Create Invoice
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
            { title: 'Invoices', href: invoiceRoutes.index() },
            { title: 'Create Invoice', href: invoiceRoutes.create() },
        ]}
    >
        {page}
    </AppLayout>
);
