"use client"

import React from 'react'

import { formatDateIndo } from '@/base/helper/FormatDate';

import Image from 'next/image';

import location from "@/base/assets/locations.png"

import calender from "@/base/assets/calender.png"

import { Button } from '@/components/ui/button';

import Link from 'next/link';

import { Volunteer } from '@/interface/volunteer'

import vector from "@/base/assets/Group.png"

import { Card, CardContent } from '@/components/ui/card';

import ValunteerHeading from './ValunteerHeading';

import { Loader2 } from 'lucide-react';

import { useRouter } from 'next/navigation';

interface VolunterContentProps {
    volunterData: Volunteer[];
}

export default function VolunteerLayout({ volunterData }: VolunterContentProps) {
    // Badge color mapping
    const categoryBadgeColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'pilar cerdas':
                return 'bg-yellow-400 text-white';
            case 'pilar sehat':
                return 'bg-sky-400 text-white';
            case 'pilar lestari':
                return 'bg-green-400 text-white';
            case 'pilar peduli':
                return 'bg-pink-300 text-white';
            default:
                return 'bg-gray-300 text-black';
        }
    };
    const sessionTypeBadgeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'onsite':
                return 'bg-[#4B3A1D] text-white'; // Coklat tua
            case 'online':
                return 'bg-[#F5F1DE] text-[#4B3A1D]'; // Krem dengan teks coklat tua
            default:
                return 'bg-gray-300 text-black';
        }
    };

    // Category filter state
    const [selectedCategory, setSelectedCategory] = React.useState<string | 'all'>('all');
    // Location filter state
    const [selectedLocation, setSelectedLocation] = React.useState<string | 'all'>('all');
    // Sort order state
    const [sortOrder, setSortOrder] = React.useState<'desc' | 'asc' | 'all'>('all'); // desc: terbaru, asc: terlama, all: semua
    // Jakarta regions for filtering
    const jakartaRegions = [
        'Jakarta Utara',
        'Jakarta Selatan',
        'Jakarta Timur',
        'Jakarta Barat',
        'Jakarta Pusat',
    ];

    // Helper function to extract Jakarta region from location string
    const extractJakartaRegion = (location: string) => {
        const locationLower = location.toLowerCase();
        for (const region of jakartaRegions) {
            if (locationLower.includes(region.toLowerCase())) {
                return region;
            }
        }
        return null;
    };

    // Extract unique Jakarta regions from locations
    const locations = React.useMemo(() => {
        const regions = volunterData
            .map(v => extractJakartaRegion(v.location))
            .filter(region => region !== null);
        const unique = Array.from(new Set(regions));
        return unique;
    }, [volunterData]);
    // Filtered data
    const filteredData = React.useMemo(() => {
        let data = volunterData;
        if (selectedCategory !== 'all') {
            data = data.filter(v => v.category && v.category.toLowerCase() === selectedCategory.toLowerCase());
        }
        if (selectedLocation !== 'all') {
            data = data.filter(v => {
                const region = extractJakartaRegion(v.location);
                return region === selectedLocation;
            });
        }
        // Sort by time
        if (sortOrder === 'desc' || sortOrder === 'asc') {
            data = [...data].sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
            });
        }
        return data;
    }, [volunterData, selectedCategory, selectedLocation, sortOrder]);

    // Helper function to get the Jakarta region from a location string
    const getLastLocationPart = (location: string) => {
        return extractJakartaRegion(location) || location;
    };

    // Loading state for button
    const [loadingButton, setLoadingButton] = React.useState<string | null>(null);
    const router = useRouter();

    return (
        <>
            <ValunteerHeading
                locations={locations}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                getLastLocationPart={getLastLocationPart}
            />
            <section className='pt-28 pb-10'>
                <div className='container px-4 md:px-14'>
                    {/*  */}
                    {filteredData && filteredData.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20">
                            {/* SVG Ilustrasi Kosong */}
                            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="60" cy="60" r="56" stroke="#FF9800" strokeWidth="4" fill="#FFF3E0" />
                                <path d="M40 70c0-11 9-20 20-20s20 9 20 20" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" fill="none" />
                                <circle cx="50" cy="55" r="3" fill="#FF9800" />
                                <circle cx="70" cy="55" r="3" fill="#FF9800" />
                                <path d="M50 80c2.5 2 7.5 2 10 0" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" fill="none" />
                            </svg>
                            <p className="mt-6 text-lg text-orange-500 font-semibold text-center">Data relawan tidak ditemukan.<br />Coba ubah filter atau lokasi.</p>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10'>
                            {filteredData.map((item, idx) => {
                                const formattedDate = formatDateIndo(item.date);
                                const isLoading = loadingButton === item.slug;
                                return (
                                    <Card key={idx} className='relative flex flex-col gap-4 p-0 group mb-10'>
                                        <CardContent className='flex flex-col gap-4 p-0'>
                                            <div className='relative w-full aspect-[6/4] bg-gray-100 flex items-center justify-center overflow-hidden'>
                                                <Image src={item.img_url[0] || '/placeholder.png'} className='object-cover transition-transform duration-300 group-hover:scale-105' alt={item.title} quality={100} loading="eager" fill />
                                            </div>

                                            <div className='absolute -top-16 -left-10'>
                                                <Image src={vector} alt='vector' />
                                            </div>

                                            {/* Badges */}
                                            <div className='flex flex-col py-4 px-4 space-y-6'>
                                                <div className='flex gap-2'>
                                                    <span className={`px-4 py-1 rounded-full text-sm font-semibold ${categoryBadgeColor(item.category)}`}>{item.category}</span>
                                                    <span className={`px-4 py-1 rounded-full text-sm font-semibold ${sessionTypeBadgeColor(item.session_type)}`}>{item.session_type}</span>
                                                </div>

                                                <div className='flex flex-col gap-3'>
                                                    <h2 className='font-bold text-lg'>{item.title}</h2>

                                                    <div className='flex items-center gap-2'>
                                                        <Image src={location} width={22} height={22} alt='location' />
                                                        <span className='text-base'>{item.location}</span>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <Image src={calender} width={22} height={22} alt='calendar' />
                                                        <span className='text-base'>{formattedDate}</span>
                                                    </div>
                                                </div>

                                                <Button
                                                    className='w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold h-12 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed'
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        setLoadingButton(item.slug);
                                                        router.push(`/volunteer/${item.slug}`);
                                                    }}
                                                    disabled={!!loadingButton && !isLoading}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            Berpindah halaman...
                                                        </>
                                                    ) : (
                                                        'Daftar Sekarang'
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
