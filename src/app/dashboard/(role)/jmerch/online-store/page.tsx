import React from 'react'

import OnlineStoreLayout from '@/hooks/dashboard/jmerch/online-store/OnlineStoreLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Online Store - Jakarta Mengabdi',
    description: 'Dashboard',
}

export default function page() {
    return (
        <OnlineStoreLayout />
    )
}