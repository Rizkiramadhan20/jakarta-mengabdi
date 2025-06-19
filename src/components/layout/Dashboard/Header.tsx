"use client"

import React, { useState } from 'react';

import { useAuth } from '@/utils/context/AuthContext';

import { Bell, Menu } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import Image from 'next/image';

import { useRouter } from 'next/navigation';

interface HeaderProps {
    onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const { user, profile } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const router = useRouter();

    return (
        <header className="sticky top-0 w-full bg-background border-b">
            <div className="flex items-center justify-between h-16 px-4">
                {/* Left side */}
                <div className="flex items-center gap-4">
                    <Button
                        onClick={onMenuClick}
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground line-clamp-1">
                            Hello,{profile?.full_name || 'User'}!
                        </h2>
                        <p className="text-sm text-muted-foreground hidden sm:block">
                            Welcome back to your dashboard
                        </p>
                    </div>
                </div>

                {/* Right side - Profile and notifications */}
                <div className="flex items-center gap-2 lg:gap-4">
                    {/* Notifications */}
                    <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="w-5 h-5" />
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                                    20
                                </Badge>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-96">
                            <div className="px-4 py-3 border-b">
                                <h3 className="font-semibold text-base">Recent Transactions</h3>
                            </div>
                            <DropdownMenuSeparator />
                            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                                20
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Profile Image */}
                    {profile?.photo_url ? (
                        <Image src={profile.photo_url} alt="Profile" width={32} height={32} className="rounded-full" />
                    ) : (
                        <span>{profile?.full_name?.[0] || 'S'}</span>
                    )}
                </div>
            </div>
        </header>
    );
} 