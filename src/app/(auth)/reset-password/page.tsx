import React, { Suspense } from 'react'

import type { Metadata } from 'next'

import ResetPasswordLayout from "@/hooks/(auth)/reset-password/ResetPasswordLayout"

export const metadata: Metadata = {
    title: 'Reset Password | Jakarta Mengabdi',
    description: 'Reset your password'
}

function ResetPasswordContent() {
    return <ResetPasswordLayout />
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <section className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED8002] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </section>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}
