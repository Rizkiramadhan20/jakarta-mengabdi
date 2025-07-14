import React from 'react'

import { Metadata } from 'next'

import DonasiLayout from '@/hooks/profile/donasi/donasi/DonasiLayout'

export const metadata: Metadata = {
    title: 'Donasi | Jakarta mengabdi',
    description: 'Perbarui data - data anda yang belum di perbarui.',
}


export default function page() {
    return (
        <DonasiLayout />
    )
}
