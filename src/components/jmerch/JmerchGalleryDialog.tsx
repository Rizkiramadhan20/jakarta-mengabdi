import React, { useState, useEffect } from 'react';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

import { ScrollArea } from '@/components/ui/scroll-area';

import Image from 'next/image';

interface JmerchGalleryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    images: string[];
}

const JmerchGalleryDialog: React.FC<JmerchGalleryDialogProps> = ({ open, onOpenChange, title, images }) => {
    const [activeIdx, setActiveIdx] = useState(0);

    // Reset activeIdx ke 0 setiap kali dialog dibuka/gambar berubah
    useEffect(() => {
        if (open) setActiveIdx(0);
    }, [open, images]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-4 sm:p-6">
                <DialogTitle className="mb-4">{title}</DialogTitle>
                <div className="flex flex-col md:flex-row gap-4 min-h-[300px] overflow-hidden">
                    {/* Gambar utama */}
                    <div className="flex-1 flex items-center justify-center min-w-0">
                        {images[activeIdx] && (
                            <div className="relative w-full aspect-[4/3] max-h-[60vh] rounded-lg overflow-hidden bg-black/10">
                                <Image
                                    src={images[activeIdx]}
                                    alt={`Gambar utama`}
                                    fill
                                    className="object-contain max-h-[60vh]"
                                />
                            </div>
                        )}
                    </div>

                    {/* Thumbnail di bawah (mobile) / kanan (desktop) dengan ScrollArea */}
                    <ScrollArea className="w-full md:w-auto max-w-full md:max-h-[60vh] md:min-w-[100px]">
                        <div className="flex flex-row flex-nowrap md:flex-col md:flex-wrap gap-2 pt-2">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setActiveIdx(i)}
                                    className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeIdx === i ? 'border-[#ED8002] shadow-lg' : 'border-transparent'} focus:outline-none`}
                                    style={{ outline: activeIdx === i ? '2px solid #ED8002' : undefined }}
                                >
                                    <Image
                                        src={img}
                                        alt={`Thumbnail ${i + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default JmerchGalleryDialog; 