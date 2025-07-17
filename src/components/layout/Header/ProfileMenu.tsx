import Link from 'next/link'

import { UserCircle, ChevronDown } from 'lucide-react'

import { useAuth } from '@/utils/context/AuthContext'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"

interface ProfileMenuProps {
    isProfileOpen: boolean
    toggleProfile: () => void
}

export default function ProfileMenu({ isProfileOpen, toggleProfile }: ProfileMenuProps) {
    const { user, profile, signOut } = useAuth()

    if (!user || !profile) return null

    // Helper to get dashboard URL based on role
    const getDashboardUrl = (role: string) => {
        if (role === 'admin') return '/dashboard'
        if (role === 'user') return '/profile'
        return '/'
    }

    return (
        <DropdownMenu open={isProfileOpen} onOpenChange={toggleProfile}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-3 md:px-4 h-14 bg-[#403122]/80 backdrop-blur-md text-[#f0ebd8] border border-[#f0ebd8]/30 shadow-lg rounded-full hover:bg-[#403122]/60 transition-all">
                    <Avatar className="w-8 h-8 md:w-9 md:h-9 ring-1 ring-[#f0ebd8] shadow-sm mr-2">
                        {profile.photo_url ? (
                            <AvatarImage src={profile.photo_url} alt={profile.full_name || 'Profile'} />
                        ) : (
                            <AvatarFallback>
                                <UserCircle className="w-8 h-8 md:w-9 md:h-9 text-gray-400" />
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <span className="inline text-sm md:text-base font-semibold max-w-[120px] truncate text-[#f0ebd8]">
                        {profile.full_name || 'User'}
                    </span>
                    <ChevronDown className={`inline transition-transform duration-200 text-[#f0ebd8] ${isProfileOpen ? 'rotate-180' : ''}`} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 bg-[#403122]/80 backdrop-blur-xl text-[#f0ebd8] border-none shadow-2xl rounded-2xl p-2">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1 items-center py-2">
                        <Avatar className="w-16 h-16 ring-2 ring-[#f0ebd8] shadow-lg mb-2">
                            {profile.photo_url ? (
                                <AvatarImage src={profile.photo_url} alt={profile.full_name || 'Profile'} />
                            ) : (
                                <AvatarFallback>
                                    <UserCircle className="w-16 h-16 text-gray-400" />
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <p className="text-lg font-bold text-[#f0ebd8]">{profile.full_name || 'User'}</p>
                        <p className="text-xs text-[#f0ebd8]/70 truncate">{profile.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#f0ebd8]/20 my-2" />
                <DropdownMenuItem asChild className="my-1">
                    <Link
                        href={getDashboardUrl(profile.role)}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#f0ebd8] text-[#403122] font-semibold shadow hover:bg-[#f0ebd8]/90 transition-colors text-base justify-center"
                        onClick={toggleProfile}
                    >
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#403122]/10 text-[#403122]">📊</span>
                        Dashboard
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#f0ebd8] text-[#403122] font-semibold shadow hover:bg-[#f0ebd8]/90 transition-colors text-base justify-center my-1 cursor-pointer"
                    onClick={async () => {
                        await signOut()
                        toggleProfile()
                    }}
                >
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#403122]/10 text-[#403122]">🚪</span>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 