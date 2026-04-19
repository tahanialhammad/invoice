import ClientRow from './ClientRow';

interface Client {
    id: number;
    client_name: string;
    business_name: string;
    email: string;
    phone: string | null;
}

interface ClientsTableProps {
    clients: Client[];
}

export default function ClientsTable({ clients }: ClientsTableProps) {
    return (
        <div className="rounded-xl border border-sidebar-border/70 bg-sidebar overflow-hidden shadow-sm">
            <table className="w-full text-left">
                <thead className="border-b border-sidebar-border/70 bg-sidebar-accent/50">
                    <tr>
                        <th className="px-4 py-3 font-semibold text-sidebar-foreground/70">Name</th>
                        <th className="px-4 py-3 font-semibold text-sidebar-foreground/70">Business</th>
                        <th className="px-4 py-3 font-semibold text-sidebar-foreground/70">Email</th>
                        <th className="px-4 py-3 font-semibold text-sidebar-foreground/70">Phone</th>
                        <th className="px-4 py-3 font-semibold text-sidebar-foreground/70 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-sidebar-border/70">
                    {clients.length > 0 ? (
                        clients.map((client) => (
                            <ClientRow key={client.id} client={client} />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="px-4 py-12 text-center text-sidebar-foreground/50">
                                <p className="text-lg font-medium">No clients found.</p>
                                <p className="text-sm">Click "Add Client" to create your first client profile.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
