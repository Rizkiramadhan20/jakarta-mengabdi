import React from 'react'

import VolunteerLayout from '@/hooks/pages/volunteer/VolunteerLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Volunteer - Jakarta Mengabdi',
    description: 'hallo',
}

export default function page() {
    return (
        <VolunteerLayout />
    )
}