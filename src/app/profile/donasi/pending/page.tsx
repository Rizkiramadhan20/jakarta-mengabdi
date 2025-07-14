import React from 'react'

import { Metadata } from 'next'

import DonasiPending from '@/hooks/profile/donasi/pending/DonasiPending'

export const metadata: Metadata = {
    title: 'Donasi Pending | Jakarta mengabdi',
    description: 'Perbarui data - data anda yang belum di perbarui.',
}


export default function page() {
    return (
        <DonasiPending />
    )
}
