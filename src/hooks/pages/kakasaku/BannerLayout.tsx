import React from 'react'
import Image from 'next/image';

export default function BannerLayout() {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-lg shadow p-6 gap-10 w-full overflow-hidden">
            {/* Gambar HP */}
            <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
                <Image
                    src={require('@/base/assets/login.jpg')}
                    alt="Mockup aplikasi di HP"
                    className="rounded-xl shadow-lg object-contain"
                    width={300}
                    height={600}
                />
            </div>

            {/* Konten Teks */}
            <div className="w-full md:w-1/2 flex flex-col items-start md:items-start">
                <h1 className="text-2xl md:text-4xl font-bold text-blue-700 mb-4 leading-tight">
                    Berbuat baik setiap hari menjadi <br className="hidden md:block" /> lebih mudah
                </h1>
                <p className="text-base md:text-lg text-gray-700 mb-4">
                    Download aplikasi WeCare.id
                </p>
                <div className="flex gap-4">
                    {/* Tombol Google Play */}
                    <a
                        href="https://play.google.com/store"
                        target="_blank"
                        rel="noopener noreferrer"
                        className=""
                    >
                        <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                            alt="Get it on Google Play"
                            width={150}
                            height={45}
                        />
                    </a>
                    {/* Tombol App Store */}
                    <a
                        href="https://www.apple.com/app-store/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className=""
                    >
                        <Image
                            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                            alt="Download on the App Store"
                            width={150}
                            height={45}
                        />
                    </a>
                </div>
            </div>
        </div>
    )
}
