import React from 'react'

import type { Metadata } from 'next'

import ForgotPasswordLayout from "@/hooks/(auth)/forgot-password/ForgotPasswordLayout"

export const metadata: Metadata = {
    title: 'Lupa Sandi | Jakarta Mengabdi',
    description: 'Lupa Sandi your account'
}

export default function ForgotPasswordPage() {
    return (
        <ForgotPasswordLayout />
    )
}