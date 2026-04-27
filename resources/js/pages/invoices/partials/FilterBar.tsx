import { useState, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import invoiceRoutes from '@/routes/invoices';

interface FilterBarProps {
    filters: {
        search?: string;
        status?: string;
        client_id?: string;
    };
    clients?: { id: number; client_name: string }[];
}

export default function FilterBar({ filters, clients = [] }: FilterBarProps) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || 'all');
    const [clientId, setClientId] = useState(filters?.client_id || 'all');

    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(handler);
    }, [search]);

    const applyFilters = useCallback(
        (currentSearch: string, currentStatus: string, currentClient: string) => {
            router.get(
                invoiceRoutes.index().url,
                {
                    search: currentSearch || undefined,
                    status: currentStatus !== 'all' ? currentStatus : undefined,
                    client_id: currentClient !== 'all' ? currentClient : undefined,
                },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                }
            );
        },
        []
    );

    useEffect(() => {
        applyFilters(debouncedSearch, status, clientId);
    }, [debouncedSearch, status, clientId, applyFilters]);

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search invoice number or client..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 w-full"
                />
            </div>
            
            <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
            </Select>

            <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Client" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                            {client.client_name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
