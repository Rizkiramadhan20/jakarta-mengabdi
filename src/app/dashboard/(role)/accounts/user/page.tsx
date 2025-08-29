import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Manajemen Pengguna - Jakarta Mengabdi',
    description: 'Dashboard',
}

import AccountsLayout from "@/hooks/dashboard/accounts/users/AccountsLayout"

export default function page() {
    return (
        <AccountsLayout />
    )
}
