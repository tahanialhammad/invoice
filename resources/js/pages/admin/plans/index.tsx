import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Settings2, ShieldCheck } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import adminPlans from '@/routes/admin/plans';

interface Feature {
    id: number;
    name: string;
    code: string;
    pivot: {
        value: string;
    };
}

interface Plan {
    id: number;
    name: string;
    slug: string;
    price: string | number;
    description: string;
    features: Feature[];
}

interface Props {
    plans: Plan[];
}

export default function AdminPlansIndex({ plans }: Props) {
    return (
        <>
            <Head title="Manage Subscription Plans" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                <div className="flex justify-between items-end gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-primary mb-1">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Admin Panel</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Plan Management</h1>
                        <p className="text-muted-foreground">Manage SaaS pricing, descriptions, and feature capabilities.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <PlanCard 
                            key={plan.id} 
                            plan={plan} 
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

function PlanCard({ plan }: { plan: Plan }) {
    return (
        <Card className="group relative transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl cursor-pointer overflow-hidden border-slate-200 dark:border-slate-800">
            <Link href={adminPlans.edit(plan.id).url} className="absolute inset-0 z-10" />
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <CreditCard className="h-5 w-5 text-blue-600 group-hover:text-white" />
                    </div>
                    <Badge variant="outline" className="uppercase text-[10px] tracking-widest font-bold border-slate-300 dark:border-slate-700">
                        {plan.slug}
                    </Badge>
                </div>
                <CardTitle className="text-xl font-bold tracking-tight">{plan.name}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[2.5rem] text-slate-500 dark:text-slate-400">
                    {plan.description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">€{plan.price}</span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ month</span>
                </div>
                
                <div className="space-y-3 mb-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500">Tier Features</p>
                    <div className="flex flex-wrap gap-2">
                        {plan.features.map((feature) => (
                            <Badge key={feature.id} variant="secondary" className="text-[10px] py-0.5 px-2.5 font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none">
                                {feature.name}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="relative z-20">
                    <Button 
                        asChild
                        className="w-full gap-2 font-bold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-sm" 
                        variant="outline"
                    >
                        <Link href={adminPlans.edit(plan.id).url}>
                            <Settings2 className="h-4 w-4" />
                            Configure Tier
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

AdminPlansIndex.layout = (page: any) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Admin', href: '#' },
            { title: 'Plan Management', href: '/admin/plans' },
        ]}
    >
        {page}
    </AppLayout>
);

