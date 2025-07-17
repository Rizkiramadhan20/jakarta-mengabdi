"use client"

import React, { useState } from 'react'

import { Donasi } from "@/interface/donasi"

import Image from 'next/image'

import logo from "@/base/assets/Ellipse.png"

import { BadgeCheck, Loader2 } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Progress } from '@/components/ui/progress'

import { formatIDR } from '@/base/helper/FormatPrice'

import { Button } from '@/components/ui/button'

import { useRouter } from 'next/navigation'

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination'

export default function DonasiLayout({ donasiData }: { donasiData: Donasi[] }) {
    const ITEMS_PER_PAGE = 8;
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const [loadingButton, setLoadingButton] = useState<string | null>(null);

    // Sort data: open status first, then others
    const sortedData = [...donasiData].sort((a, b) => {
        if (a.status.toLowerCase() === 'open' && b.status.toLowerCase() !== 'open') {
            return -1; // a comes first
        }
        if (a.status.toLowerCase() !== 'open' && b.status.toLowerCase() === 'open') {
            return 1; // b comes first
        }
        return 0; // keep original order for same status
    });

    const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

    const paginatedData = sortedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleButtonClick = (slug: string) => {
        setLoadingButton(slug);
        // Navigate to the donation detail page immediately
        router.push(`/donasi/${slug}`);
    };

    return (
        <section className='py-10'>
            <div className="container px-4 md:px-14">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Jakarta Mengabdi Berdonasi</h2>
                <div className="w-24 h-1 bg-orange-400 rounded mb-8"></div>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {
                        paginatedData.map((item, idx) => {
                            const progress = (item.current_amount / item.target_amount) * 100
                            const isLoading = loadingButton === item.slug;
                            return (
                                <Card key={idx} className="group overflow-hidden border-0 transition-all duration-300 bg-white rounded-xl p-0 pb-6">
                                    <CardHeader className="p-0 relative">
                                        <div className="aspect-[4/3] relative overflow-hidden">
                                            <Image
                                                src={item.image_url || ''}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            {/* Status Badge */}
                                            <div className="absolute bottom-3 right-3">
                                                <span className={`px-3 py-1 text-md font-semibold text-white rounded-full shadow-md ${item.status.toLowerCase() === 'open'
                                                    ? 'bg-orange-500'
                                                    : 'bg-red-600'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            {/* Deadline Badge */}
                                            <div className="absolute bottom-3 left-3">
                                                <span className="px-3 py-1 text-md font-semibold text-white bg-black/70 rounded-full shadow-md">
                                                    {item.deadline}
                                                </span>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="flex flex-col space-y-4">
                                        <CardTitle className="text-xl font-semibold text-gray-900 leading-tight group-hover:text-orange-500 transition-colors duration-200">
                                            {item.title}
                                        </CardTitle>

                                        <div className='flex flex-col space-y-4'>
                                            <Progress value={progress} className="h-2" />
                                            <div className='flex items-center gap-1'>
                                                <span className='text-sm text-orange-500 font-semibold'>Rp{formatIDR(item.current_amount)}</span>
                                                <span className='text-sm text-gray-500'>terkumpul dari</span>
                                                <span className='text-sm text-gray-500'>Rp{formatIDR(item.target_amount)}</span>
                                            </div>
                                        </div>

                                        <div className='flex items-center gap-3'>
                                            <div className="flex items-center gap-2">
                                                <Image src={logo} alt={item.title} quality={100} className="w-8 h-8 rounded-full border-2 border-gray-200" />
                                                <span className="text-sm font-medium text-gray-700">Jakarta Mengabdi</span>
                                            </div>
                                            <BadgeCheck className='w-5 h-5 text-blue-500 flex-shrink-0' />
                                        </div>

                                        <Button
                                            className='w-full bg-orange-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed'
                                            onClick={() => handleButtonClick(item.slug)}
                                            disabled={!!loadingButton && !isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Berpindah halaman...
                                                </>
                                            ) : (
                                                'Donasi'
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )
                        })
                    }
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={e => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                                        aria-disabled={currentPage === 1}
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }).map((_, idx) => (
                                    <PaginationItem key={idx}>
                                        <PaginationLink
                                            href="#"
                                            isActive={currentPage === idx + 1}
                                            onClick={e => { e.preventDefault(); handlePageChange(idx + 1); }}
                                        >
                                            {idx + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={e => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                                        aria-disabled={currentPage === totalPages}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </section>
    )
}
