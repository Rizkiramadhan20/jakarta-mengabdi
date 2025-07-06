import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Donasi Transaction Pending - Jakarta Mengabdi',
    description: 'Dashboard',
}

import Donasitransaction from "@/hooks/dashboard/donasitransaction/pending/donasitransaction"

export default function page() {
    return (
        <Donasitransaction />
    )
}
