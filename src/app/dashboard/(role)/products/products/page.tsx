import React from 'react'

import ProductsLayout from '@/hooks/dashboard/products/products/ProductsLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Products - Jakarta Mengabdi',
    description: 'Dashboard',
}

export default function page() {
    return (
        <ProductsLayout />
    )
}