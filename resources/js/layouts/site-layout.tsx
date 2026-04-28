import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import SiteHeaderLayout from './site/site-header-layout';
import SiteFooterLayout from './site/site-footer-layout';

export default function SiteLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <>
            <SiteHeaderLayout />
            <div breadcrumbs={breadcrumbs}>
                {children}
            </div>
            <SiteFooterLayout 
        </>

    );
}
