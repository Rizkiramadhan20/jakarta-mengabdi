import React from 'react'

import Image from 'next/image';

import banner from "@/base/assets/kakasaku.png"

export default function BannerLayout() {
    return (
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/11" }} className='order-1 md:order-2'>
            <Image src={banner} alt='banner' className='rounded-md' fill style={{ objectFit: "cover" }} />
        </div>
    )
}
