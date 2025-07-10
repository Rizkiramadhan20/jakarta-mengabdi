import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function KakasakutransactionSkelaton() {
    // Show 5 skeleton items for both card and table views
    const skeletonItems = Array.from({ length: 5 })

    return (
        <>
            {/* Mobile/Tablet View - Cards */}
            <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                {skeletonItems.map((_, idx) => (
                    <div key={idx} className="p-4 border rounded-xl bg-muted animate-pulse space-y-4">
                        {/* Header with Avatar and Name */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-10 h-10" />
                                <div>
                                    <Skeleton className="h-4 w-24 mb-2" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        {/* Transaction Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <Skeleton className="h-3 w-20 mb-1" />
                                <Skeleton className="h-4 w-28" />
                            </div>
                            <div>
                                <Skeleton className="h-3 w-20 mb-1" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <div>
                                <Skeleton className="h-3 w-20 mb-1" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div>
                                <Skeleton className="h-3 w-20 mb-1" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <div className="col-span-2">
                                <Skeleton className="h-3 w-20 mb-1" />
                                <Skeleton className="w-full aspect-video" />
                            </div>
                            <div className="col-span-2">
                                <Skeleton className="h-3 w-20 mb-1" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t">
                            <Skeleton className="h-8 w-20 rounded" />
                            <Skeleton className="h-8 w-20 rounded" />
                            <Skeleton className="h-8 w-20 rounded" />
                        </div>
                    </div>
                ))}
            </div>
            {/* Desktop View - Table */}
            <div className="hidden xl:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-3 font-semibold">Donatur</th>
                            <th className="text-left p-3 font-semibold">Kaka Saku</th>
                            <th className="text-left p-3 font-semibold">Order ID</th>
                            <th className="text-left p-3 font-semibold">Amount</th>
                            <th className="text-left p-3 font-semibold">Status</th>
                            <th className="text-left p-3 font-semibold">Date</th>
                            <th className="text-left p-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {skeletonItems.map((_, idx) => (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="w-8 h-8" />
                                        <div>
                                            <Skeleton className="h-4 w-20 mb-2" />
                                            <Skeleton className="h-3 w-28" />
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <Skeleton className="h-4 w-24" />
                                </td>
                                <td className="p-3">
                                    <Skeleton className="h-4 w-32" />
                                </td>
                                <td className="p-3">
                                    <Skeleton className="h-4 w-16" />
                                </td>
                                <td className="p-3">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </td>
                                <td className="p-3">
                                    <Skeleton className="h-4 w-24" />
                                </td>
                                <td className="p-3">
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-20 rounded" />
                                        <Skeleton className="h-8 w-20 rounded" />
                                        <Skeleton className="h-8 w-20 rounded" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
