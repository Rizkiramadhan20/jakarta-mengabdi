import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Donasi Transaction - Jakarta Mengabdi',
    description: 'Dashboard',
}

import Donasitransaction from "@/hooks/dashboard/donasitransaction/donasitransaction/donasitransaction"

export default function page() {
    return (
        <Donasitransaction />
    )
}
