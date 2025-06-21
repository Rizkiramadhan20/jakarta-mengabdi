"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export default function ProfileHeader() {
    return (
        <div className="h-16 border-b flex items-center justify-between px-4 lg:px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2 flex-1 max-w-md ml-12 lg:ml-0">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Cari Product Kami..."
                        className="pl-9 bg-background/50 h-9 text-sm"
                    />
                </div>
            </div>
        </div>
    );
} 