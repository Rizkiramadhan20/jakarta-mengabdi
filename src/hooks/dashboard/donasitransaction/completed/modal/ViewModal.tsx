import React from 'react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Badge } from '@/components/ui/badge'

interface DonasiTransaction {
    id: string;
    order_id: string;
    donasi_id: number;
    name: string;
    email: string;
    photo_url?: string;
    image_url: string;
    amount: number;
    status: string;
    payment_type?: string;
    transaction_time?: string;
    midtrans_response?: string;
    created_at?: string;
}

interface Donasi {
    id: number;
    title: string;
    slug: string;
}

interface ViewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: DonasiTransaction | null;
    donasiList: Donasi[];
}

export default function ViewModal({ open, onOpenChange, transaction, donasiList }: ViewModalProps) {
    const getDonasiTitle = (donasiId: number) => {
        const donasi = donasiList.find(d => d.id === donasiId);
        return donasi?.title || `ID: ${donasiId}`;
    };

    const getStatusBadge = (status: string) => {
        const statusMap: { [key: string]: { variant: "default" | "secondary" | "destructive" | "outline", label: string } } = {
            'settlement': { variant: 'default', label: 'Berhasil' },
            'capture': { variant: 'default', label: 'Berhasil' },
            'success': { variant: 'default', label: 'Berhasil' },
            'pending': { variant: 'secondary', label: 'Pending' },
            'deny': { variant: 'destructive', label: 'Ditolak' },
            'expire': { variant: 'destructive', label: 'Kadaluarsa' },
            'cancel': { variant: 'outline', label: 'Dibatalkan' }
        };

        const statusInfo = statusMap[status] || { variant: 'outline', label: status };
        return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
    };

    const renderMidtransDetails = (midtransResponse: any) => {
        if (!midtransResponse) return <p className="text-gray-500">Tidak ada detail transaksi</p>;

        let data: any = midtransResponse;
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch {
                return <p className="text-gray-500">Format data tidak valid</p>;
            }
        }

        return (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="font-semibold">Order ID:</span>
                        <p className="text-gray-600">{data.order_id || '-'}</p>
                    </div>
                    <div>
                        <span className="font-semibold">Status:</span>
                        <p className="text-gray-600">{data.transaction_status || data.status || '-'}</p>
                    </div>
                    <div>
                        <span className="font-semibold">Payment Type:</span>
                        <p className="text-gray-600">{data.payment_type || '-'}</p>
                    </div>
                    <div>
                        <span className="font-semibold">Amount:</span>
                        <p className="text-gray-600">Rp {data.gross_amount?.toLocaleString() || '-'}</p>
                    </div>
                </div>
                {data.va_numbers && (
                    <div>
                        <span className="font-semibold">Virtual Account:</span>
                        <div className="mt-1 space-y-1">
                            {data.va_numbers.map((va: any, idx: number) => (
                                <p key={idx} className="text-gray-600 text-sm">
                                    {va.bank} - {va.va_number}
                                </p>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Detail Transaksi</DialogTitle>
                </DialogHeader>
                {transaction && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold mb-2">Informasi Donatur</h4>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="font-medium">Nama:</span>
                                        <p className="text-gray-600">{transaction.name}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Email:</span>
                                        <p className="text-gray-600">{transaction.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Informasi Transaksi</h4>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="font-medium">Order ID:</span>
                                        <p className="text-gray-600 font-mono">{transaction.order_id}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Amount:</span>
                                        <p className="text-gray-600 font-semibold">Rp {transaction.amount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Status:</span>
                                        <div className="mt-1">{getStatusBadge(transaction.status)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Donasi</h4>
                            <p className="text-gray-600">{getDonasiTitle(transaction.donasi_id)}</p>
                        </div>

                        {transaction.midtrans_response && (
                            <div>
                                <h4 className="font-semibold mb-2">Detail Midtrans</h4>
                                {renderMidtransDetails(transaction.midtrans_response)}
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
