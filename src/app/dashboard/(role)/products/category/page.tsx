import React from 'react'

import CategoryLayout from '@/hooks/dashboard/products/category/CategoryLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Products Category - Jakarta Mengabdi',
    description: 'Dashboard',
}

export default function page() {
    return (
        <CategoryLayout />
    )
}