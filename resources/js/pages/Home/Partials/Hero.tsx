import { Link } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
    auth: any;
    canRegister: boolean;
}

export default function Hero({ auth, canRegister }: HeroProps) {
    return (
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
                        {auth?.user ? (
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
            </div>
        </section>
    );
}
