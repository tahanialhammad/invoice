import { Link, usePage } from '@inertiajs/react';
import { CheckCircle2, Star } from 'lucide-react';
import { register } from '@/routes';
import plansRoute from '@/routes/plans';
import { Button } from '@/components/ui/button';

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
    price: string | number;
    description: string;
    features: Feature[];
}

interface PricingCardProps {
    plan: Plan;
    mostPopular?: boolean;
}

export default function PricingCard({ plan, mostPopular = false }: PricingCardProps) {
    const { auth } = usePage().props as any;
    const isCurrentPlan = auth?.user ? Number(plan.id) === Number(auth.user.plan_id) : false;

    return (
        <div
            className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-500 ${
                isCurrentPlan 
                    ? 'ring-4 ring-indigo-600 border-indigo-600 bg-indigo-50/10 dark:bg-indigo-900/10 scale-105 shadow-2xl z-10' 
                    : mostPopular 
                        ? 'bg-slate-50 dark:bg-white/5 ring-1 ring-blue-600 dark:ring-blue-500' 
                        : 'bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800'
            }`}
        >
            {isCurrentPlan && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-6 py-1.5 text-xs font-black text-white uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                    <Star className="h-3 w-3 fill-white animate-spin-slow" />
                    Current Plan
                </div>
            )}
            {!isCurrentPlan && mostPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold text-white uppercase tracking-wider">
                    Most Popular
                </div>
            )}
            <div>
                <div className="flex items-center justify-between gap-x-4">
                    <h3 className="text-lg font-black leading-8 text-slate-900 dark:text-white uppercase tracking-tight">
                        {plan.name}
                    </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400 font-medium">{plan.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">€{plan.price}</span>
                    <span className="text-sm font-bold leading-6 text-slate-500 dark:text-slate-400">/month</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {plan.features && plan.features.map((feature) => (
                        <li key={feature.id} className="flex gap-x-3 items-center">
                            <CheckCircle2 className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {feature.type === 'limit' 
                                    ? `${feature.pivot.value === 'unlimited' ? 'Unlimited' : feature.pivot.value} ${feature.name}`
                                    : feature.name
                                }
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            {isCurrentPlan ? (
                <Button
                    size="lg"
                    className="mt-8 w-full rounded-full bg-indigo-600 text-white font-black uppercase tracking-widest cursor-default hover:bg-indigo-600"
                    disabled
                >
                    Current Plan
                </Button>
            ) : (
                <Link
                    href={auth?.user ? plansRoute.index().url : register()}
                    className={`mt-8 block rounded-full px-3 py-3 text-center text-sm font-black uppercase tracking-widest transition shadow-md hover:shadow-lg ${
                        mostPopular
                            ? 'bg-blue-600 text-white hover:bg-blue-500'
                            : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700'
                    }`}
                >
                    {auth?.user ? 'Upgrade Now' : 'Get started today'}
                </Link>
            )}
        </div>
    );
}
