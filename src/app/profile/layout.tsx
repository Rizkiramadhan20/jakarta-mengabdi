"use client";

import { useAuth } from "@/utils/context/AuthContext";

import { redirect } from "next/navigation";

import ProfileSidebar from "@/components/layout/Profile/ProfileSidebar";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { Menu } from "lucide-react";

import { useState, useEffect } from "react";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuth();
    const [isMobile, setIsMobile] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!user) {
        redirect("/signin");
    }

    return (
        <div className="flex min-h-screen">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block fixed inset-y-0 left-0 w-72">
                <ProfileSidebar />
            </div>

            {/* Mobile Sidebar */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden fixed top-4 left-4 z-50"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <ProfileSidebar onLinkClick={() => setIsSidebarOpen(false)} forceExpanded />
                </SheetContent>
            </Sheet>

            <div className="flex-1 lg:ml-[14%]">
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
} 