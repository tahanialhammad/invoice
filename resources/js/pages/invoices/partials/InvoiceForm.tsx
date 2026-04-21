import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import InvoiceItemsTable, { InvoiceItem } from './InvoiceItemsTable';
import InvoiceTotals from './InvoiceTotals';
import { useEffect, useState } from 'react';

interface Client {
    id: number;
    client_name: string;
}

interface InvoiceFormProps {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
    processing: boolean;
    clients: Client[];
    submit: (e: React.FormEvent) => void;
    submitLabel: string;
}

export default function InvoiceForm({
    data,
    setData,
    errors,
    processing,
    clients,
    submit,
    submitLabel,
}: InvoiceFormProps) {
    const [totals, setTotals] = useState({
        subtotal: 0,
        tax_total: 0,
        grand_total: 0,
    });

    useEffect(() => {
        let subtotal = 0;
        let tax_total = 0;

        data.items.forEach((item: InvoiceItem) => {
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

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-sidebar p-6 rounded-xl border border-sidebar-border/70 shadow-sm">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="client_id">Client</Label>
                        <select
                            id="client_id"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
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
                        <Label htmlFor="status">Invoice Status</Label>
                        <select
                            id="status"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="draft">Draft</option>
                            <option value="sent">Sent</option>
                        </select>
                        {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="invoice_type">Invoice Type</Label>
                            <select
                                id="invoice_type"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                                value={data.is_recurring ? 'recurring' : 'one_time'}
                                onChange={(e) => setData('is_recurring', e.target.value === 'recurring')}
                            >
                                <option value="one_time">One-Time</option>
                                <option value="recurring">Recurring</option>
                            </select>
                        </div>

                        {data.is_recurring && (
                            <div className="space-y-2">
                                <Label htmlFor="recurring_interval">Interval</Label>
                                <select
                                    id="recurring_interval"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                                    value={data.recurring_interval || 'monthly'}
                                    onChange={(e) => setData('recurring_interval', e.target.value)}
                                >
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                                {errors.recurring_interval && <p className="text-sm text-red-500">{errors.recurring_interval}</p>}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="invoice_number">Invoice Reference</Label>
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

            <InvoiceItemsTable 
                items={data.items}
                errors={errors}
                updateItem={updateItem}
                removeItem={removeItem}
                addItem={addItem}
            />

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1"></div>
                <InvoiceTotals 
                    subtotal={totals.subtotal}
                    taxTotal={totals.tax_total}
                    grandTotal={totals.grand_total}
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-sidebar-border/30">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => window.history.back()}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={processing} size="lg" className="min-w-[150px]">
                    {processing && <Loader2 className="mr-2 size-4 animate-spin" />}
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
