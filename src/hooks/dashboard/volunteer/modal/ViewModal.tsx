import React, { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

import type { Volunteer } from '@/types/volunteer';

interface ViewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    viewingVolunteer: Volunteer | null;
    onClose: () => void;
}

export default function ViewModal({ open, onOpenChange, viewingVolunteer, onClose }: ViewModalProps) {
    const [mainImageIdx, setMainImageIdx] = useState(0);
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold mb-2">Detail Volunteer</DialogTitle>
                </DialogHeader>
                {viewingVolunteer && (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Gambar Volunteer */}
                            {viewingVolunteer.img_url ? (
                                <div className="flex flex-col items-center md:w-64 gap-3">
                                    <img
                                        src={viewingVolunteer.img_url}
                                        alt={viewingVolunteer.title}
                                        className="w-48 h-48 object-cover rounded-lg border shadow"
                                    />
                                </div>
                            ) : (
                                <div className="w-48 h-48 flex items-center justify-center border rounded-lg text-muted-foreground bg-gray-50">No image</div>
                            )}
                            {/* Detail Volunteer */}
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-base">
                                <div className="font-semibold text-gray-700">Judul:</div>
                                <div>{viewingVolunteer.title}</div>
                                <div className="font-semibold text-gray-700">Kategori:</div>
                                <div>{viewingVolunteer.category}</div>
                                <div className="font-semibold text-gray-700">Kuota:</div>
                                <div>{viewingVolunteer.quota_available}</div>
                                <div className="font-semibold text-gray-700">Lokasi:</div>
                                <div>{viewingVolunteer.location}</div>
                                <div className="font-semibold text-gray-700">Waktu:</div>
                                <div>{new Date(viewingVolunteer.time).toLocaleString('id-ID')}</div>
                                <div className="font-semibold text-gray-700">Harga:</div>
                                <div>Rp{Number(viewingVolunteer.price).toLocaleString()}</div>
                                <div className="font-semibold text-gray-700">File Dokumen:</div>
                                <div>{viewingVolunteer.file_document ? <a href={viewingVolunteer.file_document} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Lihat Dokumen</a> : '-'}</div>
                            </div>
                        </div>
                        {/* Detail Tambahan */}
                        <div>
                            <div className="font-semibold mb-1 text-gray-700">Detail:</div>
                            <div className="prose max-w-none bg-gray-50 rounded p-4 border text-gray-800">{viewingVolunteer.detail}</div>
                        </div>
                        <div>
                            <div className="font-semibold mb-1 text-gray-700">Kriteria:</div>
                            <div className="prose max-w-none bg-gray-50 rounded p-4 border text-gray-800">{viewingVolunteer.criteria}</div>
                        </div>
                        <div>
                            <div className="font-semibold mb-1 text-gray-700">Tugas:</div>
                            <div className="prose max-w-none bg-gray-50 rounded p-4 border text-gray-800">{viewingVolunteer.tasks}</div>
                        </div>
                        <div>
                            <div className="font-semibold mb-1 text-gray-700">Goals:</div>
                            <div className="prose max-w-none bg-gray-50 rounded p-4 border text-gray-800">{Array.isArray(viewingVolunteer.goals) ? viewingVolunteer.goals.join(', ') : JSON.stringify(viewingVolunteer.goals)}</div>
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
