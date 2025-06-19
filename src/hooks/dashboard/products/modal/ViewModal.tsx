import React from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

import type { Product } from '@/types/products';

interface ViewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    viewingProduct: Product | null;
    onClose: () => void;
}

export default function ViewModal({ open, onOpenChange, viewingProduct, onClose }: ViewModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detail Produk</DialogTitle>
                </DialogHeader>
                {viewingProduct && (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            {viewingProduct.image_urls && viewingProduct.image_urls.length > 0 ? (
                                <div className="flex flex-row md:flex-col gap-2 md:w-48">
                                    {viewingProduct.image_urls.map((url, idx) => (
                                        <img key={idx} src={url} alt={`Image ${idx + 1}`} className="w-24 h-24 object-cover rounded border" />
                                    ))}
                                </div>
                            ) : (
                                <div className="w-24 h-24 flex items-center justify-center border rounded text-muted-foreground">No image</div>
                            )}
                            <div className="flex-1 flex flex-col gap-2">
                                <div><span className="font-semibold">Name:</span> {viewingProduct.name}</div>
                                <div><span className="font-semibold">Price:</span> Rp{Number(viewingProduct.price).toLocaleString()}</div>
                                <div><span className="font-semibold">Stock:</span> {viewingProduct.stock}</div>
                                <div><span className="font-semibold">Status:</span> {viewingProduct.status}</div>
                                <div><span className="font-semibold">Created At:</span> {new Date(viewingProduct.created_at).toLocaleString('id-ID')}</div>
                            </div>
                        </div>
                        <div>
                            <div className="font-semibold mb-1">Content:</div>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: viewingProduct.content }} />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" onClick={onClose}>Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
