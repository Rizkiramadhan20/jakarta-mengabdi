import { Card } from "@/components/ui/card"

import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsSkelaton() {
    return (
        <>
            {[...Array(3)].map((_, index) => (
                <Card key={index} className="relative p-0 bg-white/95 rounded-2xl border border-gray-100 transition-all duration-300 flex flex-col overflow-hidden">
                    <div className="flex flex-col h-full">
                        <div className="relative w-full aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                            <Skeleton className="w-full h-full" style={{ aspectRatio: '4/3' }} />
                        </div>
                        <div className="flex-1 flex flex-col gap-2 p-4">
                            <div className="flex items-center justify-between gap-2">
                                <Skeleton className="h-6 w-3/4 rounded-md" />
                                <Skeleton className="h-6 w-1/4 rounded-full" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Skeleton className="h-5 w-1/2 rounded-md" />
                            </div>
                            <Skeleton className="h-4 w-1/3 rounded-md" />
                            <div className="flex flex-row gap-2 mt-3">
                                <Skeleton className="h-9 w-full rounded-md" />
                                <Skeleton className="h-9 w-full rounded-md" />
                                <Skeleton className="h-9 w-full rounded-md" />
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </>
    )
}
