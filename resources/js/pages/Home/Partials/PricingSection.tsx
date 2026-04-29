import PricingCard from '@/components/pricing-card';

interface Plan {
    id: number;
    name: string;
    price: string | number;
    description: string;
    features: string[];
    slug: string;
}

interface PricingSectionProps {
    plans: Plan[];
}

export default function PricingSection({ plans }: PricingSectionProps) {
    if (!plans || plans.length === 0) return null;

    return (
        <section className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-wider">Pricing</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                        Simple pricing for businesses of all sizes
                    </p>
                </div>
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
        </section>
    );
}
