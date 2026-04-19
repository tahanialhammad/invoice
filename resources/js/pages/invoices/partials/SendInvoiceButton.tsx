import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import invoiceRoutes from '@/routes/invoices';

interface SendInvoiceButtonProps {
    invoiceId: number;
    invoiceNumber: string;
    clientName: string;
    clientEmail?: string;
    variant?: 'ghost' | 'outline' | 'default' | 'secondary';
    size?: 'sm' | 'default' | 'lg' | 'icon';
    className?: string;
}

export default function SendInvoiceButton({ 
    invoiceId, 
    invoiceNumber, 
    clientName, 
    clientEmail,
    variant = 'ghost',
    size = 'sm',
    className
}: SendInvoiceButtonProps) {
    const [isSending, setIsSending] = useState(false);

    const handleSendEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!clientEmail) {
            toast.error('Client has no email address.');
            return;
        }

        if (!window.confirm(`Send invoice #${invoiceNumber} to ${clientName}?`)) {
            return;
        }

        setIsSending(true);
        
        router.post(invoiceRoutes.send(invoiceId).url, {}, {
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
        <Button
            variant={variant}
            size={size}
            className={className}
            onClick={handleSendEmail}
            disabled={isSending || !clientEmail}
        >
            {isSending ? (
                <Loader2 className="size-3.5 animate-spin" />
            ) : (
                <Send className="size-3.5" />
            )}
            <span className="ml-1.5 font-medium">{isSending ? 'Sending...' : 'Send'}</span>
        </Button>
    );
}
