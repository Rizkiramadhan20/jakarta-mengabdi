import React from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

import type { Donasi } from '@/types/donasi';

import Image from 'next/image';

interface ViewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    viewingProduct: Donasi | null;
    onClose: () => void;
}

export default function ViewModal({ open, onOpenChange, viewingProduct, onClose }: ViewModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl p-0">
                <DialogHeader className="px-4 pt-4 pb-0">
                    <DialogTitle className="text-2xl font-bold mb-2">Detail Donasi</DialogTitle>
                </DialogHeader>
                {viewingProduct && (
                    <div className="flex flex-col gap-8 px-4 py-4">
                        {/* Gambar */}
                        <div className="w-full flex items-start justify-center">
                            <div className="w-full bg-gray-100 rounded-lg border shadow overflow-hidden flex items-center justify-center">
                                <Image
                                    src={viewingProduct.image_url || ""}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    alt={viewingProduct.title}
                                    className="object-cover w-full h-[300px] md:h-[400px] lg:h-[500px]"
                                />
                            </div>
                        </div>

                        {/* Detail */}
                        <div className="flex-1 flex flex-col gap-4">
                            <h2 className="text-xl font-bold text-gray-800 mb-1">{viewingProduct.title}</h2>
                            <p className="text-gray-600 mb-2 whitespace-pre-line">{viewingProduct.description}</p>
                            <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2 border">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-700">Target</span>
                                    <span className="font-semibold text-green-700">Rp{viewingProduct.target_amount.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-700">Terkumpul</span>
                                    <span className="font-semibold text-blue-700">Rp{viewingProduct.current_amount.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-700">Status</span>
                                    <span className="font-semibold text-gray-900">{viewingProduct.status}</span>
                                </div>
                                {viewingProduct.deadline && (
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-700">Deadline</span>
                                        <span className="font-semibold text-red-700">{viewingProduct.deadline}</span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4">
                                <span className="font-semibold text-gray-800">Template Pesan:</span>
                                <div className="bg-gray-100 p-3 rounded text-sm whitespace-pre-line border mt-1">{viewingProduct.message_template}</div>
                            </div>
                        </div>
                    </div>
                )}
                <DialogFooter className="px-4 pb-4 pt-0 flex justify-end">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" onClick={onClose}>Tutup</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
