import React from 'react'

import JmerchLayout from '@/hooks/dashboard/jmerch/jmerch/JmerchLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'JMerch - Jakarta Mengabdi',
    description: 'Dashboard',
}

export default function page() {
    return (
        <JmerchLayout />
    )
}