"use client";

import Link from "next/link";

import { useAuth } from "@/utils/context/AuthContext";

import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
    User,
    LogOut,
    ChevronRight,
    Shield,
    ChevronDown,
    CreditCard,
    UserPen,
    MapPin
} from "lucide-react";

import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProfileSidebarProps {
    onLinkClick?: () => void;
    forceExpanded?: boolean;
}

interface SubItem {
    title: string;
    href: string;
}

interface NavItem {
    title: string;
    href: string;
    icon: any;
    subItems?: SubItem[];
}

const sidebarNavItems: NavItem[] = [
    {
        title: "Overview",
        href: "/profile",
        icon: User,
    },

    {
        title: "Donasi",
        href: "/profile/donasi",
        icon: CreditCard,
        subItems: [
            { title: "Tranksaksi", href: "/profile/donasi/donasi" },
            { title: "Tertunda", href: "/profile/donasi/pending" },
            { title: "Selesai", href: "/profile/donasi/completed" },
        ],
    },

    {
        title: "Kakasaku",
        href: "/profile/kakasaku",
        icon: CreditCard,
        subItems: [
            { title: "Tranksaksi", href: "/profile/kakasaku/kakasaku" },
            { title: "Tertunda", href: "/profile/kakasaku/pending" },
            { title: "Selesai", href: "/profile/kakasaku/completed" },
        ],
    },

    {
        title: "Profile",
        href: "/profile/profile",
        icon: UserPen,
    },

    {
        title: "Kembali",
        href: "/donasi",
        icon: UserPen,
    },
];

