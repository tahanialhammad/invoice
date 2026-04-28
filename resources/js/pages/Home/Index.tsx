import SiteLayout from '@/layouts/site-layout';
import { usePage } from '@inertiajs/react';
import Hero from './Partials/Hero';
import VisualAsset from './Partials/VisualAsset';
import Features from './Partials/Features';
import Workflow from './Partials/Workflow';
import CTASection from './Partials/CTASection';

export default function Home({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props as any;

    return (
        <SiteLayout canRegister={canRegister} title="Invoice Management for Small Businesses">
            <Hero auth={auth} canRegister={canRegister} />
            <VisualAsset />
            <Features />
            <Workflow />
            <CTASection canRegister={canRegister} />
        </SiteLayout>
    );
}
