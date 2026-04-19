import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

export interface InvoiceItem {
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
}

interface InvoiceItemsTableProps {
    items: InvoiceItem[];
    errors: any;
    updateItem: (index: number, field: keyof InvoiceItem, value: string | number) => void;
    removeItem: (index: number) => void;
    addItem: () => void;
}

export default function InvoiceItemsTable({ 
    items, 
    errors, 
    updateItem, 
    removeItem, 
    addItem 
}: InvoiceItemsTableProps) {
    return (
        <div className="bg-sidebar p-6 rounded-xl border border-sidebar-border/70 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    Invoice Line Items
                </h2>
                <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-8">
                    <Plus className="mr-2 size-4" /> Add Line Item
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-sidebar-border/50 text-left text-sm font-medium text-sidebar-foreground/60">
                            <th className="pb-2 pr-4">Description</th>
                            <th className="pb-2 pr-4 w-24 text-right">Qty</th>
                            <th className="pb-2 pr-4 w-32 text-right">Unit Price</th>
                            <th className="pb-2 pr-4 w-24 text-right">Tax %</th>
                            <th className="pb-2 pr-4 w-32 text-right">Total</th>
                            <th className="pb-2 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-sidebar-border/30">
                        {items.map((item, index) => (
                            <tr key={index} className="group">
                                <td className="py-3 pr-4">
                                    <Input
                                        value={item.description}
                                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                                        placeholder="Item description..."
                                        className="bg-transparent border-none focus-visible:ring-1 p-0 px-2 h-8"
                                    />
                                    {errors[`items.${index}.description`] && (
                                        <p className="text-[10px] text-red-500 mt-1">{errors[`items.${index}.description`]}</p>
                                    )}
                                </td>
                                <td className="py-3 pr-4">
                                    <Input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                                        className="bg-transparent border-none focus-visible:ring-1 p-0 px-2 h-8 text-right"
                                    />
                                </td>
                                <td className="py-3 pr-4">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={item.unit_price}
                                        onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value))}
                                        className="bg-transparent border-none focus-visible:ring-1 p-0 px-2 h-8 text-right"
                                    />
                                </td>
                                <td className="py-3 pr-4">
                                    <Input
                                        type="number"
                                        value={item.tax_rate}
                                        onChange={(e) => updateItem(index, 'tax_rate', parseFloat(e.target.value))}
                                        className="bg-transparent border-none focus-visible:ring-1 p-0 px-2 h-8 text-right"
                                    />
                                </td>
                                <td className="py-3 pr-4 text-right font-semibold text-sidebar-foreground">
                                    {((item.quantity || 0) * (item.unit_price || 0) * (1 + (item.tax_rate || 0) / 100)).toFixed(2)}
                                </td>
                                <td className="py-3 text-right">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-400 hover:text-red-500 hover:bg-red-50 size-8 transition-opacity md:opacity-0 md:group-hover:opacity-100"
                                        onClick={() => removeItem(index)}
                                        disabled={items.length === 1}
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
    );
}
