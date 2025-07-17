"use client"

import React, { useState } from "react";

import Image from "next/image";

import Link from "next/link";

import { Menu, LogIn, Info, Utensils, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";

import Logo from '@/base/assets/logo.png';

import ProfileMenu from "@/components/layout/Header/ProfileMenu";

import { usePathname } from "next/navigation";

import { useAuth } from "@/utils/context/AuthContext";

// Use NavLink as menuHamburger equivalent
const menuHamburger = [
    { name: "Donasi ", href: "/donasi", icon: Info },
    { name: "Volunteer ", href: "/volunteer", icon: Utensils },
    { name: "Jmerch", href: "/jmerch", icon: Users },
];

export default function Header() {
    const { user, profile } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const handleLinkClick = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-[200] flex py-4 transition-all duration-500 bg-[#403122]">
            <div className="container px-4 md:px-14 flex justify-between items-center">
                {/* Left Section - Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-all duration-300">
                        <Image
                            src={Logo}
                            alt="Logo"
                            width={110}
                            height={40}
                            className="h-13 mb-2 w-full object-contain"
                            priority
                        />
                    </Link>
                </div>

                {/* Center Section - Navigation */}
                <div className="flex gap-6">
                    <NavigationMenu className="hidden lg:flex">
                        <NavigationMenuList className="gap-8">
                            {menuHamburger.map((item) => (
                                <NavigationMenuItem key={item.href}>
                                    <Link href={item.href}>
                                        <Button
                                            variant="ghost"
                                            className={`text-[#f0ebd8] hover:text-gray-900 h-10 font-medium text-base transition-all duration-300 hover:scale-105 ${item.href === '/' ? (pathname === '/' ? 'text-gray-900 bg-gray-100' : '') : (pathname?.startsWith(item.href) ? 'text-gray-900 bg-gray-100' : '')}`}
                                        >
                                            {item.name}
                                        </Button>
                                    </Link>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Right Section - Login/Profile, and Hamburger */}
                    <div className="flex items-center gap-2">
                        {user && profile ? (
                            <ProfileMenu
                                isProfileOpen={isProfileOpen}
                                toggleProfile={toggleProfile}
                            />
                        ) : (
                            <Button
                                variant="link"
                                className={`cursor-pointer text-[#f0ebd8] transition-all text-xl duration-300 hover:scale-105 hidden sm:flex ${pathname === '/signin' ? 'bg-gray-800' : ''}`}
                                onClick={() => window.location.href = '/signin'}
                            >
                                Login
                            </Button>
                        )}
                        {!user && (
                            <Button
                                size="icon"
                                variant={"default"}
                                className={`sm:hidden bg-[#F0EBD7] text-[#403122] flex items-center hover:bg-gray-100/80 transition-all duration-300 w-24`}
                                onClick={() => window.location.href = '/signin'}
                            >
                                Signin<LogIn className="h-5 w-5 ml-1" />
                            </Button>
                        )}
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden hover:bg-gray-100/80 transition-all duration-300">
                                    <Menu className="h-5 w-5 text-white" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-[50dvh] p-0 bg-[#403122]/80 backdrop-blur-xl border-t rounded-t-[var(--radius)]">
                                <div className="flex flex-col h-full">
                                    <SheetHeader className="px-6 py-4 border-b">
                                        <SheetTitle className="text-[#f0ebd8] text-xl font-semibold">Menu</SheetTitle>
                                    </SheetHeader>
                                    <nav className="flex-1 px-6 py-4 overflow-y-auto">
                                        <ul className="flex flex-col gap-4">
                                            {menuHamburger.map((item) => (
                                                <li key={item.href}>
                                                    <Link href={item.href} onClick={handleLinkClick}>
                                                        <Button
                                                            variant="ghost"
                                                            className={`text-[#f0ebd8] hover:text-gray-900 text-md font-medium transition-all duration-300 w-full justify-start hover:bg-gray-100/80 rounded-[var(--radius)] py-6 gap-3
                                                            ${item.href === '/'
                                                                    ? (pathname === '/' ? 'bg-[#f0ebd8] text-[#403122]' : '')
                                                                    : (pathname?.startsWith(item.href) ? 'bg-[#f0ebd8] text-[#403122]' : '')}
                                                            `}
                                                        >
                                                            {item.icon && <item.icon className="h-5 w-5 mr-2" />}
                                                            {item.name}
                                                        </Button>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
