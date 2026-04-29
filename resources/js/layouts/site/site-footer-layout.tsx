import { Link } from '@inertiajs/react';
import { home, pricing } from '@/routes';
import { Github, Twitter } from 'lucide-react';

export default function SiteFooter() {
    return (
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
                            <Link href={home().url} className="hover:text-blue-600">Home</Link>
                            <Link href={pricing().url} className="hover:text-blue-600">Pricing</Link>
                            <a href="#" className="hover:text-blue-600">Privacy Policy</a>
                            <a href="#" className="hover:text-blue-600">Terms of Service</a>
                            <a href="#" className="hover:text-blue-600">Contact</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