export default function ProfileSidebar({ onLinkClick, forceExpanded }: ProfileSidebarProps) {
    const { user, profile, signOut } = useAuth();
    const pathname = usePathname();
    const [expanded, setExpanded] = useState(forceExpanded ?? true);
    const [showUser, setShowUser] = useState(true);
    const [openSub, setOpenSub] = useState<string | null>(null);

    if (!user) return null;

    // Responsive: collapse on mobile
    useEffect(() => {
        if (forceExpanded) {
            setExpanded(true);
            return;
        }
        const handleResize = () => setExpanded(window.innerWidth >= 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [forceExpanded]);

    return (
        <TooltipProvider>
            <aside
                className={cn(
                    "group/sidebar flex flex-col h-[95vh] m-4 border border-border bg-card text-card-foreground shadow-xs rounded-xl transition-all duration-300",
                    expanded ? "w-64" : "w-20 items-center"
                )}
                onMouseEnter={!forceExpanded ? () => setExpanded(true) : undefined}
                onMouseLeave={!forceExpanded ? () => setExpanded(window.innerWidth >= 1024) : undefined}
            >
                {/* User Info Collapsible */}
                <div className={cn(
                    "flex flex-col items-center border-b border-border transition-all duration-300",
                    expanded ? "p-6" : "py-4 px-2"
                )}>
                    <button
                        className="focus:outline-none"
                        onClick={() => setShowUser((v) => !v)}
                        tabIndex={-1}
                        aria-label="Toggle user info"
                    >
                        <Avatar className="w-12 h-12 ring-2 ring-primary/10 ring-offset-2 ring-offset-card shadow">
                            {profile?.photo_url ? (
                                <AvatarImage src={profile.photo_url} alt={profile.full_name || 'Profile'} className="object-cover" />
                            ) : (
                                <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                                    {profile?.full_name?.charAt(0) || 'U'}
                                </AvatarFallback>
                            )}
                        </Avatar>
                    </button>
                    {showUser && expanded && (
                        <div className="mt-3 text-center w-full">
                            <h2 className="text-base font-semibold truncate">{profile?.full_name || 'No Name'}</h2>
                            <p className="text-xs text-muted-foreground/80 truncate">{user.email}</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <ScrollArea className="flex-1 w-full">
                    <nav className="py-4 flex flex-col gap-1">
                        {sidebarNavItems.map((item) => {
                            const isItemActive = pathname === item.href || item.subItems?.some(sub => pathname === sub.href);
                            const hasSubItems = item.subItems && item.subItems.length > 0;
                            return (
                                <div key={item.href} className="w-full">
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <div className="w-full">
                                                <Button
                                                    variant={isItemActive ? "secondary" : "ghost"}
                                                    className={cn(
                                                        "w-full flex items-center h-12 px-3 rounded-lg transition-all duration-200",
                                                        expanded ? "justify-start gap-4" : "justify-center",
                                                        isItemActive && "font-semibold shadow-xs"
                                                    )}
                                                    onClick={hasSubItems && expanded ? () => setOpenSub(openSub === item.href ? null : item.href) : onLinkClick}
                                                    asChild={!hasSubItems}
                                                >
                                                    {hasSubItems && expanded ? (
                                                        <div className="flex items-center w-full cursor-pointer select-none gap-4">
                                                            <span className={cn(
                                                                "flex items-center justify-center min-w-[32px]",
                                                                expanded ? "w-8 h-8" : "w-10 h-10"
                                                            )}>
                                                                <item.icon className={cn(
                                                                    "w-5 h-5",
                                                                    isItemActive ? "text-primary" : "text-muted-foreground"
                                                                )} />
                                                            </span>
                                                            <span className="text-sm truncate flex-1 text-left">{item.title}</span>
                                                            <ChevronDown className={cn("w-4 h-4 ml-auto transition-transform", openSub === item.href && "rotate-180")} />
                                                        </div>
                                                    ) : (
                                                        <Link href={item.href} onClick={onLinkClick} className="flex items-center w-full gap-4">
                                                            <span className={cn(
                                                                "flex items-center justify-center min-w-[32px]",
                                                                expanded ? "w-8 h-8" : "w-10 h-10"
                                                            )}>
                                                                <item.icon className={cn(
                                                                    "w-5 h-5",
                                                                    isItemActive ? "text-primary" : "text-muted-foreground"
                                                                )} />
                                                            </span>
                                                            {expanded && <span className="text-sm truncate text-left flex-1">{item.title}</span>}
                                                        </Link>
                                                    )}
                                                </Button>
                                            </div>
                                        </TooltipTrigger>
                                        {!expanded && (
                                            <TooltipContent side="right" className="ml-2">
                                                {item.title}
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                    {/* Subitems */}
                                    {hasSubItems && expanded && openSub === item.href && (
                                        <div className="ml-4 pl-2 border-l-2 border-border/60 mt-1 flex flex-col gap-1 animate-in fade-in-0 zoom-in-95">
                                            {(item.subItems ?? []).map((sub) => (
                                                <Link key={sub.href} href={sub.href} onClick={onLinkClick}>
                                                    <Button
                                                        variant={pathname === sub.href ? "secondary" : "ghost"}
                                                        className={cn(
                                                            "w-full flex items-center h-9 pl-6 pr-3 rounded-md text-xs justify-start transition-all relative group",
                                                            pathname === sub.href && "font-semibold shadow-xs bg-primary/10 text-primary",
                                                            "hover:bg-accent/60 hover:text-accent-foreground"
                                                        )}
                                                    >
                                                        {/* Active indicator bar */}
                                                        {pathname === sub.href && (
                                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-primary rounded-r-md" />
                                                        )}
                                                        <span className="flex-1 text-left">{sub.title}</span>
                                                        {pathname === sub.href && <ChevronRight className="w-4 h-4 ml-auto" />}
                                                    </Button>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </ScrollArea>

                {/* Logout Button */}
                <div className={cn(
                    "border-t border-border flex flex-col items-center w-full p-3",
                    expanded ? "" : "px-2"
                )}>
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full flex items-center gap-3 h-12 px-3 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 transition-all",
                            expanded ? "justify-start" : "justify-center"
                        )}
                        onClick={signOut}
                    >
                        <LogOut className="w-5 h-5 text-destructive" />
                        {expanded && <span className="text-sm font-semibold">Logout</span>}
                    </Button>
                </div>
            </aside>
        </TooltipProvider>
    );
} 