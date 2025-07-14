import React from 'react'

import { Metadata } from 'next'

import KakasakuPending from '@/hooks/profile/kakasaku/pending/KakasakuPending'

export const metadata: Metadata = {
    title: 'Kakasaku Pending | Jakarta mengabdi',
    description: 'Perbarui data - data anda yang belum di perbarui.',
}


export default function page() {
    return (
        <KakasakuPending />
    )
}
