import React from 'react'

import { Metadata } from 'next'

import KakasakuCompleted from '@/hooks/profile/kakasaku/completed/KakasakuCompleted'

export const metadata: Metadata = {
    title: 'Kakasaku Completed | Jakarta mengabdi',
    description: 'Perbarui data - data anda yang belum di perbarui.',
}


export default function page() {
    return (
        <KakasakuCompleted />
    )
}
