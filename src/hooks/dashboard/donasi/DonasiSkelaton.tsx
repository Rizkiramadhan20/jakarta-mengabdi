import React from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function DonasiSkelaton() {
    return (
        <>
            {Array.from({ length: 8 }).map((_, idx) => (
                <Card
                    key={idx}
                    className="relative p-0 bg-white/95 rounded-2xl border border-gray-100 transition-all duration-300 flex flex-col overflow-hidden"
                >
                    <div className="flex flex-col h-full">
                        <div className="relative w-full aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                            {/* Badge Status Skeleton */}
                            <Skeleton className="absolute top-2 left-2 px-3 py-1.5 h-6 w-20 rounded-full z-10" />
                            <Skeleton className="object-cover w-full h-full" style={{ aspectRatio: '4/3' }} />
                        </div>
                        <div className="flex-1 flex flex-col gap-2 p-4">
                            <Skeleton className="h-5 w-1/2 mb-2" />
                            <div className="flex flex-wrap gap-2 text-sm mb-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-4 w-24" />
                            <div className="flex flex-row gap-2 mt-3">
                                <Skeleton className="h-8 w-full rounded-md flex-1 min-w-[80px]" />
                                <Skeleton className="h-8 w-full rounded-md flex-1 min-w-[80px]" />
                                <Skeleton className="h-8 w-full rounded-md flex-1 min-w-[80px]" />
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </>
    )
}
