import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Shield, AlertCircle, Clock } from 'lucide-react';
import subscriptions from '@/routes/subscriptions';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useState } from 'react';
import { toast } from 'sonner';

interface Feature {
    id: number;
    name: string;
    code: string;
    type: 'limit' | 'boolean';
    pivot: {
        value: string;
    };
}

interface Plan {
    id: number;
    name: string;
    slug: string;
    price: string;
    description: string;
    features: Feature[];
}

interface Props {
    plans: Plan[];
    auth: {
        user: any;
        plan: Plan;
        plan_id: number;
    };
    activeSubscription?: {
        pending_plan_id: number | null;
        billing_cycle_ends_at: string | null;
    } | null;
}

export default function Index({ plans, auth, activeSubscription }: Props) {
    const currentPlan = auth.plan;
    const [confirmingPlan, setConfirmingPlan] = useState<Plan | null>(null);
    const { post, processing, setData } = useForm({
        plan_id: 0,
    });

    const handleSelectPlan = (plan: Plan) => {
        setData('plan_id', plan.id);
        setConfirmingPlan(plan);
    };

    const confirmPlanChange = () => {
        if (!confirmingPlan) return;
        
        setData('plan_id', confirmingPlan.id);
        
        post(subscriptions.store().url, {
            onSuccess: () => {
                setConfirmingPlan(null);
                toast.success(`Successfully switched to ${confirmingPlan.name} plan!`);
            },
            onError: (errors) => {
                console.error('Plan change errors:', errors);
                toast.error(errors.plan_id || 'Failed to change plan. Please try again.');
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getPlanIcon = (slug: string) => {
        switch (slug) {
            case 'premium':
                return <Star className="h-6 w-6 text-yellow-500" />;
            case 'business':
                return <Zap className="h-6 w-6 text-blue-500" />;
            default:
                return <Shield className="h-6 w-6 text-slate-400" />;
        }
    };

    return (
        <>
            <Head title="Subscription Plans" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                            Plans & Pricing
                        </h1>
                        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
                            Scale your business with professional invoice management. All users receive monthly invoices directly to their dashboard.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                        {plans.map((plan) => {
                            const isActive = Number(plan.id) === Number(auth.user?.plan_id);
                            
                            return (
                                <Card 
                                    key={plan.id} 
                                    className={`flex flex-col relative overflow-hidden transition-all duration-500 ${
                                        isActive 
                                            ? 'ring-4 ring-indigo-600 border-indigo-600 shadow-2xl scale-105 z-20 bg-white dark:bg-slate-900' 
                                            : 'hover:-translate-y-2 border-slate-200 dark:border-slate-800 opacity-90 hover:opacity-100 shadow-md'
                                    }`}
                                >
                                    {isActive && (
                                        <div className="absolute top-0 right-0 z-30">
                                            <div className="bg-indigo-600 text-white text-[11px] font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                                                <Star className="h-3 w-3 fill-white animate-spin-slow" />
                                                Current Plan
                                            </div>
                                        </div>
                                    )}

                                    <CardHeader className="pb-8">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-sidebar/50">
                                                    {getPlanIcon(plan.slug)}
                                                </div>
                                                <Badge variant="outline" className="uppercase text-[10px] tracking-widest font-bold">
                                                    {plan.slug}
                                                </Badge>
                                            </div>
                                            {plan.price === "0.00" && <span className="text-xs font-bold text-slate-400">Free Forever</span>}
                                        </div>
                                        <CardTitle className="text-2xl font-black tracking-tight">{plan.name}</CardTitle>
                                        <CardDescription className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
                                            {plan.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="flex-grow flex flex-col">
                                        <div className="flex items-baseline gap-1 mb-8 text-foreground">
                                            <span className="text-4xl font-black">€{plan.price}</span>
                                            <span className="text-sm font-bold text-muted-foreground">/ month</span>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Features Included</p>
                                            <div className="space-y-3">
                                                {plan.features.map((feature) => (
                                                    <div key={feature.id} className="flex items-start gap-3 text-sm">
                                                        <div className="mt-1 bg-blue-50 dark:bg-blue-900/30 rounded-full p-0.5">
                                                            <Check className="h-3 w-3 text-blue-600" />
                                                        </div>
                                                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                            {feature.type === 'limit' 
                                                                ? `${feature.pivot.value === 'unlimited' ? 'Unlimited' : feature.pivot.value} ${feature.name}`
                                                                : feature.name
                                                            }
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="pt-0 flex-col items-stretch gap-2">
                                        <Button
                                            size="lg"
                                            variant={isActive ? "outline" : "default"}
                                            className={`w-full font-bold h-12 ${
                                                isActive
                                                    ? 'bg-transparent border-indigo-600 text-indigo-600 cursor-default' 
                                                    : 'shadow-lg hover:shadow-indigo-600/20 transition-all active:scale-[0.98]'
                                            }`}
                                            disabled={isActive || processing}
                                            onClick={() => handleSelectPlan(plan)}
                                        >
                                            {isActive ? (
                                                <span className="flex items-center gap-2">
                                                    <Check className="h-4 w-4" /> Current Plan
                                                </span>
                                            ) : activeSubscription?.pending_plan_id === plan.id ? (
                                                <span className="flex items-center gap-2 text-amber-600">
                                                    <Clock className="h-4 w-4" /> Scheduled
                                                </span>
                                            ) : (
                                                parseFloat(plan.price) > parseFloat(currentPlan?.price || '0') 
                                                    ? `Upgrade to ${plan.name}`
                                                    : `Switch to ${plan.name}`
                                            )}
                                        </Button>
                                        
                                        {activeSubscription?.pending_plan_id === plan.id && (
                                            <p className="text-[10px] text-center text-amber-600 font-bold uppercase tracking-wider">
                                                Active on {activeSubscription.billing_cycle_ends_at}
                                            </p>
                                        )}
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="mt-20 p-8 rounded-2xl bg-sidebar/30 border border-sidebar-border/50 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 rounded-full bg-primary/10">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Automated Billing System</h3>
                        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                            Invoices are generated on the 1st of every month. You'll receive a detailed PDF invoice from Admin for your active subscription plan.
                        </p>
                    </div>
                </div>
            </div>

            <Dialog open={!!confirmingPlan} onOpenChange={(open) => !open && setConfirmingPlan(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-primary" />
                            Confirm Plan Change
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            Are you sure you want to switch from <strong>{currentPlan?.name}</strong> to <strong>{confirmingPlan?.name}</strong>?
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="bg-sidebar p-4 rounded-lg border border-sidebar-border my-4">
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-muted-foreground">New Monthly Price:</span>
                            <span className="font-bold text-foreground">€{confirmingPlan?.price}</span>
                        </div>
                        {confirmingPlan && currentPlan && parseFloat(confirmingPlan.price) < parseFloat(currentPlan.price) ? (
                            <p className="text-[11px] text-amber-600/90 leading-relaxed font-medium">
                                Note: Since this is a downgrade, your current {currentPlan.name} features will remain active until the end of your billing cycle. You will be switched to the {confirmingPlan.name} plan automatically on your next billing date.
                            </p>
                        ) : (
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Note: A new invoice will be generated immediately for the <strong>{confirmingPlan?.name}</strong> plan. 
                                Your next automated billing cycle will then continue monthly from today.
                            </p>
                        )}
                    </div>

                    <DialogFooter className="flex sm:justify-between gap-2">
                        <Button variant="ghost" onClick={() => setConfirmingPlan(null)} disabled={processing}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={confirmPlanChange} 
                            disabled={processing}
                            className="bg-primary hover:bg-primary/90 font-bold"
                        >
                            {processing ? 'Processing...' : 'Confirm & Apply'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
