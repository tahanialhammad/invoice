import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Save, ArrowLeft, Settings2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { toast } from 'sonner';
import { useState } from 'react';
import adminPlans from '@/routes/admin/plans';

interface Plan {
    id: number;
    name: string;
    slug: string;
    price: string | number;
    description: string;
    features: string[];
}

interface Props {
    plan: Plan;
}

export default function EditPlan({ plan }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        price: plan.price,
        description: plan.description || '',
        features: [...plan.features],
    });

    const [newFeature, setNewFeature] = useState('');

    const addFeature = () => {
        if (!newFeature.trim()) return;
        if (data.features.includes(newFeature.trim())) {
            toast.error('Feature already exists');
            return;
        }
        setData('features', [...data.features, newFeature.trim()]);
        setNewFeature('');
    };

    const removeFeature = (index: number) => {
        const updated = [...data.features];
        updated.splice(index, 1);
        setData('features', updated);
    };

    const submit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(adminPlans.update(plan.id).url, {
            onSuccess: () => {
                toast.success(`Plan '${plan.name}' updated successfully`);
            },
            onError: (err) => {
                console.error('Update failed:', err);
                toast.error('Failed to update plan. Please check inputs.');
            },
        });
    };

    return (
        <>
            <Head title={`Edit Plan: ${plan.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => window.history.back()}
                        className="rounded-full"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Plan: {plan.name}</h1>
                        <p className="text-muted-foreground">Modify pricing and features for the {plan.slug} tier.</p>
                    </div>
                </div>

                <Card className="border-2 shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b">
                        <CardTitle>Plan Details</CardTitle>
                        <CardDescription>
                            Changes are applied immediately to the system.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <form onSubmit={submit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Basic Info */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Monthly Price ($)</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                            <Input 
                                                id="price" 
                                                type="number" 
                                                step="0.01" 
                                                className="pl-7"
                                                value={data.price} 
                                                onChange={e => setData('price', e.target.value)} 
                                            />
                                        </div>
                                        {errors.price && <p className="text-xs text-red-500 font-medium">{errors.price}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Plan Description</Label>
                                        <Textarea 
                                            id="description" 
                                            rows={5}
                                            className="resize-none"
                                            value={data.description} 
                                            onChange={e => setData('description', e.target.value)} 
                                            placeholder="Describe what users get with this plan..."
                                        />
                                        {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description}</p>}
                                    </div>
                                </div>

                                {/* Features List */}
                                <div className="space-y-4">
                                    <Label>Plan Capabilities (Features)</Label>
                                    <div className="flex gap-2">
                                        <Input 
                                            value={newFeature} 
                                            onChange={e => setNewFeature(e.target.value)}
                                            placeholder="e.g. create_recurring_invoices"
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                        />
                                        <Button type="button" onClick={addFeature} variant="secondary">
                                            Add
                                        </Button>
                                    </div>
                                    
                                    <div className="bg-muted/30 rounded-xl p-4 border border-dashed border-muted-foreground/30 min-h-[200px] space-y-2">
                                        {data.features.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground/50 py-8">
                                                <Settings2 className="h-8 w-8 mb-2 opacity-20" />
                                                <p className="text-xs">No features added yet.</p>
                                            </div>
                                        ) : (
                                            data.features.map((feature, i) => (
                                                <div key={i} className="flex justify-between items-center bg-background p-2 px-3 rounded-lg border group transition-all">
                                                    <code className="text-xs font-mono">{feature}</code>
                                                    <Button 
                                                        type="button" 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 text-muted-foreground hover:text-red-500"
                                                        onClick={() => removeFeature(i)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    {errors.features && <p className="text-xs text-red-500 font-medium">{errors.features}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t">
                                <Button type="button" variant="ghost" onClick={() => window.history.back()}>
                                    Discard Changes
                                </Button>
                                <Button type="submit" className="gap-2 px-8 font-bold" disabled={processing}>
                                    {processing ? 'Saving...' : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Save All Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EditPlan.layout = (page: any) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Admin', href: '#' },
            { title: 'Plan Management', href: '/admin/plans' },
            { title: 'Edit Plan', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
