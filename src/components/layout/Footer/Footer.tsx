import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-orange-500 text-white py-8 px-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
                {/* Kiri */}
                <div className="flex-1 flex flex-col gap-4 min-w-[250px]">
                    {/* Logo dan alamat */}
                    <div className="flex items-start gap-4">
                        {/* Logo Placeholder */}
                        <div className="w-16 h-16 bg-white rounded flex items-center justify-center">
                            <span className="text-orange-500 font-bold text-2xl">Logo</span>
                        </div>
                        <div className="text-sm">
                            <div className="font-semibold mb-1">Jl. Pertani No. 14 Duren Tiga.<br />Pancoran, Jakarta Selatan. 12760<br />Indonesia</div>
                        </div>
                    </div>
                    {/* Kontak */}
                    <div className="text-sm mt-2">
                        <div className="mb-1"><span className="font-bold">M</span> &nbsp; +62 856 1312 161</div>
                        <div><span className="font-bold">E</span> &nbsp; jakartamengabdi@gmail.com</div>
                    </div>
                    {/* Ikuti Cerita Kami */}
                    <div className="mt-4">
                        <div className="uppercase text-xs font-bold mb-2 tracking-widest">Ikuti Cerita Kami</div>
                        <div className="flex gap-3">
                            {/* Icon Placeholder */}
                            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-orange-500">F</div>
                            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-orange-500">L</div>
                            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-orange-500">I</div>
                            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-orange-500">Y</div>
                            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-orange-500">T</div>
                            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-orange-500">Tt</div>
                        </div>
                    </div>
                </div>
                {/* Garis pemisah */}
                <div className="hidden md:block w-px bg-white/30 h-40 mx-8" />
                {/* Kanan */}
                <div className="flex-1 flex flex-col gap-4 min-w-[250px]">
                    <div className="font-bold text-lg mb-2">JMERCH</div>
                    <div className="text-sm mb-4">Tampil maksimal dengan koleksi produk dari JMerch</div>
                    <div className="flex gap-3">
                        {/* Icon Placeholder */}
                        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-orange-500">I</div>
                        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-orange-500">Tt</div>
                        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-orange-500">B</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
