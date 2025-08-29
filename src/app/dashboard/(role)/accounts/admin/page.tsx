import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Manajemen Admin - Jakarta Mengabdi',
    description: 'Dashboard',
}

import AccountsLayout from "@/hooks/dashboard/accounts/admins/AccountsLayout"

export default function page() {
    return (
        <AccountsLayout />
    )
}
