import React from 'react'

import Image from 'next/image'

import blob from "@/base/assets/blobs.png"

import { OnlineStore } from '@/interface/jmerch'

import Link from 'next/link'

export default function SocialMedia({ onlineStoreData }: { onlineStoreData: OnlineStore[] }) {
    return (
        <section className='py-8 md:py-12 lg:py-16 bg-[#ED8002] overflow-hidden'>
            <div className="px-4 md:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    <div className="lg:col-span-2 pt-8 md:pt-12 lg:pt-20 flex flex-col gap-6 md:gap-8 lg:gap-10">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                            Let's Uniform the Spirit of Giving
                        </h2>

                        <div className="space-y-3 md:space-y-4 max-w-[600px]">
                            <p className="text-white text-base md:text-lg">
                                JMerch Konveksi adalah mitra produksi pakaian dan merchandise untuk komunitas dan gerakan sosial.
                            </p>
                            <p className="text-white text-base md:text-lg">
                                Kami melayani pesanan dalam skala kecil maupun besar—mulai dari kaos, jaket, hingga totebag—dengan desain custom yang bisa disesuaikan sepenuhnya dengan identitas dan semangat pengabdianmu..
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                            {onlineStoreData.map((item, idx) => {
                                return (
                                    <Link href={item.url} key={idx} className='bg-[#553510] text-white px-4 md:px-6 py-3 md:py-4 rounded-full font-medium flex items-center justify-center text-sm md:text-base'>
                                        <span>
                                            {item.name}
                                        </span>
                                        <div className="w-2 h-2 rounded-full ml-2 bg-gray-300"></div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    <div className="lg:col-span-1 relative min-h-[200px] md:min-h-[300px] lg:min-h-[550px] hidden lg:block">
                        <div className="absolute -right-50 -top-18 w-full h-full flex items-center justify-center pointer-events-none select-none">
                            <Image
                                src={blob}
                                alt="Blob"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
