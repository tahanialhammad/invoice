import SiteLayout from '@/layouts/site-layout';
import { usePage } from '@inertiajs/react';
import Hero from './Partials/Hero';
import VisualAsset from './Partials/VisualAsset';
import Features from './Partials/Features';
import Workflow from './Partials/Workflow';
import CTASection from './Partials/CTASection';
import PricingSection from './Partials/PricingSection';

interface Plan {
    id: number;
    name: string;
    price: string | number;
    description: string;
    features: string[];
    slug: string;
}

export default function Home({
    canRegister = true,
    plans = [],
}: {
    canRegister?: boolean;
    plans?: Plan[];
}) {
    const { auth } = usePage().props as any;

    return (
        <SiteLayout canRegister={canRegister} title="Invoice Management for Small Businesses">
            <Hero auth={auth} canRegister={canRegister} />
            <VisualAsset />
            <Features />
            <Workflow />
            <PricingSection plans={plans} />
            <CTASection canRegister={canRegister} />
        </SiteLayout>
    );
}
