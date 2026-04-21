import { Link, router } from '@inertiajs/react';
import { ExternalLink, Edit, Eye, Trash2, MoreHorizontal, Send } from 'lucide-react';
import { useState } from 'react';
import invoiceRoutes from '@/routes/invoices';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface InvoiceActionsProps {
    invoice: {
        id: number;
        invoice_number: string;
        status: string;
        client: {
            client_name: string;
            email?: string;
        };
    };
    showView?: boolean;
}

export default function InvoiceActions({ invoice, showView = true }: InvoiceActionsProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(invoiceRoutes.destroy(invoice.id).url, {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setIsDeleting(false);
                toast.success('Invoice deleted successfully!');
            },
            onError: () => {
                setIsDeleting(false);
                toast.error('Failed to delete invoice.');
            },
            preserveScroll: true,
        });
    };

    const handleSendEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        
        if (!invoice.client.email) {
            toast.error('Client has no email address.');
            return;
        }

        if (!window.confirm(`Send invoice #${invoice.invoice_number} to ${invoice.client.client_name}?`)) {
            return;
        }

        setIsSending(true);
        
        router.post(invoiceRoutes.send(invoice.id).url, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Email sent!');
            },
            onError: () => {
                toast.error('Failed to send email.');
            },
            onFinish: () => setIsSending(false)
        });
    };

    return (
        <>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem asChild>
                        <Link href={invoiceRoutes.edit(invoice.id).url} className="cursor-pointer flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </Link>
                    </DropdownMenuItem>

                    {showView && (
                        <DropdownMenuItem asChild>
                            <Link href={invoiceRoutes.show(invoice.id).url} className="cursor-pointer flex items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View</span>
                            </Link>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem asChild>
                        <a href={invoiceRoutes.pdf(invoice.id).url} target="_blank" className="cursor-pointer flex items-center">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            <span>PDF</span>
                        </a>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={handleSendEmail} disabled={isSending || !invoice.client.email} className="cursor-pointer">
                        <Send className="mr-2 h-4 w-4" />
                        <span>{isSending ? 'Sending...' : 'Send'}</span>
                    </DropdownMenuItem>

                    {['pending', 'cancelled'].includes(invoice.status) && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                variant="destructive" 
                                className="cursor-pointer text-red-600 focus:text-red-600"
                                onSelect={() => setIsDeleteDialogOpen(true)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Invoice</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete invoice {invoice.invoice_number}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
