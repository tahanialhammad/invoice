import { Link, usePage } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ShieldCheck, Users, ReceiptText } from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    const { auth } = usePage().props as any;
    const overdueCount = auth?.overdueCount || 0;

    return (
        <>
            <SidebarGroup className="px-2 py-0">
                <SidebarGroupLabel>Platform</SidebarGroupLabel>
                <SidebarMenu>
                    {items
                        .filter((item) => {
                            if (auth?.user?.is_admin && item.title === 'Subscription Plans') {
                                return false;
                            }
                            return true;
                        })
                        .map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        {item.title === 'Invoices' && overdueCount > 0 && (
                                            <span className="ml-auto flex h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse" />
                                        )}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                </SidebarMenu>
            </SidebarGroup>

            {auth?.user?.is_admin && (
                <SidebarGroup className="px-2 py-4">
                    <SidebarGroupLabel>Administration</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl('/admin/plans')}
                                tooltip={{ children: 'Manage Plans' }}
                            >
                                <Link href="/admin/plans" prefetch>
                                    <ShieldCheck className="text-primary" />
                                    <span>Plan Management</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl('/admin/subscribers')}
                                tooltip={{ children: 'Subscribers' }}
                            >
                                <Link href="/admin/subscribers" prefetch>
                                    <Users className="text-primary" />
                                    <span>Subscribers</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl('/admin/billing')}
                                tooltip={{ children: 'Subscription Billing' }}
                            >
                                <Link href="/admin/billing" prefetch>
                                    <ReceiptText className="text-primary" />
                                    <span>Billing</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            )}
        </>
    );
}
