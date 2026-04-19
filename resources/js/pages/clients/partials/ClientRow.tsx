import { Link } from '@inertiajs/react';
import { User } from 'lucide-react';
import clientRoutes from '@/routes/clients';
import ClientActions from './ClientActions';

interface ClientRowProps {
    client: {
        id: number;
        client_name: string;
        business_name: string;
        email: string;
        phone: string | null;
    };
}

export default function ClientRow({ client }: ClientRowProps) {
    return (
        <tr className="hover:bg-sidebar-accent/30 transition-colors group">
            <td className="px-4 py-3 font-medium">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-500/10 text-blue-600 p-1 rounded-md">
                        <User className="size-4" />
                    </div>
                    <Link href={clientRoutes.show(client.id)} className="hover:underline text-blue-600 font-semibold">
                        {client.client_name}
                    </Link>
                </div>
            </td>
            <td className="px-4 py-3 text-sidebar-foreground/80">{client.business_name}</td>
            <td className="px-4 py-3 text-sm text-sidebar-foreground/60">{client.email}</td>
            <td className="px-4 py-3 text-sm font-mono text-sidebar-foreground/60">{client.phone || '-'}</td>
            <td className="px-4 py-3 text-right">
                <ClientActions client={client} />
            </td>
        </tr>
    );
}
