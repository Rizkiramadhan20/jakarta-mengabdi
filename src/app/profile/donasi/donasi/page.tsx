import React from 'react'

import { Metadata } from 'next'

import KakasakuLayout from '@/hooks/profile/kakasaku/kakasaku/KakasakuLayout'

export const metadata: Metadata = {
    title: 'Donasi | Jakarta mengabdi',
    description: 'Perbarui data - data anda yang belum di perbarui.',
}


export default function page() {
    return (
        <KakasakuLayout />
    )
}
