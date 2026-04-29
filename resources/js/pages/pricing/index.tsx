import SiteLayout from '@/layouts/site-layout';
import PricingCard from '@/components/pricing-card';
import { Head } from '@inertiajs/react';

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
            <Head>
                <title>Pricing Plans - InvoicePro</title>
                <meta name="description" content="Choose the right plan for your business. Simple, transparent pricing with no hidden fees." />
            </Head>

            <div className="relative isolate bg-white dark:bg-slate-950 px-6 py-24 sm:py-32 lg:px-8">
                {/* Background Blobs */}
                <div className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl" aria-hidden="true">
                    <div className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>

                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-widest">Pricing</h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                        Simple, Transparent Pricing
                    </p>
                    <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                        Choose the plan that's right for you. Whether you're a freelancer or a growing agency, we've got you covered.
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
                    {plans.map((plan) => (
                        <PricingCard 
                            key={plan.id} 
                            plan={plan} 
                            mostPopular={plan.slug === 'business'} 
                        />
                    ))}
                </div>

                <div className="mt-24 mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-blue-600">FAQ</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                            Frequently asked questions
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            <div>
                                <dt className="text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                    Can I change plans at any time?
                                </dt>
                                <dd className="mt-1 text-base leading-7 text-slate-600 dark:text-slate-400">
                                    Yes, you can upgrade or downgrade your plan at any time from your dashboard settings.
                                </dd>
                            </div>
                            <div>
                                <dt className="text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                    Are there any setup fees?
                                </dt>
                                <dd className="mt-1 text-base leading-7 text-slate-600 dark:text-slate-400">
                                    No, there are no hidden fees or setup costs. You only pay the monthly subscription price.
                                </dd>
                            </div>
                            <div>
                                <dt className="text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                    Do you offer custom plans?
                                </dt>
                                <dd className="mt-1 text-base leading-7 text-slate-600 dark:text-slate-400">
                                    If you have specific needs for a large agency, contact our support team for custom Enterprise options.
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Bottom Blob */}
                <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
                    <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>
            </div>
        </SiteLayout>
    );
}
