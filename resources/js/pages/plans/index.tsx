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

interface Plan {
    id: number;
    name: string;
    slug: string;
    price: string;
    description: string;
    features: string[];
}

interface Props {
    plans: Plan[];
    currentPlan: Plan;
    activeSubscription?: {
        pending_plan_id: number | null;
        billing_cycle_ends_at: string | null;
    } | null;
}

export default function Index({ plans, currentPlan, activeSubscription }: Props) {
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
                        {plans.map((plan) => (
                            <Card 
                                key={plan.id} 
                                className={`flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                                    currentPlan?.id === plan.id 
                                        ? 'ring-2 ring-primary border-primary shadow-lg scale-105 z-10' 
                                        : 'hover:-translate-y-1 border-sidebar-border/50'
                                }`}
                            >
                                {currentPlan?.id === plan.id && (
                                    <div className="absolute top-0 right-0">
                                        <div className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                                            Current
                                        </div>
                                    </div>
                                )}
                                {activeSubscription?.pending_plan_id === plan.id && (
                                    <div className="absolute top-0 right-0">
                                        <div className="bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                                            Downgrade Scheduled
                                        </div>
                                    </div>
                                )}
                                
                                <CardHeader className="pb-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-sidebar/50">
                                            {getPlanIcon(plan.slug)}
                                        </div>
                                        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                    </div>
                                    <div className="flex items-baseline text-foreground">
                                        <span className="text-4xl font-extrabold tracking-tight">${plan.price}</span>
                                        <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                                    </div>
                                    <CardDescription className="mt-4 text-muted-foreground min-h-[48px]">
                                        {plan.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-grow pb-8">
                                    <div className="space-y-4">
                                        <p className="text-sm font-semibold text-foreground uppercase tracking-wider">Plan Features:</p>
                                        <ul className="space-y-3">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-start text-sm">
                                                    <div className="mr-3 mt-0.5 rounded-full bg-green-500/10 p-0.5">
                                                        <Check className="h-3 w-3 text-green-600" />
                                                    </div>
                                                    <span className="text-muted-foreground capitalize">
                                                        {feature.replace(/_/g, ' ')}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-0 flex-col items-stretch gap-2">
                                    <Button
                                        size="lg"
                                        variant={currentPlan?.id === plan.id || activeSubscription?.pending_plan_id === plan.id ? "outline" : "default"}
                                        className={`w-full font-bold h-12 ${
                                            currentPlan?.id === plan.id || activeSubscription?.pending_plan_id === plan.id
                                                ? 'bg-transparent border-primary/50 text-primary cursor-default' 
                                                : 'shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]'
                                        }`}
                                        disabled={currentPlan?.id === plan.id || activeSubscription?.pending_plan_id === plan.id || processing}
                                        onClick={() => handleSelectPlan(plan)}
                                    >
                                        {currentPlan?.id === plan.id ? (
                                            <span className="flex items-center gap-2">
                                                <Check className="h-4 w-4" /> Active Plan
                                            </span>
                                        ) : activeSubscription?.pending_plan_id === plan.id ? (
                                            <span className="flex items-center gap-2 text-amber-600">
                                                <Clock className="h-4 w-4" /> Scheduled
                                            </span>
                                        ) : (
                                            parseFloat(plan.price) < parseFloat(currentPlan?.price || '0') 
                                                ? 'Downgrade to ' + plan.name
                                                : plan.price === "0.00" ? 'Stay on Basic' : 'Upgrade to ' + plan.name
                                        )}
                                    </Button>
                                    
                                    {activeSubscription?.pending_plan_id === plan.id && (
                                        <p className="text-xs text-center text-amber-600/80 font-medium">
                                            Takes effect on {activeSubscription.billing_cycle_ends_at}
                                        </p>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-20 p-8 rounded-2xl bg-sidebar/30 border border-sidebar-border/50 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 rounded-full bg-primary/10">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Automated Billing System</h3>
                        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                            Invoices are generated on the 1st of every month. You'll receive a detailed PDF invoice from ZAIN (Admin) for your active subscription plan.
                        </p>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
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
                            <span className="font-bold text-foreground">${confirmingPlan?.price}</span>
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
