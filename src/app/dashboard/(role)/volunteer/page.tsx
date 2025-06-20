import React from 'react'

import VolunteerLayout from '@/hooks/dashboard/volunteer/VolunteerLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Dashboard',
}

export default function page() {
    return (
        <VolunteerLayout />
    )
}