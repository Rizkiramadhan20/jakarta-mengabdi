import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function AccountsSkeleton() {
    return (
        <section className="space-y-6">
            {/* Header Skeleton */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border rounded-2xl border-border bg-card shadow-sm gap-4'>
                <div className='flex flex-col gap-3'>
                    <Skeleton className="h-8 w-64" />
                    <div className='flex gap-2 items-center'>
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, idx) => (
                    <Card key={idx}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-12 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <div className="relative mt-2">
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Card View Skeleton for mobile/tablet */}
                    <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <Card key={idx} className="p-4">
                                <div className="flex items-start gap-3">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="flex-1 min-w-0">
                                        <Skeleton className="h-4 w-32 mb-1" />
                                        <Skeleton className="h-3 w-40 mb-2" />
                                        <div className="flex items-center gap-2 mb-1">
                                            <Skeleton className="h-3 w-3" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Skeleton className="h-3 w-3" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Skeleton className="h-5 w-12 rounded-full" />
                                            <Skeleton className="h-6 w-6 rounded" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Table View Skeleton for desktop */}
                    <div className="hidden xl:block overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                                    <TableHead><Skeleton className="h-4 w-12" /></TableHead>
                                    <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                                    <TableHead><Skeleton className="h-4 w-14" /></TableHead>
                                    <TableHead><Skeleton className="h-4 w-12" /></TableHead>
                                    <TableHead className="text-right"><Skeleton className="h-4 w-8 ml-auto" /></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.from({ length: 8 }).map((_, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-10 w-10 rounded-full" />
                                                <div>
                                                    <Skeleton className="h-4 w-32 mb-1" />
                                                    <Skeleton className="h-3 w-20" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-4 w-4" />
                                                <Skeleton className="h-4 w-32" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-4 w-4" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-4 w-4" />
                                                <Skeleton className="h-4 w-20" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-12 rounded-full" />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Skeleton className="h-8 w-8 rounded" />
                                                <Skeleton className="h-8 w-8 rounded" />
                                                <Skeleton className="h-8 w-8 rounded" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
