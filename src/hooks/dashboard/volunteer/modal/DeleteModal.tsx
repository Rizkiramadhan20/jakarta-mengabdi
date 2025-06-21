import React from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

import { DeleteModalProps } from '@/interface/volunteer'

const DeleteModal: React.FC<DeleteModalProps> = ({
    open,
    onOpenChange,
    deletingId,
    setDeleteModalOpen,
    setDeletingId,
    handleDelete,
    deleting,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Konfirmasi Hapus Produk</DialogTitle>
                </DialogHeader>
                <div>Apakah Anda yakin ingin menghapus produk ini?</div>
                <DialogFooter>
                    <Button
                        variant="destructive"
                        disabled={deleting}
                        onClick={async () => {
                            if (deletingId !== null) {
                                await handleDelete(deletingId);
                                setDeleteModalOpen(false);
                                setDeletingId(null);
                            }
                        }}
                    >
                        {deleting ? 'Menghapus...' : 'Ya, hapus'}
                    </Button>
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDeleteModalOpen(false);
                                setDeletingId(null);
                            }}
                            disabled={deleting}
                        >
                            Batal
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteModal;
