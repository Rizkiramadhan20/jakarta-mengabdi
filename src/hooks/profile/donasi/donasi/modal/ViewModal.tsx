import React from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';

interface ViewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    modalContent: any;
}

// Helper to render status badge and icon
const getStatusBadge = (status: string) => {
    let color: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
    let icon = (
        <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
    );
    let displayStatus = status;
    if (status === 'settlement') {
        displayStatus = 'success';
    }
    if (status === 'settlement' || status === 'capture' || status === 'success') {
        color = 'default';
        icon = (
            <svg className="w-4 h-4 inline-block mr-1 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        );
    } else if (status === 'pending') {
        color = 'secondary';
        icon = (
            <svg className="w-4 h-4 inline-block mr-1 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
        );
    } else if (status === 'expire' || status === 'cancel' || status === 'deny' || status === 'failure') {
        color = 'destructive';
        icon = (
            <svg className="w-4 h-4 inline-block mr-1 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        );
    }
    return (
        <Badge variant={color} className="flex items-center gap-1 px-2 py-1">
            {icon}{displayStatus}
        </Badge>
    );
};

// Helper to render Midtrans details in a modern layout
const renderMidtransDetails = (data: any) => {
    if (!data) return null;
    // Flatten VA numbers if present
    let vaNumbers = '';
    if (Array.isArray(data.va_numbers) && data.va_numbers.length > 0) {
        vaNumbers = data.va_numbers.map((va: any) => `${va.bank?.toUpperCase()}: ${va.va_number}`).join(', ');
    }
    let permataVa = data.permata_va_number ? `Permata: ${data.permata_va_number}` : '';
    let billKey = data.bill_key ? `Bill Key: ${data.bill_key}` : '';
    let billerCode = data.biller_code ? `Biller Code: ${data.biller_code}` : '';
    let qrString = data.qr_string ? `QR String: ${data.qr_string}` : '';
    let actions = Array.isArray(data.actions) ? data.actions : [];
    let paymentCode = data.payment_code ? `Payment Code: ${data.payment_code}` : '';
    let maskedCard = data.masked_card ? `Masked Card: ${data.masked_card}` : '';
    let approvalCode = data.approval_code ? `Approval Code: ${data.approval_code}` : '';

    return (
        <Card className="w-full max-w-xl mx-auto">
            <CardHeader className="pb-2">
                <CardTitle className="flex flex-col gap-1">
                    <span className="text-base font-semibold">Order ID: <span className="font-mono font-normal">{data.order_id}</span></span>
                    <span>{getStatusBadge(data.transaction_status)}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 pb-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-2 text-sm">
                    <div><span className="font-semibold">Payment Type:</span> {data.payment_type}</div>
                    <div><span className="font-semibold">Transaction Time:</span> {data.transaction_time ? new Date(data.transaction_time).toLocaleString() : '-'}</div>
                    <div><span className="font-semibold">Gross Amount:</span> {data.gross_amount ? `Rp ${Number(data.gross_amount).toLocaleString()}` : '-'}</div>
                    {vaNumbers && <div><span className="font-semibold">VA Number(s):</span> {vaNumbers}</div>}
                    {permataVa && <div><span className="font-semibold">{permataVa}</span></div>}
                    {billKey && <div><span className="font-semibold">{billKey}</span></div>}
                    {billerCode && <div><span className="font-semibold">{billerCode}</span></div>}
                    {qrString && <div><span className="font-semibold">{qrString}</span></div>}
                    {paymentCode && <div><span className="font-semibold">{paymentCode}</span></div>}
                    {maskedCard && <div><span className="font-semibold">{maskedCard}</span></div>}
                    {approvalCode && <div><span className="font-semibold">{approvalCode}</span></div>}
                </div>
                {actions.length > 0 && (
                    <div className="mt-4">
                        <div className="font-semibold mb-1">Actions:</div>
                        <ul className="list-disc list-inside text-blue-700">
                            {actions.map((act: any, idx: number) => (
                                <li key={idx}><a href={act.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">{act.name || act.method || act.url}</a></li>
                            ))}
                        </ul>
                    </div>
                )}
                {data.status_message && (
                    <div className="mt-4 text-xs text-gray-500 italic">{data.status_message}</div>
                )}
            </CardContent>
        </Card>
    );
};

export default function ViewModal({ open, onOpenChange, modalContent }: ViewModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-3xl p-0 md:p-0 max-w-2xl border-0 shadow-2xl">
                <DialogHeader className="px-8 pt-8 pb-2">
                    <DialogTitle className="text-2xl font-bold text-primary">Detail Midtrans Response</DialogTitle>
                </DialogHeader>
                <div className="max-h-[420px] overflow-y-auto bg-background rounded-lg px-8 pb-4">
                    {modalContent ? renderMidtransDetails(modalContent) : ''}
                </div>
                <DialogClose asChild>
                    <Button variant="secondary" className="mt-4 w-full rounded-b-3xl h-14 text-base font-semibold">Tutup</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}
