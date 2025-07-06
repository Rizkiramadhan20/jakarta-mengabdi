import React from 'react'

import { Button } from '@/components/ui/button'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

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

interface DeleteModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: DonasiTransaction | null;
    onDelete: () => void;
    deleting: boolean;
}

export default function DeleteModal({
    open,
    onOpenChange,
    transaction,
    onDelete,
    deleting
}: DeleteModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Konfirmasi Hapus</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Apakah Anda yakin ingin menghapus transaksi ini?
                    </p>
                    {transaction && (
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                            <div>
                                <span className="font-medium">Order ID:</span>
                                <p className="text-gray-600 font-mono">{transaction.order_id}</p>
                            </div>
                            <div>
                                <span className="font-medium">Donatur:</span>
                                <p className="text-gray-600">{transaction.name}</p>
                            </div>
                            <div>
                                <span className="font-medium">Amount:</span>
                                <p className="text-gray-600 font-semibold">Rp {transaction.amount.toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={deleting}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={onDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Menghapus...' : 'Hapus'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
