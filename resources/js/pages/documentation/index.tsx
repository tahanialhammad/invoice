import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Mail, Settings } from 'lucide-react';

export default function DocumentationIndex() {
    return (
        <>
            <Head title="Documentation" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
                <div className="flex flex-col gap-2 mb-2">
                    <h1 className="text-3xl font-bold tracking-tight">Platform Documentation</h1>
                    <p className="text-muted-foreground text-lg">
                        Learn how to use the billing platform to manage your clients, create invoices, and automate your recurring billing.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-slate-200 dark:border-slate-800">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-500" />
                                Managing Clients
                            </CardTitle>
                            <CardDescription>How to add and manage your customer base.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                            <p>To get started, you need to add clients to your account.</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Navigate to the <strong>Clients</strong> section from the sidebar.</li>
                                <li>Click <strong>Add Client</strong> and fill out their business and contact details.</li>
                                <li>Ensure their email is correct, as this will be used for sending invoices.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-800">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-green-500" />
                                Creating Invoices
                            </CardTitle>
                            <CardDescription>Generate standard and recurring invoices.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                            <p>Once you have clients, you can bill them for your services.</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Go to the <strong>Invoices</strong> tab and click <strong>Create Invoice</strong>.</li>
                                <li>Select a client and add your line items (services/products).</li>
                                <li>You can set an invoice as <strong>Recurring</strong> to have the system automatically generate it periodically (e.g., monthly).</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-800">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-purple-500" />
                                Sending & PDF Generation
                            </CardTitle>
                            <CardDescription>Automated delivery and PDF downloads.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                            <p>The platform handles invoice formatting and delivery for you.</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Every invoice can be downloaded as a highly-styled PDF by clicking the <strong>PDF</strong> button.</li>
                                <li>Use the <strong>Send Email</strong> action to automatically dispatch the invoice directly to the client's inbox.</li>
                                <li>Recurring invoices are automatically generated and emailed to clients without manual intervention.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-800">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5 text-orange-500" />
                                Account & Subscriptions
                            </CardTitle>
                            <CardDescription>Managing your SaaS limits and features.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                            <p>Your access to features depends on your active subscription plan.</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>If you reach a limit (e.g., maximum clients), you will need to upgrade your plan.</li>
                                <li>Visit the <strong>Pricing</strong> page to see available tiers.</li>
                                <li>You can manage your subscription and billing details from your profile settings.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

DocumentationIndex.layout = (page: any) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Documentation', href: '/documentation' },
        ]}
    >
        {page}
    </AppLayout>
);
