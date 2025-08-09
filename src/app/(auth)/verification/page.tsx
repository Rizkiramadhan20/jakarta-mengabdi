import React from 'react'

import type { Metadata } from 'next'

import VerifikasiLayout from "@/hooks/(auth)/verification/VerificationLayout"

export const metadata: Metadata = {
    title: 'Verifikasi | Jakarta Mengabdi',
    description: 'Verifikasi to your account'
}

export default function VerifikasiPage() {
    return (
        <VerifikasiLayout />
    )
}