"use client"

import React from 'react'

import Image from 'next/image'

import { useRouter } from 'next/navigation'

import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { Card, CardContent } from "@/components/ui/card"

import coffeImage from "@/base/assets/login.png"

import useStateResetPassword from '@/hooks/(auth)/reset-password/lib/useStateResetPassword'

export default function ResetPasswordLayout() {
    const router = useRouter()
    const {
        password,
        confirmPassword,
        showPassword,
        showConfirmPassword,
        isLoading,
        isValidToken,
        isCheckingToken,
        isSuccess,
        setPassword,
        setConfirmPassword,
        toggleShowPassword,
        toggleShowConfirmPassword,
        handleSubmit,
    } = useStateResetPassword()

    if (isCheckingToken) {
        return (
            <section className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED8002] mx-auto mb-4"></div>
                    <p className="text-gray-600">Memverifikasi link reset password...</p>
                </div>
            </section>
        )
    }

    if (!isValidToken) {
        return (
            <section className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Link Tidak Valid</h1>
                    <p className="text-gray-600 mb-4">
                        Link reset password tidak valid atau sudah expired. Anda akan diarahkan ke halaman lupa password.
                    </p>
                </div>
            </section>
        )
    }

    if (isSuccess) {
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
                            <h1 className="text-3xl font-bold mb-2">Password Berhasil Direset!</h1>
                            <p className="text-gray-600">
                                Password Anda telah berhasil diubah. Sekarang Anda bisa login dengan password baru.
                            </p>
                        </div>

                        {/* Success Info */}
                        <Card className="mb-6">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm">Password Berhasil Diperbarui</h3>
                                            <p className="text-gray-600 text-sm">
                                                Gunakan password baru untuk login ke akun Anda
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Button
                            onClick={() => router.push('/signin')}
                            className="w-full bg-[#ED8002] hover:bg-[#ED8002]/90"
                        >
                            Login Sekarang
                        </Button>

                        {/* Tips */}
                        <Card className="mt-6 bg-gray-50">
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-sm mb-2">💡 Tips Keamanan:</h3>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    <li>• Gunakan password yang kuat dan unik</li>
                                    <li>• Jangan bagikan password ke siapapun</li>
                                    <li>• Logout dari perangkat yang tidak dikenal</li>
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
                            alt="Password Reset Success"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-r-3xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent rounded-r-3xl" />
                        <div className="absolute bottom-8 left-8 right-8 text-white">
                            <h2 className="text-2xl font-bold mb-2">Password Berhasil Direset!</h2>
                            <p className="text-white/90">
                                Sekarang Anda bisa login dengan password baru
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
                            <Lock className="w-8 h-8 text-[#ED8002]" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
                        <p className="text-gray-600">
                            Masukkan password baru yang aman untuk akun Anda.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password Baru
                            </Label>
                            <div className="relative mt-2">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Masukkan password baru"
                                    required
                                    className="bg-white pr-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={toggleShowPassword}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                Konfirmasi Password
                            </Label>
                            <div className="relative mt-2">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Konfirmasi password baru"
                                    required
                                    className="bg-white pr-10"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={toggleShowConfirmPassword}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#ED8002] hover:bg-[#ED8002]/90"
                        >
                            {isLoading ? 'Mereset Password...' : 'Reset Password'}
                        </Button>
                    </form>

                    {/* Password Requirements */}
                    <Card className="mt-6 bg-blue-50">
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-sm mb-2">🔒 Syarat Password:</h3>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li>• Minimal 6 karakter</li>
                                <li>• Kombinasi huruf dan angka (disarankan)</li>
                                <li>• Hindari informasi personal</li>
                                <li>• Gunakan password yang unik</li>
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
                        alt="Reset Password"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-r-3xl"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ED8002]/20 to-transparent rounded-r-3xl" />
                    {/* Text overlay */}
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                        <h2 className="text-2xl font-bold mb-2">Buat Password Baru</h2>
                        <p className="text-white/90">
                            Pilih password yang kuat untuk keamanan akun Anda
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
