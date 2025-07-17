"use client"

import { Volunteer } from '@/interface/volunteer'

import { Button } from '@/components/ui/button';

import Image from 'next/image';

import logo from '@/base/assets/Ellipse.png'

import { User, BadgeCheck, CircleAlert } from 'lucide-react';

import desc from "@/base/assets/descripsion.png"
import timeline from "@/base/assets/timeline.png"
import details from "@/base/assets/details.png"
import devisi from "@/base/assets/devisi.png"
import relawan from "@/base/assets/relawan.png"
import gallery from "@/base/assets/gallery.png"
import calender from "@/base/assets/calender.png"
import location from "@/base/assets/locations.png"

import { formatIDR } from '@/base/helper/FormatPrice';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { formatDateIndo, formatTimeOnly } from '@/base/helper/FormatDate';

import React from 'react';

import Link from 'next/link';

interface VolunteerLayoutProps {
    volunteerData: Volunteer | null;
}

const formatTimeIndo = (dateStr: string | Date) => {
    try {
        return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
        return '-';
    }
};

export default function VolunteerLayout({ volunteerData }: VolunteerLayoutProps) {
    if (!volunteerData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Data tidak ditemukan</h2>
                    <p className="text-gray-600">Kaka Saku yang Anda cari tidak ditemukan atau telah dihapus.</p>
                </div>
            </div>
        );
    }

    const categoryColors: Record<string, { bg: string; text: string }> = {
        'Pilar Cerdas': { bg: 'bg-[#FFD54F]', text: 'text-white' },
        'Pilar Sehat': { bg: 'bg-[#4FC3F7]', text: 'text-white' },
        'Pilar Lestari': { bg: 'bg-[#4EEA5D]', text: 'text-white' },
        'Pilar Peduli': { bg: 'bg-[#F48FB1]', text: 'text-white' },
    };
    const categoryName = volunteerData.category?.replace(/\b\w/g, l => l.toUpperCase()) || '';
    const color = categoryColors[categoryName] || { bg: 'bg-gray-300', text: 'text-gray-800' };

    return (
        <section className="pt-32 py-10 bg-[#F9F9F9]">
            <div className="container mx-auto px-4 md:px-14">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main/Aside: Gambar + Konten */}
                    <div className="flex-1 flex flex-col gap-6">
                        {/* Gambar (Hero) */}
                        <div className="rounded-2xl overflow-hidden relative group transition-transform duration-300 aspect-w-16 aspect-h-9">
                            <div className="relative w-full h-0 pb-[56.25%]"> {/* 16:9 Aspect Ratio */}
                                <Image
                                    src={volunteerData.img_url[0]}
                                    alt={volunteerData.title}
                                    fill
                                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-2xl"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Author */}
                        <div className='mt-4 mb-4'>
                            <div className="flex items-center gap-2 text-sm">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={logo.src} alt="donasi" />
                                    <AvatarFallback>JM</AvatarFallback>
                                </Avatar>
                                <span className="text-md font-semibold text-gray-800">Jakarta Mengabdi</span>
                                <BadgeCheck className="w-4 h-4 text-blue-500" />
                            </div>
                        </div>

                        {/* Detail Card */}
                        <div className="grid grid-cols-1 gap-6">
                            {/* Deskripsi */}
                            <div className="bg-[#F8F5F2] rounded-xl shadow p-6 border col-span-1">
                                <div className="flex items-center gap-2 text-base font-bold mb-2">
                                    <Image src={desc} alt="desc" width={24} height={24} />
                                    <h3 className='text-xl'>Deskripsi</h3>
                                </div>
                                <p className="text-gray-700 text-base leading-relaxed">{volunteerData.description}</p>
                            </div>
                            {/* Detail Aktivitas */}
                            <div className="bg-[#F8F5F2] rounded-xl shadow p-6 border col-span-1">
                                <div className="flex items-center gap-2 text-base font-bold mb-2">
                                    <Image src={details} alt="details" width={24} height={24} />
                                    <h3 className='text-xl'>Detail Aktivitas</h3>
                                </div>
                                <ol className='list-disc pl-5 space-y-1'>
                                    {volunteerData.detail.map((item: string, idx: number) => (
                                        <li key={idx} className='text-base text-gray-700'>{item}</li>
                                    ))}
                                </ol>
                            </div>
                            {/* Divisi */}
                            <div className="bg-[#F8F5F2] rounded-xl shadow p-6 border col-span-1">
                                <div className="flex items-center gap-2 text-base font-bold mb-4">
                                    <Image src={devisi} alt="devisi" width={24} height={24} />
                                    <h3 className='text-xl'>Divisi</h3>
                                </div>

                                <div className='p-4 bg-white rounded-lg flex flex-col gap-2'>
                                    <div className='flex items-center gap-2'>
                                        <User className='w-4 h-4 text-gray-700' />
                                        <span className='text-base text-gray-700'>{volunteerData.devisi[0]}</span>
                                    </div>

                                    <ol className='list-disc pl-5 space-y-1'>
                                        {volunteerData.devisi.slice(1).map((item: string, idx: number) => (
                                            <li key={idx} className='text-base text-gray-700'>{item}</li>
                                        ))}
                                    </ol>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-[#F8F5F2] rounded-xl shadow p-6 border col-span-1">
                                <div className="flex items-center gap-2 text-base font-bold mb-4">
                                    <Image src={timeline} alt="timeline" width={24} height={24} />
                                    <h3 className='text-xl'>Timeline</h3>
                                </div>

                                <div className='p-4 bg-white rounded-lg'>
                                    <ol className='list-disc pl-5 space-y-1'>
                                        {volunteerData.timeline.map((item: string, idx: number) => (
                                            <li key={idx} className='text-base text-gray-700'>{item}</li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </div>
                        {/* Konten */}
                        <div className="bg-[#F8F5F2] rounded-xl shadow p-6 border mt-0">
                            <div className="flex items-center gap-2 text-base font-bold mb-4">
                                <Image src={relawan} alt="relawan" width={24} height={24} />
                                <h3 className='text-xl'>Relawan</h3>
                            </div>
                            <div className="prose prose-lg max-w-none">
                                <div
                                    dangerouslySetInnerHTML={{ __html: volunteerData.content }}
                                    className="
prose max-w-none text-gray-800 text-sm md:text-base
[&_strong]:text-gray-900 [&_strong]:font-semibold
[&_ol]:list-decimal [&_ol]:pl-5 md:[&_ol]:pl-6 [&_ol]:space-y-1.5 md:[&_ol]:space-y-2
[&_ul]:list-disc [&_ul]:pl-5 md:[&_ul]:pl-6 [&_ul]:space-y-1.5 md:[&_ul]:space-y-2
[&_li]:text-gray-700 [&_li]:leading-relaxed
[&_blockquote]:border-l-4 [&_blockquote]:border-orange-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:bg-orange-50 [&_blockquote]:py-2 [&_blockquote]:px-3 [&_blockquote]:rounded-md
[&_.ql-ui]:hidden
  "
                                />
                            </div>
                        </div>

                        {/* Image Gallery */}
                        <div className='bg-[#F8F5F2] rounded-2xl shadow p-6 border mt-0'>
                            <div className='flex items-center gap-2 text-base font-bold mb-4'>
                                <Image src={gallery} alt="gallery" width={24} height={24} />
                                <h3 className='text-xl'>Galeri</h3>
                            </div>
                            <div className="flex gap-2">
                                {/* Kiri */}
                                <div className="flex flex-col gap-2 flex-1">
                                    {volunteerData.img_url.slice(0, 2).map((img, idx) => (
                                        <Image
                                            key={idx}
                                            src={img}
                                            alt={`gallery-${idx}`}
                                            width={100}
                                            height={100}
                                            className="rounded-xl object-cover h-24 md:h-40 w-full border-2 border-[#4FC3F7]"
                                        />
                                    ))}
                                </div>
                                {/* Tengah (besar) */}
                                <div className="flex-1.5">
                                    {volunteerData.img_url[2] && (
                                        <Image
                                            src={volunteerData.img_url[2]}
                                            alt="gallery-2"
                                            width={100}
                                            height={100}
                                            className="rounded-xl object-cover h-52 md:h-82 w-full border-2 border-[#4FC3F7]"
                                        />
                                    )}
                                </div>
                                {/* Kanan */}
                                <div className="flex flex-col gap-2 flex-1">
                                    {volunteerData.img_url.slice(3, 5).map((img, idx) => (
                                        <Image
                                            key={idx + 3}
                                            src={img}
                                            alt={`gallery-${idx + 3}`}
                                            width={100}
                                            height={100}
                                            className="rounded-xl object-cover h-24 md:h-82 w-full border-2 border-[#4FC3F7]"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Info Card */}
                    <div className="space-y-6 lg:sticky lg:top-28 lg:self-start w-full lg:w-[400px] flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-200">
                            {/* Badge Kategori */}
                            <div className="mb-4">
                                <span className={`inline-block ${color.bg} ${color.text} text-sm font-bold px-4 py-1 rounded-full`}>
                                    {categoryName}
                                </span>
                            </div>

                            {/* Judul */}
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-4">{volunteerData.title}</h2>

                            {/* Harga */}
                            <div className='flex gap-4 mb-3'>
                                <Button className='cursor-default capitalize'>{volunteerData.payment_type}</Button>

                                {volunteerData.price > 0 && (
                                    <h3 className="text-2xl font-extrabold text-green-700 mb-4">
                                        Rp.{formatIDR(volunteerData.price)}
                                    </h3>
                                )}
                            </div>
                            {/* Box Info - Redesigned */}
                            <div className="relative border rounded-xl shadow p-4 mb-5 bg-white pb-12">
                                {/* Jadwal event */}
                                <div className="flex items-start gap-3 mb-4">
                                    <Image src={calender} alt="calender" width={20} height={20} />
                                    <div className='flex flex-col gap-1'>
                                        <div className="text-base text-gray-500 font-medium mb-0.5">Jadwal event</div>
                                        <div className="text-base font-semibold text-gray-600">
                                            {volunteerData.last_registration ? formatDateIndo(volunteerData.last_registration) : '-'}
                                        </div>
                                        <div className="text-base text-gray-600">
                                            Pukul: {volunteerData.start_time ? formatTimeOnly(volunteerData.start_time) : '-'} - {volunteerData.last_time ? formatTimeOnly(volunteerData.last_time) : '-'}
                                        </div>
                                    </div>
                                </div>
                                {/* Lokasi */}
                                <div className="flex items-start gap-3 mb-4">
                                    <Image src={location} alt="location" width={20} height={20} />
                                    <div className='flex flex-col gap-1'>
                                        <div className="text-base text-gray-500 font-medium mb-0.5">Lokasi</div>
                                        <div className="text-base font-semibold text-gray-600">{volunteerData.location}</div>
                                    </div>
                                </div>

                                {/* Registration Deadline Bar */}
                                <div className="absolute left-0 right-0 bottom-0 rounded-t-xl bg-[#FFF3E0] border-t border-orange-200 px-3 py-3 flex items-center gap-2">
                                    <CircleAlert className="w-4 h-4 text-red-600" />
                                    <span className="text-sm text-gray-600 font-medium">
                                        Batas registrasi: {volunteerData.last_registration ? formatDateIndo(volunteerData.last_registration) : '-'}
                                    </span>
                                </div>
                            </div>
                            <Link href={volunteerData.form_link} target="_blank">
                                <Button className="w-full bg-[#F59E42] hover:bg-[#e88a1a] text-white font-bold rounded-lg py-3 text-base mt-2 shadow">Siap Mengabdi!</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
