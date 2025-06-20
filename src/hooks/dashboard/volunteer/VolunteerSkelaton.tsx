import React from 'react'

import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card'

import { Skeleton } from '@/components/ui/skeleton'

export default function VolunteerSkelaton() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, idx) => (
                <Card
                    key={idx}
                    className="relative p-0 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-sm"
                >
                    <CardHeader className="relative p-0 flex flex-col items-stretch">
                        <div className="relative w-full aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                            {/* Badge Kategori Skeleton */}
                            <Skeleton className="absolute top-3 left-3 h-6 w-20 rounded-full z-10" />
                            <Skeleton className="object-cover w-full h-full rounded-t-xl" style={{ aspectRatio: '4/3' }} />
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 p-5 pt-0">
                        <CardTitle className="text-lg font-bold text-gray-900 truncate max-w-full leading-tight mb-1">
                            <Skeleton className="h-6 w-3/4" />
                        </CardTitle>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-700 mb-1">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-4 w-28" />
                    </CardContent>
                    <CardFooter className="flex flex-row gap-2 mt-2 px-5 pb-4">
                        <Skeleton className="h-8 w-full rounded-md flex-1 min-w-[80px]" />
                        <Skeleton className="h-8 w-full rounded-md flex-1 min-w-[80px]" />
                        <Skeleton className="h-8 w-full rounded-md flex-1 min-w-[80px]" />
                    </CardFooter>
                </Card>
            ))}
        </>
    )
}
