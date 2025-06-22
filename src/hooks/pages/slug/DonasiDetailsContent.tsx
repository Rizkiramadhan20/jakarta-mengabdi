"use client"

import { KakaSaku } from '@/interface/kakaSaku'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { Progress } from '@/components/ui/progress';

import { Separator } from '@/components/ui/separator';

import Image from 'next/image';

import { useState, useMemo } from 'react';

interface DonasiDetailsContentProps {
    kakaSakuData: KakaSaku | null;
}

const recentDonors = [
    { name: "Andorra kumargi", amount: "Rp 50.000" },
    { name: "Siti Aisyah", amount: "Rp 100.000" },
    { name: "Budi Santoso", amount: "Rp 25.000" },
];

export default function DonasiDetailsContent({ kakaSakuData }: DonasiDetailsContentProps) {
    // Get unique timeline types for filter options (excluding 'all')
    const timelineTypes = useMemo(() => {
        const types = kakaSakuData?.timeline?.map(item => item.type) || [];
        return Array.from(new Set(types));
    }, [kakaSakuData?.timeline]);

    const [selectedType, setSelectedType] = useState<string>(timelineTypes[0] || '');

    if (!kakaSakuData) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Data Tidak Ditemukan</h1>
                    <p className="text-gray-600">KakaSaku yang Anda cari tidak ditemukan.</p>
                </div>
            </div>
        );
    }

    const daysLeft = kakaSakuData.deadline ? Math.ceil((new Date(kakaSakuData.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 30;
    const progress = (kakaSakuData.current_amount / kakaSakuData.target_amount) * 100;

    // Filter timeline based on selected type
    const filteredTimeline = useMemo(() => {
        if (!selectedType) {
            return kakaSakuData.timeline;
        }
        return kakaSakuData.timeline.filter(item => item.type === selectedType);
    }, [kakaSakuData.timeline, selectedType]);

    return (
        <section className="py-28">
            <div className="container px-4 md:px-8">
                <div className="text-sm text-gray-500 mb-4">
                    Beranda &gt; Donasi &gt; {kakaSakuData.title}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 flex flex-col space-y-4">
                        {kakaSakuData.image_url && (
                            <Image
                                src={Array.isArray(kakaSakuData.image_url) ? kakaSakuData.image_url[0] : kakaSakuData.image_url}
                                alt={kakaSakuData.title}
                                className="w-full h-auto object-cover rounded-lg mb-6"
                                width={1000}
                                height={1000}
                            />
                        )}
                        <h1 className="text-3xl font-bold text-gray-800">Yuk Jadi Kakak Saku! Tabung Kebaikan, Tebar Manfaat ✨</h1>

                        {/* Timeline Filter */}
                        <div className="mt-6">
                            <div className="flex justify-between items-center gap-2 p-6 border-2 border-orange-400 rounded-lg bg-white z-50 relative">
                                {timelineTypes.map((type) => (
                                    <div
                                        key={type}
                                        onClick={() => setSelectedType(selectedType === type ? '' : type)}
                                        className={`${selectedType === type ? "font-bold" : ""} text-md cursor-pointer`}
                                    >
                                        {type}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Timeline Display */}
                        <div className="flex justify-between items-center -mt-6 z-10 relative">
                            {filteredTimeline.length > 0 ? (
                                filteredTimeline.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        {item.image_url && (
                                            <Image
                                                src={item.image_url}
                                                alt={item.type}
                                                width={1000}
                                                height={1000}
                                                className="object-cover rounded"
                                            />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-4">
                                    Tidak ada timeline untuk tipe yang dipilih
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Donasi Terkumpul</CardTitle>
                                <CardDescription className="text-2xl font-bold text-orange-500">Rp{kakaSakuData.current_amount.toLocaleString('id-ID')}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Progress value={progress} className="h-2" />
                                <div className="flex justify-between text-sm text-gray-600 mt-2">
                                    <span>Target: Rp{kakaSakuData.target_amount.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-around text-center mt-4">
                                    <div>
                                        <p className="font-bold text-lg">100</p>
                                        <p className="text-xs text-gray-500">Kakak Saku</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">10</p>
                                        <p className="text-xs text-gray-500">Adik Binaan</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{daysLeft}</p>
                                        <p className="text-xs text-gray-500">Hari Lagi</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-2">
                                <Button className="w-full bg-orange-500 hover:bg-orange-600">Jadi Kakak Saku</Button>
                                <Button variant="outline" className="w-full">Ringkasan</Button>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Dukungan dari Kakak Saku</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recentDonors.map((donor, index) => (
                                    <div key={index}>
                                        <div className="flex items-center gap-4 py-2">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                                {donor.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{donor.name}</p>
                                                <p className="text-sm text-gray-500">Ikut donasi {donor.amount}</p>
                                            </div>
                                        </div>
                                        {index < recentDonors.length - 1 && <Separator />}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
