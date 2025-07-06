import React from 'react'

import { ChevronRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Skeleton } from '@/components/ui/skeleton'

import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'

export default function KakasakutransactionSkelaton() {
    return (
        <section>
            {/* Header Skeleton */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border rounded-2xl border-border bg-card shadow-sm gap-4'>
                <div className='flex flex-col gap-3'>
                    <Skeleton className="h-8 w-80" />
                    <ol className='flex gap-2 items-center text-sm text-muted-foreground'>
                        <li className='flex items-center'>
                            <Skeleton className="h-4 w-20" />
                            <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
                        </li>
                        <li className='flex items-center'>
                            <Skeleton className="h-4 w-40" />
                        </li>
                    </ol>
                </div>
            </div>

            {/* Filters and Search Skeleton */}
            <div className="mt-6 flex flex-wrap md:flex-row gap-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-40" />
            </div>

            {/* Transactions Table Skeleton */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>
                        <Skeleton className="h-6 w-64" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Mobile/Tablet View - Cards Skeleton */}
                    <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Card key={index} className="p-4">
                                <div className="space-y-4">
                                    {/* Header with Avatar and Name */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="w-10 h-10 rounded-full" />
                                            <div>
                                                <Skeleton className="h-4 w-24 mb-1" />
                                                <Skeleton className="h-3 w-32" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-6 w-16" />
                                    </div>

                                    {/* Transaction Details */}
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <Skeleton className="h-3 w-16 mb-1" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                        <div>
                                            <Skeleton className="h-3 w-16 mb-1" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                        <div>
                                            <Skeleton className="h-3 w-16 mb-1" />
                                            <Skeleton className="h-4 w-28" />
                                        </div>
                                        <div>
                                            <Skeleton className="h-3 w-16 mb-1" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                        <div className="col-span-2">
                                            <Skeleton className="h-3 w-16 mb-1" />
                                            <Skeleton className="w-full aspect-video rounded-md" />
                                        </div>
                                        <div className="col-span-2">
                                            <Skeleton className="h-3 w-16 mb-1" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2 border-t">
                                        <Skeleton className="h-8 flex-1" />
                                        <Skeleton className="h-8 flex-1" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Desktop View - Table Skeleton (XL and above) */}
                    <div className="hidden xl:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-3 font-semibold">
                                        <Skeleton className="h-4 w-16" />
                                    </th>
                                    <th className="text-left p-3 font-semibold">
                                        <Skeleton className="h-4 w-20" />
                                    </th>
                                    <th className="text-left p-3 font-semibold">
                                        <Skeleton className="h-4 w-20" />
                                    </th>
                                    <th className="text-left p-3 font-semibold">
                                        <Skeleton className="h-4 w-16" />
                                    </th>
                                    <th className="text-left p-3 font-semibold">
                                        <Skeleton className="h-4 w-16" />
                                    </th>
                                    <th className="text-left p-3 font-semibold">
                                        <Skeleton className="h-4 w-16" />
                                    </th>
                                    <th className="text-left p-3 font-semibold">
                                        <Skeleton className="h-4 w-20" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="p-3">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="w-8 h-8 rounded-full" />
                                                <div>
                                                    <Skeleton className="h-4 w-24 mb-1" />
                                                    <Skeleton className="h-3 w-32" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <Skeleton className="h-4 w-32" />
                                        </td>
                                        <td className="p-3">
                                            <Skeleton className="h-4 w-28" />
                                        </td>
                                        <td className="p-3">
                                            <Skeleton className="h-4 w-24" />
                                        </td>
                                        <td className="p-3">
                                            <Skeleton className="h-6 w-16" />
                                        </td>
                                        <td className="p-3">
                                            <Skeleton className="h-4 w-32" />
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-2">
                                                <Skeleton className="h-8 w-16" />
                                                <Skeleton className="h-8 w-16" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Pagination Skeleton */}
            <div className="mt-6 flex justify-center">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <Skeleton className="h-10 w-10" />
                        </PaginationItem>
                        <PaginationItem>
                            <Skeleton className="h-10 w-10" />
                        </PaginationItem>
                        <PaginationItem>
                            <Skeleton className="h-10 w-10" />
                        </PaginationItem>
                        <PaginationItem>
                            <Skeleton className="h-10 w-10" />
                        </PaginationItem>
                        <PaginationItem>
                            <Skeleton className="h-10 w-10" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </section>
    )
}
