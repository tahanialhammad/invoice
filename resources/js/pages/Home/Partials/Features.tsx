import { FileText, Users, CreditCard, BarChart3 } from 'lucide-react';

export default function Features() {
    return (
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
    );
}
