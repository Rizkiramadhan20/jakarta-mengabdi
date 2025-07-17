import React from 'react';

import {
    FaFacebookF,
    FaLinkedinIn,
    FaInstagram,
    FaYoutube,
    FaTwitter,
    FaTiktok
} from 'react-icons/fa';

import { BiLogoInstagram, BiLogoTiktok } from 'react-icons/bi';

import { BsShop } from 'react-icons/bs';

import logo from "@/base/assets/logo.png"

import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-[#ed8002] text-white">
            <div className="container px-4 md:px-14 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Company Info Section */}
                    <div className="space-y-6">
                        {/* Logo and Address */}
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 flex items-center justify-center">
                                <Image src={logo} alt="Jakarta Mengabdi Logo" className="w-full h-full object-contain p-2" />
                            </div>
                            <div className="text-sm leading-relaxed">
                                <p className="font-semibold mb-2">Jl. Pertani No. 14 Duren Tiga.</p>
                                <p>Pancoran, Jakarta Selatan. 12760</p>
                                <p>Indonesia</p>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-orange-200">M</span>
                                <span>+62 856 1312 161</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-orange-200">E</span>
                                <span>jakartamengabdi@gmail.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-orange-100 uppercase tracking-wider">
                            Ikuti Cerita Kami
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { icon: FaFacebookF, label: 'Facebook' },
                                { icon: FaLinkedinIn, label: 'LinkedIn' },
                                { icon: FaInstagram, label: 'Instagram' },
                                { icon: FaYoutube, label: 'YouTube' },
                                { icon: FaTwitter, label: 'Twitter' },
                                { icon: FaTiktok, label: 'TikTok' }
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="group w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white hover:text-orange-500 transition-all duration-300 transform hover:scale-110 border border-white/20"
                                    aria-label={social.label}
                                >
                                    <social.icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* JMERCH Section */}
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <h3 className="text-xl font-bold text-orange-100">JMERCH</h3>
                            <p className="text-sm text-orange-100 leading-relaxed">
                                Tampil maksimal dengan koleksi produk dari JMerch
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {[
                                { icon: BiLogoInstagram, label: 'Instagram' },
                                { icon: BiLogoTiktok, label: 'TikTok' },
                                { icon: BsShop, label: 'Shop' }
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="group w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white hover:text-orange-500 transition-all duration-300 transform hover:scale-110 border border-white/20"
                                    aria-label={social.label}
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Border */}
                <div className="mt-8 pt-8 border-t border-white/20">
                    <div className="text-center text-sm text-orange-100">
                        <p>&copy; 2024 Jakarta Mengabdi. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
