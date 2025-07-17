"use client"

import React, { useState } from 'react'

import { JMerch } from "@/interface/jmerch"

import { Button } from "@/components/ui/button"

import Image from 'next/image'

import JmerchGalleryDialog from '@/components/jmerch/JmerchGalleryDialog'

export default function JmerchLayout({ jmerchData }: { jmerchData: JMerch[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className='py-16'>
            <div className="container px-4 md:px-14">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-[#ED8002] lg:text-4xl">Lengkapi koleksimu</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-8 md:grid-cols-3 lg:grid-cols-4">
                    {jmerchData.map((item, idx) => (
                        <React.Fragment key={idx}>
                            <div className="group overflow-hidden rounded-xl border-none transition-all duration-300 px-2 cursor-pointer" onClick={() => setOpenIndex(idx)}>
                                <div className="relative w-full aspect-square overflow-hidden mb-4">
                                    <Button className="relative w-full h-full p-0 min-h-0 min-w-0">
                                        <Image
                                            src={item.thumbnail?.[0] || ''}
                                            alt={item.name}
                                            quality={100}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </Button>
                                </div>
                                <h3 className="text-xl font-semibold text-[#413223]">{item.name}</h3>
                            </div>
                            <JmerchGalleryDialog
                                open={openIndex === idx}
                                onOpenChange={open => setOpenIndex(open ? idx : null)}
                                title={item.name}
                                images={item.thumbnail || []}
                            />
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    )
}
