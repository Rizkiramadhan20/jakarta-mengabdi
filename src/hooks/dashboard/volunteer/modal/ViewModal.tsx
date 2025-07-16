import React, { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

import { Card, CardContent } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import type { Volunteer } from '@/interface/volunteer';

import Image from 'next/image';
import { formatDateTimeIndo } from '@/base/helper/FormatDate';

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
            <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold mb-2">Detail Volunteer</DialogTitle>
                </DialogHeader>
                {viewingVolunteer && (
                    <Card className="w-full">
                        <CardContent className="flex flex-col gap-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Gambar Volunteer */}
                                {viewingVolunteer.img_url && viewingVolunteer.img_url.length > 0 ? (
                                    <div className="flex flex-col items-center md:w-64 gap-3">
                                        <Image
                                            width={1080}
                                            height={1080}
                                            src={viewingVolunteer.img_url[mainImageIdx] || ''}
                                            alt={viewingVolunteer.title}
                                            className="w-48 h-48 object-cover rounded-lg border shadow"
                                        />
                                        {viewingVolunteer.img_url.length > 1 && (
                                            <div className="flex gap-2 mt-2">
                                                {viewingVolunteer.img_url.map((img, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setMainImageIdx(idx)}
                                                        className={`w-12 h-12 rounded border-2 transition-all ${idx === mainImageIdx
                                                            ? 'border-primary'
                                                            : 'border-gray-300 hover:border-primary/50'
                                                            }`}
                                                    >
                                                        <Image
                                                            width={48}
                                                            height={48}
                                                            src={img}
                                                            alt={`${viewingVolunteer.title} ${idx + 1}`}
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
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
                                    <div className="font-semibold text-gray-700">Lokasi:</div>
                                    <div>{viewingVolunteer.location}</div>
                                    <div className="font-semibold text-gray-700">Sesion Type:</div>
                                    <div>{viewingVolunteer.session_type}</div>
                                    <div className="font-semibold text-gray-700">Jadwal event:</div>
                                    <div>{viewingVolunteer.time ? formatDateTimeIndo(viewingVolunteer.time) : '-'}</div>
                                    <div className="font-semibold text-gray-700">Batas Pendaftaran:</div>
                                    <div>{viewingVolunteer.last_time ? formatDateTimeIndo(viewingVolunteer.last_time) : '-'}</div>
                                    <div className="font-semibold text-gray-700">File Dokumen:</div>
                                    <div>{viewingVolunteer.file_document ? <a href={viewingVolunteer.file_document} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Lihat Dokumen</a> : '-'}</div>
                                    <div className="font-semibold text-gray-700">Form Link:</div>
                                    <div>{viewingVolunteer.form_link ? <a href={viewingVolunteer.form_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Lihat Form</a> : '-'}</div>
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <div className="font-semibold mb-1 text-gray-700">Deskripsi:</div>
                                <div className="prose max-w-none bg-gray-50 rounded p-4 border text-gray-800">{viewingVolunteer.description}</div>
                            </div>

                            {/* Detail JSON */}
                            <div>
                                <div className="font-semibold mb-1 text-gray-700">Detail:</div>
                                <div className="prose max-w-none bg-gray-50 rounded p-4 border text-gray-800">
                                    {Array.isArray(viewingVolunteer.detail) ? (
                                        <ul className="list-disc pl-4 space-y-1">
                                            {viewingVolunteer.detail.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <pre className="whitespace-pre-wrap">{JSON.stringify(viewingVolunteer.detail, null, 2)}</pre>
                                    )}
                                </div>
                            </div>

                            {/* Devisi JSON */}
                            <div>
                                <div className="font-semibold mb-1 text-gray-700">Devisi:</div>
                                <div className="prose max-w-none bg-gray-50 rounded p-4 border text-gray-800">
                                    {Array.isArray(viewingVolunteer.devisi) ? (
                                        <ul className="list-disc pl-4 space-y-1">
                                            {viewingVolunteer.devisi.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <pre className="whitespace-pre-wrap">{JSON.stringify(viewingVolunteer.devisi, null, 2)}</pre>
                                    )}
                                </div>
                            </div>

                            {/* Timeline JSON */}
                            <div>
                                <div className="font-semibold mb-1 text-gray-700">Timeline:</div>
                                <div className="prose max-w-none bg-gray-50 rounded p-4 border text-gray-800">
                                    {Array.isArray(viewingVolunteer.timeline) ? (
                                        <ul className="list-disc pl-4 space-y-1">
                                            {viewingVolunteer.timeline.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <pre className="whitespace-pre-wrap">{JSON.stringify(viewingVolunteer.timeline, null, 2)}</pre>
                                    )}
                                </div>
                            </div>

                            {/* Konten */}
                            <div>
                                <div className="font-semibold mb-1 text-gray-700">Konten:</div>
                                <div className="prose max-w-none bg-gray-50 rounded p-4 border text-gray-800">{viewingVolunteer.content}</div>
                            </div>
                        </CardContent>
                    </Card>
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
