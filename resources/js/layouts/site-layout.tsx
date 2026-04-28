import { Head } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import SiteHeader from '@/layouts/site/site-header-layout';
import SiteFooter from '@/layouts/site/site-footer-layout';

interface SiteLayoutProps extends PropsWithChildren {
    canRegister?: boolean;
    title?: string;
}

export default function SiteLayout({ children, canRegister = true, title }: SiteLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900">
            <Head title={title} />
            <SiteHeader canRegister={canRegister} />
            <main className="flex-1">
                {children}
            </main>
            <SiteFooter />
        </div>
    );
}
