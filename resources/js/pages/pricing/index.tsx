import SiteLayout from '@/layouts/site-layout';
import PricingCard from '@/components/pricing-card';

interface Plan {
    id: number;
    name: string;
    price: string | number;
    description: string;
    features: string[];
    slug: string;
}

interface PricingProps {
    plans: Plan[];
}

export default function Pricing({ plans }: PricingProps) {
    return (
        <SiteLayout title="Pricing Plans">
            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-wider">Pricing</h2>
                        <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                            Choose the right plan for your business
                        </p>
                    </div>
                    <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-slate-600 dark:text-slate-400">
                        Simple, transparent pricing. No hidden fees. Choose a plan that works best for you and your clients.
                    </p>
                    <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
                        {plans.map((plan) => (
                            <PricingCard 
                                key={plan.id} 
                                plan={plan} 
                                mostPopular={plan.slug === 'pro'} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
