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
        <div className="relative h-[70vh] mt-14 overflow-hidden">
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
                    className="absolute inset-0 flex flex-col items-center justify-center gap-8 z-10 p-4 md:gap-12"
                    style={{ opacity }}
                >
                    <h3 className='text-3xl font-bold text-white max-w-3xl text-center md:text-5xl lg:text-6xl'>Tampil Maksimal dengan koleksi produk</h3>

                    <div className="flex items-center gap-3 bg-[#ED8002] px-8 py-3 rounded-md -rotate-10 sm:px-10 sm:py-4">
                        <span className='text-2xl text-white transition-all duration-300 font-bold sm:text-3xl' style={{
                            letterSpacing: 5
                        }}>
                            JMERCH
                        </span>
                    </div>

                    <span className='text-sm text-white/90 max-w-xs text-center sm:max-w-md md:text-lg'>100% keuntungan dari JMerch digunakan untuk operasional kegiatan Jakarta Mengabdi</span>
                </motion.div>
            </motion.div>
        </div>
    )
}