import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Accounts - Jakarta Mengabdi',
    description: 'Dashboard',
}

import AccountsLayout from "@/hooks/dashboard/accounts/AccountsLayout"

export default function page() {
    return (
        <AccountsLayout />
    )
}
