import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

import { TableRow, TableCell } from "@/components/ui/table"

export default function ProductsSkelaton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                    <TableCell>
                        <Skeleton className="w-16 h-16 rounded-md" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-12 rounded-xl" />
                            <Skeleton className="h-8 w-12 rounded-xl" />
                            <Skeleton className="h-8 w-12 rounded-xl" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    )
}
