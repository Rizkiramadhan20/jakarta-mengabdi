import React from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

import { ViewModalProps } from '@/interface/donasi';

import Image from 'next/image';

import { BadgeCheck, Calendar, CheckCircle, Info, Mail, Target } from 'lucide-react';

export default function ViewModal({ open, onOpenChange, viewingProduct, onClose }: ViewModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-0 border border-gray-200">
                <DialogHeader className="px-6 pt-6 pb-0">
                    <DialogTitle className="text-2xl font-bold mb-1 flex items-center gap-2">
                        <Info className="w-6 h-6 text-blue-500" /> Detail Donasi
                    </DialogTitle>
                    {viewingProduct && (
                        <p className="text-gray-500 text-sm mt-1">{viewingProduct.title}</p>
                    )}
                </DialogHeader>
                {viewingProduct && (
                    <div className="flex flex-col gap-8 px-6 py-6">
                        {/* Gambar */}
                        <div className="w-full flex items-center justify-center">
                            <div className="w-full bg-gray-100 rounded-xl border shadow-md overflow-hidden flex items-center justify-center aspect-[4/3] relative">
                                {viewingProduct.image_url ? (
                                    <Image
                                        src={viewingProduct.image_url}
                                        fill
                                        sizes="100vw"
                                        alt={viewingProduct.title}
                                        className="object-cover w-full h-full transition-all duration-300 hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-60 flex items-center justify-center text-gray-400">
                                        <Image className="opacity-30" src="/logo.png" width={120} height={120} alt="No Image" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Detail */}
                        <div className="flex-1 flex flex-col gap-4">
                            <div className="flex items-center gap-2 mb-2">
                                <h2 className="text-xl font-bold text-gray-800 ">{viewingProduct.title}</h2>
                                <span>
                                    {viewingProduct.status === 'open' ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold"><CheckCircle className="w-4 h-4" /> Dibuka</span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold"><BadgeCheck className="w-4 h-4" /> Ditutup</span>
                                    )}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-2 whitespace-pre-line leading-relaxed">{viewingProduct.description}</p>
                            {viewingProduct.content && (
                                <div className="prose prose-blue max-w-none mb-2" dangerouslySetInnerHTML={{ __html: viewingProduct.content }} />
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-4 border border-blue-100">
                                    <Target className="w-6 h-6 text-blue-500" />
                                    <div>
                                        <div className="text-xs text-gray-500">Target</div>
                                        <div className="font-semibold text-blue-700 text-base">Rp{viewingProduct.target_amount.toLocaleString()}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-green-50 rounded-lg p-4 border border-green-100">
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                    <div>
                                        <div className="text-xs text-gray-500">Terkumpul</div>
                                        <div className="font-semibold text-green-700 text-base">Rp{viewingProduct.current_amount.toLocaleString()}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-purple-50 rounded-lg p-4 border border-purple-100">
                                    <Info className="w-6 h-6 text-purple-500" />
                                    <div>
                                        <div className="text-xs text-gray-500">Jumlah Donatur</div>
                                        <div className="font-semibold text-purple-700 text-base">{viewingProduct.donations || 0}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-orange-50 rounded-lg p-4 border border-orange-100">
                                    <Info className="w-6 h-6 text-orange-500" />
                                    <div>
                                        <div className="text-xs text-gray-500">Share</div>
                                        <div className="font-semibold text-orange-700 text-base">{viewingProduct.share || 0}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    <Info className="w-6 h-6 text-gray-500" />
                                    <div>
                                        <div className="text-xs text-gray-500">Status</div>
                                        <div className="font-semibold text-gray-900 text-base">{viewingProduct.status === 'open' ? 'Dibuka' : 'Ditutup'}</div>
                                    </div>
                                </div>
                                {viewingProduct.deadline && (
                                    <div className="flex items-center gap-3 bg-red-50 rounded-lg p-4 border border-red-100">
                                        <Calendar className="w-6 h-6 text-red-500" />
                                        <div>
                                            <div className="text-xs text-gray-500">Deadline</div>
                                            <div className="font-semibold text-red-700 text-base">{viewingProduct.deadline}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-6">
                                <span className="font-semibold text-gray-800 flex items-center gap-2 mb-1"><Mail className="w-5 h-5 text-gray-400" /> Template Pesan:</span>
                                <div className="bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-line border mt-1 flex items-start gap-2">
                                    <span className="text-gray-400"><Mail className="w-4 h-4" /></span>
                                    <span>{viewingProduct.message_template}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <DialogFooter className="px-6 pb-6 pt-0 flex justify-end">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" className="flex items-center gap-2" onClick={onClose}>
                            <span>Tutup</span>
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
