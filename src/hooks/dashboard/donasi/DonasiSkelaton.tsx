import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

export default function DonasiSkeleton() {
    return (
        <>
            {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="relative p-0 bg-white/95 rounded-2xl border border-gray-100 flex flex-col overflow-hidden shadow-sm">
                    <div className="flex flex-col h-full">
                        <div className="relative w-full aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                            <div className="absolute top-2 right-2 flex flex-col items-end gap-2 z-10">
                                <Skeleton className="w-16 h-5 rounded-md" />
                                <Skeleton className="w-24 h-5 rounded-md" />
                            </div>
                            <Skeleton className="w-full h-full" />
                        </div>
                        <div className="flex-1 flex flex-col gap-3 p-4">
                            <Skeleton className="h-5 w-4/5 rounded-lg" />

                            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-1">
                                <div className="flex flex-col gap-1">
                                    <Skeleton className="h-3 w-12" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Skeleton className="h-3 w-10" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Skeleton className="h-3 w-12" />
                                    <Skeleton className="h-4 w-8" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Skeleton className="h-3 w-10" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </div>

                            <div className="mt-2">
                                <Skeleton className="w-full h-2 rounded-full" />
                                <div className="flex justify-between mt-1.5">
                                    <Skeleton className="h-3 w-16 rounded-full" />
                                </div>
                            </div>

                            <div className="flex flex-row gap-2 mt-auto pt-3">
                                <Skeleton className="h-9 w-full rounded-md" />
                                <Skeleton className="h-9 w-full rounded-md" />
                                <Skeleton className="h-9 w-full rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}
