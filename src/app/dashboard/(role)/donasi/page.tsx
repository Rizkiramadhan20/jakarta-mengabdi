import React from 'react'

import DonasiLayout from '@/hooks/dashboard/donasi/DonasiLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Donasi | Jakarta Mengabdi',
    description: 'Dashboard',
}

export default function page() {
    return (
        <DonasiLayout />
    )
}