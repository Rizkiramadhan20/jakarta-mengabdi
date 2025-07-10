import React from 'react'

import { Metadata } from 'next'

import KaksakuDonasiRekap from "@/hooks/dashboard/rekaputasi/KaksakuDonasiRekap"

export const metadata: Metadata = {
    title: 'Rekaputasi Kakasaku & Donasi - Jakarta Mengabdi',
    description: 'Dashboard',
}

export default function page() {
    return (
        <KaksakuDonasiRekap />
    )
}
