import React from 'react'

import KakaSakuLayout from '@/hooks/dashboard/kaka-saku/KakaSakuLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Kakak Saku - Jakarta Mengabdi',
    description: 'Dashboard',
}

export default function page() {
    return (
        <KakaSakuLayout />
    )
}