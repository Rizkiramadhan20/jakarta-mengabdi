import React from 'react'

import { Card } from '@/components/ui/card'

import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardSkeleton() {
    return (
        <section className='pb-10'>
            {/* Transaction Statistics Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="bg-white p-4 sm:p-6 rounded-xl border border-gray-300">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <Skeleton className="h-5 w-32" />
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Skeleton className="w-5 h-5 sm:w-6 sm:h-6 rounded" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                            {Array.from({ length: 3 }).map((_, statIdx) => (
                                <div key={statIdx} className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                    <Skeleton className="h-3 w-20 mb-1" />
                                    <Skeleton className="h-6 w-24" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Transactions Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Recent Donasi Transactions Skeleton */}
                <div className="bg-white rounded-xl border border-gray-300 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Skeleton className="w-5 h-5 rounded" />
                        <Skeleton className="h-6 w-64" />
                    </div>
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                    <div>
                                        <Skeleton className="h-4 w-24 mb-1" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Skeleton className="h-4 w-20 mb-1" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Kakasaku Transactions Skeleton */}
                <div className="bg-white rounded-xl border border-gray-300 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Skeleton className="w-5 h-5 rounded" />
                        <Skeleton className="h-6 w-64" />
                    </div>
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                    <div>
                                        <Skeleton className="h-4 w-24 mb-1" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Skeleton className="h-4 w-20 mb-1" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Kakasaku Data Cards Skeleton */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="w-5 h-5 rounded" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <Card key={idx} className="hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <Skeleton className="h-5 w-32 mb-2" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                                <div className="mb-4">
                                    <Skeleton className="w-full aspect-[16/9] rounded-lg" />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-3 w-12" />
                                        </div>
                                        <Skeleton className="w-full h-2 rounded-full" />
                                    </div>
                                    <div className="pt-2 border-t border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Donations Data Cards Skeleton */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="w-5 h-5 rounded" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <Card key={idx} className="hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <Skeleton className="h-5 w-32 mb-2" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                                <div className="mb-4">
                                    <Skeleton className="w-full aspect-[16/9] rounded-lg" />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-3 w-12" />
                                        </div>
                                        <Skeleton className="w-full h-2 rounded-full" />
                                    </div>
                                    <div className="pt-2 border-t border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
