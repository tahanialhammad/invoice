export default function Workflow() {
    return (
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
    );
}
