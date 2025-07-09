import React from "react";
import Image from "next/image";

import banner1 from "@/base/assets/banner/bingkai.png";
import banner2 from "@/base/assets/banner/bingkai-1.png";
import banner3 from "@/base/assets/banner/bingkai-2.png";
import banner4 from "@/base/assets/banner/bingkai-3.png";
import banner5 from "@/base/assets/banner/bingkai-4.png";
import banner6 from "@/base/assets/banner/bingkai-5.png";
import vector from "@/base/assets/banner/vector.png";

export default function BannerLayout() {
    return (
        <div className="relative w-full min-h-[600px] bg-gradient-to-r from-[#F5F5F5] to-[#BDBDBD] flex flex-col items-center justify-center py-10 overflow-hidden">
            {/* Background grid images */}
            <div
                className="absolute inset-0 z-0 grid gap-8 opacity-40"
                style={{
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gridTemplateRows: "repeat(2, 1fr)",
                }}
            >
                <div className="relative aspect-[4/4] sm:aspect-[16/9] w-full h-full">
                    <Image src={banner1} alt="bg1" fill className="object-cover w-full h-full" />
                </div>
                <div className="relative aspect-[4/4] sm:aspect-[16/9] w-full h-full">
                    <Image src={banner2} alt="bg2" fill className="object-cover w-full h-full" />
                </div>
                <div className="relative aspect-[4/4] sm:aspect-[16/9] w-full h-full">
                    <Image src={banner3} alt="bg3" fill className="object-cover w-full h-full" />
                </div>
                <div className="relative aspect-[4/4] sm:aspect-[16/9] w-full h-full">
                    <Image src={banner4} alt="bg4" fill className="object-cover w-full h-full" />
                </div>
                <div className="relative aspect-[4/4] sm:aspect-[16/9] w-full h-full">
                    <Image src={banner5} alt="bg5" fill className="object-cover w-full h-full" />
                </div>
                <div className="relative aspect-[4/4] sm:aspect-[16/9] w-full h-full">
                    <Image src={banner6} alt="bg6" fill className="object-cover w-full h-full" />
                </div>
            </div>

            {/* White gradient overlay left bottom */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute left-0 bottom-0 w-full h-full"
                    style={{
                        background: "linear-gradient(120deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 10%, rgba(255,255,255,0.0) 70%)",
                    }}
                />
            </div>

            {/* Overlay gradient right to left to reduce blur on the right */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute right-0 top-0 h-full w-full"
                    style={{
                        background: "linear-gradient(90deg, rgba(255,255,255,0) 80%, rgba(255,255,255,0.7) 100%)",
                    }}
                />
            </div>

            {/* Overlay gradient left to right (kiri atas sampai bawah) */}
            <div className="absolute left-0 top-0 h-full w-1/3 z-20 pointer-events-none"
                style={{
                    background: "linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.0) 100%)",
                }}
            />

            {/* Main content */}
            <div className="relative z-20 w-full flex flex-col items-center px-4">
                {/* Orange box with text */}
                <div
                    className="bg-orange-500 text-white font-bold rounded px-6 py-6 mb-4 shadow-md max-w-2xl w-full"
                >
                    <span className="text-2xl md:text-3xl lg:text-4xl font-bold">
                        Jadi KAKAK SAK
                        <span className="inline-block align-middle mx-1">
                            <Image src={vector} alt="kacamata" width={32} height={24} className="inline-block align-middle md:w-10 md:h-7 w-8 h-6" />
                        </span>, Temani
                        <br className="hidden sm:block" />
                        <span className="block sm:inline">Langkah Mereka Meraih Mimpi</span>
                    </span>
                </div>

                <div className="absolute top-0 -right-10 sm:right-0 bg-white w-20 h-14">

                </div>
                {/* Subtext */}
                <div
                    className="text-[#3E3636] font-bold text-base md:text-lg mt-2 text-center drop-shadow-sm"
                >
                    ayo jadi bagian dari perubahan, mulai dari hari ini.
                </div>
            </div>

            {/* Responsive grid adjustment */}
            <style jsx>{`
        @media (max-width: 1024px) {
          div[style*='gridTemplateColumns'] {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-template-rows: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          div[style*='gridTemplateColumns'] {
            grid-template-columns: 1fr !important;
            grid-template-rows: repeat(6, 1fr) !important;
          }
        }
      `}</style>
        </div>
    );
}
