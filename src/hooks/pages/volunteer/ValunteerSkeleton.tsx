import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

export default function ValunteerSkeleton() {
    return (
        <>
            {/* Heading Skeleton */}
            <section className="pt-32 pb-12 md:pt-40 md:pb-16">
                <div className="container mx-auto px-2 md:px-8 flex flex-col items-center text-center">
                    <Skeleton className="h-10 w-80 md:w-96 mb-6 md:mb-10" />
                    <Skeleton className="h-6 w-64 md:w-2/3 mb-6 md:mb-8" />
                    <div className="w-full flex flex-col md:flex-row justify-center items-center gap-10 mt-8 md:mt-24">
                        <Skeleton className="h-12 w-40 md:w-56 rounded-full" />
                        <Skeleton className="h-12 w-40 md:w-56 rounded-full" />
                        <Skeleton className="h-12 w-40 md:w-56 rounded-full" />
                    </div>
                </div>
            </section>

            {/* Card Grid Skeleton */}
            <section className="pt-10 pb-10">
                <div className="container px-4 md:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <div key={idx} className="relative flex flex-col gap-4 p-0 group mb-10 bg-white/95 rounded-2xl border border-gray-100 overflow-hidden">
                                <div className="flex flex-col gap-4 p-0">
                                    <div className="relative w-full aspect-[6/4] bg-gray-100 flex items-center justify-center overflow-hidden">
                                        <Skeleton className="w-full h-full" style={{ aspectRatio: '6/4' }} />
                                    </div>
                                    <div className="absolute -top-16 -left-10">
                                        <Skeleton className="w-24 h-24 rounded-full" />
                                    </div>
                                    <div className="flex flex-col py-4 px-4 space-y-6">
                                        <div className="flex gap-2">
                                            <Skeleton className="px-4 py-1 h-6 w-24 rounded-full" />
                                            <Skeleton className="px-4 py-1 h-6 w-24 rounded-full" />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Skeleton className="h-6 w-32 mb-2" />
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="w-6 h-6 rounded-full" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="w-6 h-6 rounded-full" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                        </div>
                                        <Skeleton className="w-full h-12 rounded-lg mt-4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
