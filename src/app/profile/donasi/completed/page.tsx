import React from 'react'

import { Metadata } from 'next'

import DonasiCompleted from '@/hooks/profile/donasi/completed/DonasiCompleted'

export const metadata: Metadata = {
    title: 'Donasi completed | Jakarta mengabdi',
    description: 'Perbarui data - data anda yang belum di perbarui.',
}


export default function page() {
    return (
        <DonasiCompleted />
    )
}
