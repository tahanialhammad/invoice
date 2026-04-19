import { User, Building2, Mail, Phone, MapPin, BadgeCheck } from 'lucide-react';

interface ClientDetailsProps {
    client: {
        client_name: string;
        business_name: string;
        vat_number: string | null;
        address: string;
        email: string;
        phone: string | null;
    };
}

export default function ClientDetails({ client }: ClientDetailsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-sidebar p-8 rounded-xl border border-sidebar-border/70 shadow-sm">
            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="bg-blue-500/10 text-blue-600 p-2 rounded-lg">
                        <User className="size-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-sidebar-foreground/40 mb-1">Contact Name</h4>
                        <p className="text-lg font-semibold text-sidebar-foreground">{client.client_name}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="bg-purple-500/10 text-purple-600 p-2 rounded-lg">
                        <Building2 className="size-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-sidebar-foreground/40 mb-1">Business Name</h4>
                        <p className="text-lg font-semibold text-sidebar-foreground">{client.business_name}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="bg-green-500/10 text-green-600 p-2 rounded-lg">
                        <BadgeCheck className="size-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-sidebar-foreground/40 mb-1">VAT Number</h4>
                        <p className="text-lg font-semibold text-sidebar-foreground">{client.vat_number || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="bg-orange-500/10 text-orange-600 p-2 rounded-lg">
                        <Mail className="size-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-sidebar-foreground/40 mb-1">Email Address</h4>
                        <p className="text-lg font-semibold text-sidebar-foreground">{client.email}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="bg-indigo-500/10 text-indigo-600 p-2 rounded-lg">
                        <Phone className="size-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-sidebar-foreground/40 mb-1">Phone Number</h4>
                        <p className="text-lg font-semibold text-sidebar-foreground">{client.phone || 'N/A'}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="bg-slate-500/10 text-slate-600 p-2 rounded-lg">
                        <MapPin className="size-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-sidebar-foreground/40 mb-1">Address</h4>
                        <p className="text-sm font-medium text-sidebar-foreground/80 whitespace-pre-line leading-relaxed">
                            {client.address}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
