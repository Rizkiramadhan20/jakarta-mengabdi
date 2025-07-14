import React from 'react'

import { Metadata } from 'next'

import ProfileLayout from '@/hooks/profile/profile/ProfileLayout'

export const metadata: Metadata = {
    title: 'Profile | Jakarta mengabdi',
    description: 'Perbarui data - data anda yang belum di perbarui.',
}


export default function page() {
    return (
        <ProfileLayout />
    )
}
