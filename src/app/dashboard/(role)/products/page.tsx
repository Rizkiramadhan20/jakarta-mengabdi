import React from 'react'

import ProductsLayout from '@/hooks/dashboard/products/ProductsLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Products | Jakarta',
    description: 'Dashboard',
}

export default function page() {
    return (
        <ProductsLayout />
    )
}