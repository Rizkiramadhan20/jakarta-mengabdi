import React, { useState } from 'react';

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
    const [mainImageIdx, setMainImageIdx] = useState(0);
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold mb-2">Detail Produk</DialogTitle>
                </DialogHeader>
                {viewingProduct && (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Gambar Produk */}
                            {viewingProduct.image_urls && viewingProduct.image_urls.length > 0 ? (
                                <div className="flex flex-col items-center md:w-64 gap-3">
                                    <img
                                        src={viewingProduct.image_urls[mainImageIdx]}
                                        alt={`Main Image`}
                                        className="w-48 h-48 object-cover rounded-lg border shadow"
                                    />
                                    {viewingProduct.image_urls.length > 1 && (
                                        <div className="flex flex-row gap-2 mt-2">
                                            {viewingProduct.image_urls.map((url, idx) => (
                                                <img
                                                    key={idx}
                                                    src={url}
                                                    alt={`Thumbnail ${idx + 1}`}
                                                    className={`w-12 h-12 object-cover rounded border cursor-pointer transition-all ${mainImageIdx === idx ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'}`}
                                                    onClick={() => setMainImageIdx(idx)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-48 h-48 flex items-center justify-center border rounded-lg text-muted-foreground bg-gray-50">No image</div>
                            )}
                            {/* Detail Produk */}
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-base">
                                <div className="font-semibold text-gray-700">Name:</div>
                                <div>{viewingProduct.name}</div>
                                <div className="font-semibold text-gray-700">Price:</div>
                                <div>Rp{Number(viewingProduct.price).toLocaleString()}</div>
                                <div className="font-semibold text-gray-700">Stock:</div>
                                <div>{viewingProduct.stock}</div>
                                <div className="font-semibold text-gray-700">Status:</div>
                                <div>{viewingProduct.status}</div>
                                <div className="font-semibold text-gray-700">Created At:</div>
                                <div>{new Date(viewingProduct.created_at).toLocaleString('id-ID')}</div>
                            </div>
                        </div>
                        {/* Konten Produk */}
                        <div>
                            <div className="font-semibold mb-1 text-gray-700">Content:</div>
                            <div className="prose max-w-none bg-gray-50 rounded p-4 border text-gray-800" dangerouslySetInnerHTML={{ __html: viewingProduct.content }} />
                        </div>
                    </div>
                )}
                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" onClick={onClose}>Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
