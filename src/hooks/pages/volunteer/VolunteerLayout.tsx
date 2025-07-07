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

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    // Extract unique categories
    const categories = React.useMemo(() => {
        const unique = Array.from(new Set(volunterData.map(v => v.category)));
        return unique;
    }, [volunterData]);
    // Extract unique locations
    const locations = React.useMemo(() => {
        const unique = Array.from(new Set(volunterData.map(v => v.location)));
        return unique;
    }, [volunterData]);
    // Filtered data
    const filteredData = React.useMemo(() => {
        let data = volunterData;
        if (selectedCategory !== 'all') {
            data = data.filter(v => v.category === selectedCategory);
        }
        if (selectedLocation !== 'all') {
            data = data.filter(v => v.location === selectedLocation);
        }
        return data;
    }, [volunterData, selectedCategory, selectedLocation]);

    return (
        <section className='pt-32 py-10'>
            <div className='container px-4 md:px-8'>
                {/* Filter Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full">
                    {/* Filter Pilar (Category) */}
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="flex items-center gap-2 bg-gray-300 px-8 py-6 sm:py-10 rounded-none text-lg font-medium w-full capitalize">
                            {/* Icon bintang/kompas sederhana */}
                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" /></svg>
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Pilar</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat} className='capitalize'>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {/* Filter Urutkan */}
                    <button className="flex items-center gap-2 bg-gray-300 px-8 py-4 rounded-none text-lg font-medium w-full">
                        {/* Icon filter/urutkan */}
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 6h18M7 12h10M11 18h6" /></svg>
                        Urutkan
                    </button>
                    {/* Filter Location */}
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger className="flex items-center gap-2 bg-gray-300 px-8 py-4 sm:py-10 rounded-none text-lg font-medium w-full h-14">
                            {/* Icon location */}
                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="10" r="3" /><path d="M12 2C7.03 2 3 6.03 3 11c0 5.25 7.5 11 9 11s9-5.75 9-11c0-4.97-4.03-9-9-9z" /></svg>
                            <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Lokasi</SelectItem>
                            {locations.map((loc) => (
                                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/*  */}
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10'>
                    {
                        filteredData.map((item, idx) => {
                            const formattedDate = formatDateIndo(item.time);
                            return (
                                <Card key={idx} className='relative flex flex-col gap-4 p-0 group mb-10'>
                                    <CardContent className='flex flex-col gap-4 p-0'>
                                        <div className='relative w-full aspect-[6/4] bg-gray-100 flex items-center justify-center overflow-hidden'>
                                            <Image src={item.img_url} className='object-cover transition-transform duration-300 group-hover:scale-105' alt={item.title} quality={100} loading="eager" fill />
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

                                            <Link href={item.slug} className='mt-auto'>
                                                <Button className='w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold h-12 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]'>
                                                    Daftar Sekarang
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}
