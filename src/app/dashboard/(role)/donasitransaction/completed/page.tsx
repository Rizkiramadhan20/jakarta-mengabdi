import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Donasi Transaction Completed - Jakarta Mengabdi',
    description: 'Dashboard',
}

import Donasitransaction from "@/hooks/dashboard/donasitransaction/completed/donasitransaction"

export default function page() {
    return (
        <Donasitransaction />
    )
}
