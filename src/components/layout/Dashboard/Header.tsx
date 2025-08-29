"use client"

import React from 'react';

import { useAuth } from '@/utils/context/AuthContext';

import { Menu } from 'lucide-react';

import { Button } from "@/components/ui/button";

interface HeaderProps {
    onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const { profile } = useAuth();

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
                        <h2 className="text-lg font-semibold text-foreground line-clamp-1 hidden sm:block">
                            Hello,{profile?.full_name || 'User'}!
                        </h2>
                        <p className="text-sm text-muted-foreground hidden sm:block">
                            Welcome back to your dashboard
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
} 