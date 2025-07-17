import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

export default function CategorySkelaton() {
    return (
        <div className="overflow-x-auto rounded-xl border border-border bg-card stacked-table-container">
            <Table className="min-w-[600px] md:table-auto stacked-table">
                <TableHeader>
                    <TableRow className="bg-gray-100 hover:bg-gray-100">
                        <TableHead className="w-12 font-bold text-gray-700 px-4 py-3">No</TableHead>
                        <TableHead className="font-bold text-gray-700 px-4 py-3">Gambar</TableHead>
                        <TableHead className="font-bold text-gray-700 px-4 py-3">Nama Kategori</TableHead>
                        <TableHead className="font-bold text-gray-700 px-4 py-3">Tanggal Dibuat</TableHead>
                        <TableHead className="w-40 font-bold text-gray-700 px-4 py-3">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 10 }).map((_, index) => (
                        <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="px-4 py-2" data-label="No">
                                <Skeleton className="h-5 w-5" />
                            </TableCell>
                            <TableCell className="px-4 py-2" data-label="Gambar">
                                <Skeleton className="h-16 w-16 rounded-md" />
                            </TableCell>
                            <TableCell className="px-4 py-2" data-label="Nama Kategori">
                                <Skeleton className="h-5 w-32" />
                            </TableCell>
                            <TableCell className="px-4 py-2" data-label="Tanggal Dibuat">
                                <Skeleton className="h-5 w-24" />
                            </TableCell>
                            <TableCell className="px-4 py-2" data-label="Aksi">
                                <div className="flex flex-row gap-2">
                                    <Skeleton className="h-9 w-[70px] rounded-md" />
                                    <Skeleton className="h-9 w-[70px] rounded-md" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
