import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Save, ArrowLeft, CheckCircle2, Shield } from "lucide-react";
import { Link } from "@inertiajs/react";
import adminPlans from "@/routes/admin/plans";
import { toast } from "sonner";

interface Feature {
    id: number;
    name: string;
    code: string;
    type: 'limit' | 'boolean';
    pivot?: {
        value: string;
    };
}

interface Plan {
    id: number;
    name: string;
    slug: string;
    price: string;
    description: string | null;
    features: Feature[];
}

interface EditProps {
    plan: Plan;
    allFeatures: Feature[];
}

export default function Edit({ plan, allFeatures }: EditProps) {
    // Initial state: Object keyed by feature ID
    const initialFeatures = allFeatures.reduce((acc, f) => {
        const active = plan.features.find(pf => pf.id === f.id);
        acc[f.id] = {
            enabled: !!active,
            value: active ? active.pivot?.value : (f.type === 'boolean' ? 'false' : ''),
            name: f.name,
            code: f.code,
            type: f.type
        };
        return acc;
    }, {} as Record<number, any>);

    const { data, setData, put, processing, errors } = useForm({
        price: plan.price,
        description: plan.description || '',
        features: initialFeatures,
    });

    const toggleFeature = (featureId: number, enabled: boolean) => {
        setData('features', {
            ...data.features,
            [featureId]: {
                ...data.features[featureId],
                enabled,
                value: data.features[featureId].type === 'boolean' 
                    ? (enabled ? 'true' : 'false') 
                    : data.features[featureId].value
            }
        });
    };

    const updateValue = (featureId: number, value: string) => {
        setData('features', {
            ...data.features,
            [featureId]: {
                ...data.features[featureId],
                value
            }
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(adminPlans.update(plan.id).url, {
            onSuccess: () => {
                toast.success(`Plan '${plan.name}' updated successfully`);
            },
            onError: (err) => {
                console.error(err);
                toast.error("Failed to update plan. Please check the errors.");
            }
        });
    };

    return (
        <>
            <Head title={`Edit Plan: ${plan.name}`} />
            <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link
                            href={adminPlans.manage().url}
                            className="flex items-center text-sm text-slate-500 hover:text-slate-700 transition mb-2"
                        >
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back to Plans
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            {plan.name}
                            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                                {plan.slug.toUpperCase()}
                            </Badge>
                        </h1>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    {/* General Information */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Shield className="h-5 w-5 text-blue-600" />
                                Plan Details
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Monthly Price (€)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={e => setData('price', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="Enter plan description..."
                                    rows={3}
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Features Management */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                Feature Configuration
                            </h2>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {Object.entries(data.features).map(([id, feature]: [string, any]) => {
                                const featureId = parseInt(id);
                                return (
                                    <div key={id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                                {feature.name}
                                                <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                                                    {feature.code}
                                                </code>
                                            </div>
                                            <p className="text-sm text-slate-500">
                                                {feature.type === 'limit' ? 'Numeric limit or "unlimited"' : 'Yes/No toggle'}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            {feature.enabled && feature.type === 'limit' && (
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-xs uppercase text-slate-400">Limit</Label>
                                                    <Input
                                                        className={`w-32 h-9 ${errors[`features.${id}.value` as keyof typeof errors] ? 'border-red-500' : ''}`}
                                                        value={feature.value}
                                                        onChange={e => updateValue(featureId, e.target.value)}
                                                        placeholder="e.g. 50"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id={`feature-${id}`}
                                                    checked={feature.enabled}
                                                    onCheckedChange={(checked) => toggleFeature(featureId, checked)}
                                                />
                                                <Label htmlFor={`feature-${id}`}>
                                                    {feature.enabled ? 'Enabled' : 'Disabled'}
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {errors.error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {errors.error}
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700" disabled={processing}>
                            <Save className="mr-2 h-5 w-5" />
                            {processing ? 'Saving Changes...' : 'Save Configuration'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = (page: any) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Admin', href: '#' },
            { title: 'Plan Management', href: adminPlans.manage().url },
            { title: 'Edit Plan', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
