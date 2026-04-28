export default function VisualAsset() {
    return (
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
    );
}
