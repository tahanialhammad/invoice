import { Link } from '@inertiajs/react';
import { register } from '@/routes';

interface CTASectionProps {
    canRegister: boolean;
}

export default function CTASection({ canRegister }: CTASectionProps) {
    return (
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
    );
}
