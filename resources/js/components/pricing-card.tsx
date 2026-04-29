import { Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { register } from '@/routes';

interface Plan {
    id: number;
    name: string;
    price: string | number;
    description: string;
    features: string[];
}

interface PricingCardProps {
    plan: Plan;
    mostPopular?: boolean;
}

export default function PricingCard({ plan, mostPopular = false }: PricingCardProps) {
    return (
        <div
            className={`relative flex flex-col justify-between rounded-3xl p-8 ring-1 ring-slate-200 dark:ring-slate-800 xl:p-10 ${
                mostPopular ? 'bg-slate-50 dark:bg-white/5 ring-blue-600 dark:ring-blue-500' : 'bg-white dark:bg-slate-900'
            }`}
        >
            {mostPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold text-white uppercase tracking-wider">
                    Most Popular
                </div>
            )}
            <div>
                <div className="flex items-center justify-between gap-x-4">
                    <h3 className="text-lg font-semibold leading-8 text-slate-900 dark:text-white">
                        {plan.name}
                    </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{plan.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">€{plan.price}</span>
                    <span className="text-sm font-semibold leading-6 text-slate-600 dark:text-slate-400">/month</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {plan.features && plan.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                            <CheckCircle2 className="h-6 w-5 flex-none text-blue-600" aria-hidden="true" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
            <Link
                href={register()}
                className={`mt-8 block rounded-full px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition ${
                    mostPopular
                        ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500 focus-visible:outline-blue-600'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
                }`}
            >
                Get started today
            </Link>
        </div>
    );
}
