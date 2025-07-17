import React from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

interface DeleteModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    deletingId: number | null;
    setDeleteModalOpen: (open: boolean) => void;
    setDeletingId: (id: number | null) => void;
    handleDelete: (id: number) => Promise<void>;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    open,
    onOpenChange,
    deletingId,
    setDeleteModalOpen,
    setDeletingId,
    handleDelete,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Konfirmasi Hapus JMerch</DialogTitle>
                </DialogHeader>
                <div>Apakah Anda yakin ingin menghapus JMerch ini?</div>
                <DialogFooter>
                    <Button
                        variant="destructive"
                        onClick={async () => {
                            if (deletingId !== null) {
                                await handleDelete(deletingId);
                                setDeleteModalOpen(false);
                                setDeletingId(null);
                            }
                        }}
                    >
                        Ya, hapus
                    </Button>
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDeleteModalOpen(false);
                                setDeletingId(null);
                            }}
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
