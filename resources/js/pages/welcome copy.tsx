import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import {
    FileText,
    Users,
    CreditCard,
    BarChart3,
    CheckCircle2,
    ArrowRight,
    Github,
    Twitter
} from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900">
            <Head title="Invoice Management for Small Businesses" />

            <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl mx-auto py-6">
                <nav className="flex items-center justify-end gap-4">
                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                            >
                                Log in
                            </Link>
                            {canRegister && (
                                <Link
                                    href={register()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            )}
                        </>
                    )}
                </nav>
            </header>

            <main className="pt-16">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-24 lg:py-32">
                    <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3b82f6] to-[#93c5fd] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                    </div>

                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-slate-900 dark:text-white">
                                Simple Invoice Management for Small Businesses
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                                Create professional invoices, manage your clients, and track payments in one place.
                                Built for freelancers and growing teams who want to spend less time on paperwork.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition"
                                            >
                                                Get Started for Free
                                            </Link>
                                        )}
                                        <Link
                                            href={login()}
                                            className="text-sm font-semibold leading-6 text-slate-900 dark:text-white flex items-center gap-1 group"
                                        >
                                            Login <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Visual Asset */}
                        <div className="mt-16 flow-root sm:mt-24">
                            <div className="-m-2 rounded-xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 dark:bg-white/5 dark:ring-white/10">
                                <div className="rounded-lg bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10 overflow-hidden">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                                        <div className="flex gap-1.5">
                                            <div className="size-3 rounded-full bg-red-400"></div>
                                            <div className="size-3 rounded-full bg-yellow-400"></div>
                                            <div className="size-3 rounded-full bg-green-400"></div>
                                        </div>
                                        <div className="mx-auto text-xs text-slate-400 font-medium">app.invoicepro.com</div>
                                    </div>
                                    <div className="aspect-[16/9] bg-slate-50 dark:bg-slate-950 p-8">
                                        <div className="grid grid-cols-3 gap-6">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-32 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm animate-pulse">
                                                    <div className="h-2 w-1/2 bg-slate-100 dark:bg-slate-800 rounded mb-4"></div>
                                                    <div className="h-8 w-full bg-slate-50 dark:bg-slate-800/50 rounded"></div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-8 h-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-pulse">
                                            <div className="space-y-4">
                                                <div className="h-2 w-1/4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                                <div className="h-4 w-full bg-slate-50 dark:bg-slate-800/50 rounded"></div>
                                                <div className="h-4 w-full bg-slate-50 dark:bg-slate-800/50 rounded"></div>
                                                <div className="h-4 w-3/4 bg-slate-50 dark:bg-slate-800/50 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-slate-50 py-24 dark:bg-slate-900/50">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-wider">Features</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                Everything you need to manage your billing
                            </p>
                        </div>
                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
                                <div className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                            <FileText className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        Create Invoices
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                                        <p className="flex-auto">Professional invoice generation with customizable statuses and line items.</p>
                                    </dd>
                                </div>
                                <div className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                            <Users className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        Manage Clients
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                                        <p className="flex-auto">Keep all your client information organized and easily accessible for recurring billing.</p>
                                    </dd>
                                </div>
                                <div className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                            <CreditCard className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        Track Payments
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                                        <p className="flex-auto">Mark invoices as paid, pending, or overdue and get real-time revenue insights.</p>
                                    </dd>
                                </div>
                                <div className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                            <BarChart3 className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        Analytics
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                                        <p className="flex-auto">Simple dashboard stats showing your revenue this year and invoices status overview.</p>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:text-center">
                            <h2 className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-wider">Workflow</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                Get paid in three simple steps
                            </p>
                        </div>
                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                            <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-3 lg:gap-x-12">
                                <div className="relative pl-16">
                                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold dark:bg-blue-900/30">
                                        1
                                    </div>
                                    <h3 className="text-xl font-bold leading-7 text-slate-900 dark:text-white">Add Your Clients</h3>
                                    <p className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-400">
                                        Create your client database with business names, VAT numbers, and contact details.
                                    </p>
                                </div>
                                <div className="relative pl-16">
                                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold dark:bg-blue-900/30">
                                        2
                                    </div>
                                    <h3 className="text-xl font-bold leading-7 text-slate-900 dark:text-white">Create Invoices</h3>
                                    <p className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-400">
                                        Generate professional invoices in seconds with custom dates and totals.
                                    </p>
                                </div>
                                <div className="relative pl-16">
                                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold dark:bg-blue-900/30">
                                        3
                                    </div>
                                    <h3 className="text-xl font-bold leading-7 text-slate-900 dark:text-white">Track Progress</h3>
                                    <p className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-400">
                                        Monitor your revenue growth and stay on top of overdue payments with beautiful stats.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative isolate px-6 py-24 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-4xl rounded-3xl bg-slate-900 py-16 px-6 text-center ring-1 ring-white/10 sm:py-24 sm:px-12 dark:bg-white dark:text-slate-900">
                        <h2 className="text-3xl font-bold tracking-tight text-white dark:text-slate-900 sm:text-4xl">
                            Start managing your invoices today
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300 dark:text-slate-600">
                            Join hundreds of small business owners who have simplified their billing process.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            {canRegister && (
                                <Link
                                    href={register()}
                                    className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition"
                                >
                                    Create Account
                                </Link>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 dark:bg-slate-950 dark:border-slate-800">
                <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="flex justify-center space-x-6 md:order-2">
                        <a href="#" className="text-slate-400 hover:text-slate-500">
                            <Twitter className="size-5" />
                        </a>
                        <a href="#" className="text-slate-400 hover:text-slate-500">
                            <Github className="size-5" />
                        </a>
                    </div>
                    <div className="mt-8 md:order-1 md:mt-0">
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-[10px] font-bold text-white uppercase">
                                    IP
                                </div>
                                <span className="font-bold">InvoicePro</span>
                            </div>
                            <p className="text-center text-xs leading-5 text-slate-500 md:text-left">
                                &copy; {new Date().getFullYear()} InvoicePro Inc. All rights reserved.
                            </p>
                            <div className="flex gap-4 text-xs font-semibold text-slate-500 transition">
                                <a href="#" className="hover:text-blue-600">Privacy Policy</a>
                                <a href="#" className="hover:text-blue-600">Terms of Service</a>
                                <a href="#" className="hover:text-blue-600">Contact</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
