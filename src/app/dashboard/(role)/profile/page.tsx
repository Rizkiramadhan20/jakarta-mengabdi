import React from 'react'

import ProfileLayout from '@/hooks/dashboard/profile/ProfileLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Profile - Jakarta Mengabdi',
    description: 'Dashboard',
}

export default function page() {
    return (
        <ProfileLayout />
    )
}