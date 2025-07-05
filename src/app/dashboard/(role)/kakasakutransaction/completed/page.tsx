import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Kakak Saku Transaction Completed - Jakarta Mengabdi',
    description: 'Dashboard',
}

import KakasakutransactionCompleted from "@/hooks/dashboard/kakasakutransaction/completed/kakasakutransaction"

export default function page() {
    return (
        <KakasakutransactionCompleted />
    )
}
