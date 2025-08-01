import React from 'react'

import VolunteerLayout from '@/hooks/dashboard/volunteer/VolunteerLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Volunteer - Jakarta Mengabdi',
    description: 'Dashboard',
}

export default function page() {
    return (
        <VolunteerLayout />
    )
}