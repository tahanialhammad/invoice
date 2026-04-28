import { Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import AppLogoIcon from '@/components/app-logo-icon';

interface SiteHeaderProps {
    canRegister?: boolean;
}

export default function SiteHeader({ canRegister = true }: SiteHeaderProps) {
    const { auth } = usePage().props as any;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center">
                        <AppLogoIcon className="size-9 fill-current text-black dark:text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">InvoicePro</span>
                </div>
                <nav className="flex items-center gap-4">
                    {auth?.user ? (
                        <Link
                            href={dashboard()}
                            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="text-sm font-semibold leading-6 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
                            >
                                Log in
                            </Link>
                            {canRegister && (
                                <Link
                                    href={register()}
                                    className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition"
                                >
                                    Register
                                </Link>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
