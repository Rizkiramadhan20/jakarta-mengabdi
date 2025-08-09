"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from '@/utils/context/AuthContext'
import coffeImage from "@/base/assets/login.png"
import toast from 'react-hot-toast'

export default function ForgotPasswordLayout() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isEmailSent, setIsEmailSent] = useState(false)
    const { resetPassword } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            toast.error('Silakan masukkan email Anda')
            return
        }

        setIsLoading(true)
        try {
            await resetPassword(email)
            setIsEmailSent(true)
        } catch (error) {
            console.error('Reset password failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isEmailSent) {
        return (
            <section className="min-h-screen flex flex-col md:flex-row">
                {/* Kiri: Success Message */}
                <div className="order-2 md:order-1 flex flex-col justify-center md:w-1/2 w-full px-8 md:px-24 py-12">
                    <div className="max-w-md mx-auto w-full">
                        {/* Success Header */}
                        <div className="text-center mb-8">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h1 className="text-3xl font-bold mb-2">Email Terkirim!</h1>
                            <p className="text-gray-600">
                                Link reset password telah dikirim ke email Anda
                            </p>
                        </div>

                        {/* Email Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center gap-2 text-blue-800">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm font-medium">Email dikirim ke:</span>
                            </div>
                            <p className="text-blue-700 font-medium mt-1">{email}</p>
                        </div>

                        {/* Instructions */}
                        <Card className="mb-6">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-[#ED8002]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-[#ED8002] text-sm font-semibold">1</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm mb-1">Cek Email Anda</h3>
                                            <p className="text-gray-600 text-sm">
                                                Periksa kotak masuk untuk email reset password
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-[#ED8002]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-[#ED8002] text-sm font-semibold">2</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm mb-1">Klik Link Reset</h3>
                                            <p className="text-gray-600 text-sm">
                                                Klik tombol "Reset Password" dalam email tersebut
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckCircle className="w-3 h-3 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm mb-1">Buat Password Baru</h3>
                                            <p className="text-gray-600 text-sm">
                                                Masukkan password baru yang aman
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-4">
                                Tidak menerima email? Periksa folder spam Anda atau coba kirim ulang.
                            </p>
                            <div className="space-y-2">
                                <Button
                                    onClick={() => setIsEmailSent(false)}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Kirim Ulang Email
                                </Button>
                                <a
                                    href="/signin"
                                    className="text-[#ED8002] hover:underline text-sm font-medium inline-flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Kembali ke halaman masuk
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kanan: Gambar */}
                <div className="order-1 md:order-2 mb-4 md:mb-0 flex md:w-1/2 items-center justify-center">
                    <div className="relative w-full h-full min-h-[450px] md:min-h-[500px]">
                        <Image
                            src={coffeImage}
                            alt="Reset Password"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-r-3xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent rounded-r-3xl" />
                        <div className="absolute bottom-8 left-8 right-8 text-white">
                            <h2 className="text-2xl font-bold mb-2">Email Terkirim!</h2>
                            <p className="text-white/90">
                                Silakan cek email Anda untuk reset password
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="min-h-screen flex flex-col md:flex-row">
            {/* Kiri: Form Reset Password */}
            <div className="order-2 md:order-1 flex flex-col justify-center md:w-1/2 w-full px-8 md:px-24 py-12">
                <div className="max-w-md mx-auto w-full">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-[#ED8002]/10 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-8 h-8 text-[#ED8002]" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Lupa Password?</h1>
                        <p className="text-gray-600">
                            Tidak masalah! Kami akan mengirimkan link reset password ke email Anda.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@email.com"
                                required
                                className="mt-2 bg-white"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#ED8002] hover:bg-[#ED8002]/90"
                        >
                            {isLoading ? 'Mengirim...' : 'Kirim Link Reset Password'}
                        </Button>
                    </form>

                    {/* Back to Login */}
                    <div className="text-center mt-6">
                        <a
                            href="/signin"
                            className="text-[#ED8002] hover:underline text-sm font-medium inline-flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke halaman masuk
                        </a>
                    </div>

                    {/* Tips */}
                    <Card className="mt-6 bg-gray-50">
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-sm mb-2">💡 Tips:</h3>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li>• Pastikan email yang dimasukkan sudah benar</li>
                                <li>• Cek folder spam jika email tidak masuk</li>
                                <li>• Link reset password berlaku selama 24 jam</li>
                                <li>• Jika masih bermasalah, hubungi tim support</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Kanan: Gambar */}
            <div className="order-1 md:order-2 mb-4 md:mb-0 flex md:w-1/2 items-center justify-center">
                <div className="relative w-full h-full min-h-[450px] md:min-h-[500px]">
                    <Image
                        src={coffeImage}
                        alt="Forgot Password"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-r-3xl"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ED8002]/20 to-transparent rounded-r-3xl" />
                    {/* Text overlay */}
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                        <h2 className="text-2xl font-bold mb-2">Reset Password Anda</h2>
                        <p className="text-white/90">
                            Masukkan email Anda dan kami akan mengirimkan link untuk reset password
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
