import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Kakak Saku Transaction - Jakarta Mengabdi',
    description: 'Dashboard',
}

import Kakasakutransaction from "@/hooks/dashboard/kakasakutransaction/kakasakutransaction/kakasakutransaction"

export default function page() {
    return (
        <Kakasakutransaction />
    )
}
