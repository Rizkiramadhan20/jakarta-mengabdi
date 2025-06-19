import React from 'react'

import type { Metadata } from 'next'

import SignupLayout from "@/hooks/(auth)/signup/SignupLayout"

export const metadata: Metadata = {
    title: 'Daftar | Your Wesbite',
    description: 'Sign in to your account'
}

export default function SignInPage() {
    return (
        <SignupLayout />
    )
}