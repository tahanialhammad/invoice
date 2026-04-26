import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Settings2, ShieldCheck } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
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
        <Card className="relative transition-all duration-300 hover:border-primary/50 hover:shadow-md">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                    <div className="p-2 rounded-lg bg-primary/10 mb-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="uppercase text-[10px] tracking-widest">
                        {plan.slug}
                    </Badge>
                </div>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                    {plan.description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-sm text-muted-foreground">/ month</span>
                </div>
                
                <div className="space-y-2 mb-6">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active Features</p>
                    <div className="flex flex-wrap gap-1.5">
                        {plan.features.map((feature, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px] py-0 px-2 font-normal">
                                {feature.replace(/_/g, ' ')}
                            </Badge>
                        ))}
                    </div>
                </div>

                <Button 
                    asChild
                    className="w-full gap-2 font-bold" 
                    variant="outline"
                >
                    <Link href={adminPlans.edit(plan.id).url}>
                        <Settings2 className="h-4 w-4" />
                        Configure Plan
                    </Link>
                </Button>
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

