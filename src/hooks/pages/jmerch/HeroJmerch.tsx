"use client"

import React from 'react'

import Image from 'next/image'

import { motion, useScroll, useTransform } from 'framer-motion'

import banner from '@/base/assets/banner.png'

export default function JmerchHero() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <div className="relative sm:h-[70vh] mt-20 overflow-hidden">
            <motion.div
                className="absolute inset-0"
                style={{ y }}
            >
                <Image
                    src={banner}
                    alt="banner"
                    className='w-full h-full object-cover'
                    priority
                />
                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-12 z-10"
                    style={{ opacity }}
                >
                    <h3 className='text-4xl md:text-6xl font-bold text-white max-w-3xl text-center'>Tampil Maksimal dengan koleksi produk</h3>

                    <div className="flex items-center gap-3 bg-[#ED8002] px-10 py-4 rounded-md -rotate-10">
                        <span className='text-3xl text-white transition-all duration-300 font-bold' style={{
                            letterSpacing: 5
                        }}>
                            JMERCH
                        </span>
                    </div>

                    <span className='text-sm md:text-xl text-white/90 max-w-[450px] text-center'>100% keuntungan dari JMerch digunakan untuk operasional kegiatan Jakarta Mengabdi</span>
                </motion.div>
            </motion.div>
        </div>
    )
}