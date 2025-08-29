import React from 'react'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'

import { Profile } from '@/interface/profile'

type DeleteModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    targetUser: Profile | null
    deleting: boolean
    onCancel: () => void
    onConfirm: () => void
}

export default function DeleteModal({
    open,
    onOpenChange,
    targetUser,
    deleting,
    onCancel,
    onConfirm,
}: DeleteModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Konfirmasi Hapus Pengguna</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus pengguna{' '}
                        <span className="font-semibold">{targetUser?.full_name || targetUser?.email}</span>?
                        <br />
                        <span className="text-destructive">
                            Tindakan ini tidak dapat dibatalkan.
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={deleting}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={deleting}
                    >
                        {deleting ? 'Menghapus...' : 'Hapus Pengguna'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
