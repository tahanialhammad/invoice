import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface ClientFormProps {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
    processing: boolean;
    submit: (e: React.FormEvent) => void;
    submitLabel: string;
}

export default function ClientForm({
    data,
    setData,
    errors,
    processing,
    submit,
    submitLabel,
}: ClientFormProps) {
    return (
        <form onSubmit={submit} className="space-y-6 max-w-2xl">
            <div className="bg-sidebar p-8 rounded-xl border border-sidebar-border/70 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="client_name">Client Name</Label>
                        <Input
                            id="client_name"
                            value={data.client_name}
                            onChange={(e) => setData('client_name', e.target.value)}
                            placeholder="John Doe"
                        />
                        {errors.client_name && <p className="text-sm text-red-500">{errors.client_name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="business_name">Business Name</Label>
                        <Input
                            id="business_name"
                            value={data.business_name}
                            onChange={(e) => setData('business_name', e.target.value)}
                            placeholder="Acme Inc."
                        />
                        {errors.business_name && <p className="text-sm text-red-500">{errors.business_name}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="+353 1 234 5678"
                        />
                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="vat_number">VAT Number (Optional)</Label>
                    <Input
                        id="vat_number"
                        value={data.vat_number}
                        onChange={(e) => setData('vat_number', e.target.value)}
                        placeholder="IE1234567A"
                    />
                    {errors.vat_number && <p className="text-sm text-red-500">{errors.vat_number}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">Full Address</Label>
                    <textarea
                        id="address"
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        placeholder="Street, City, Postcode, Country"
                    />
                    {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
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
