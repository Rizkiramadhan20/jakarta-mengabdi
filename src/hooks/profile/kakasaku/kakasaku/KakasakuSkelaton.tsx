import React from "react";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

export default function KakasakuSkelaton() {
    // Render 6 skeleton cards to match the grid layout
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
                <Card key={idx} className="rounded-3xl shadow-lg border border-gray-100 bg-white flex flex-col min-h-[440px] p-0 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-auto">
                    {/* Image Banner Skeleton */}
                    <Skeleton className="w-full h-56 rounded-t-3xl bg-gray-100" />
                    <CardHeader className="flex flex-col items-start gap-2 pt-6 pb-2 px-6">
                        <div className="flex items-center gap-2 w-full justify-end">
                            <Skeleton className="h-4 w-24 bg-gray-200" />
                        </div>
                        <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                            <Skeleton className="h-5 w-40 bg-gray-200" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 px-6 pb-2">
                        {/* User Info Skeleton */}
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-14 h-14 rounded-full bg-gray-200" />
                            <div className="flex flex-col gap-0.5">
                                <Skeleton className="h-4 w-32 bg-gray-200" />
                                <Skeleton className="h-3 w-24 bg-gray-100" />
                            </div>
                        </div>
                        {/* Transaction Info Skeleton */}
                        <div className="flex flex-col gap-1 mt-2">
                            <Skeleton className="h-6 w-32 bg-gray-200" />
                            <Skeleton className="h-4 w-24 bg-gray-100" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 px-6 pb-6 pt-2 mt-auto">
                        <Skeleton className="w-full h-12 rounded-xl bg-gray-200" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
