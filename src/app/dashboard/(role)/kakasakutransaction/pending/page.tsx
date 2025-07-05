import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Kakak Saku Transaction Pending - Jakarta Mengabdi',
    description: 'Dashboard',
}

import KakasakutransactionPending from "@/hooks/dashboard/kakasakutransaction/pending/kakasakutransaction"

export default function page() {
    return (
        <KakasakutransactionPending />
    )
}
