"use client"

import React, { useState } from 'react'

import coffeImage from "@/base/assets/login.png"

import Image from 'next/image'

import { Label } from "@/components/ui/label"

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"

import { Eye, EyeOff, Phone, Mail, User, Lock } from 'lucide-react'

import { useAuth } from '@/utils/context/AuthContext'

import toast from 'react-hot-toast'

export default function SignupLayout() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const { signUp } = useAuth()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            setLoading(false)
            return
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long')
            setLoading(false)
            return
        }

        await signUp(formData.email, formData.password, formData.fullName, formData.phone)
        setLoading(false)
    }

    return (
        <section className="min-h-screen flex flex-col md:flex-row">
            {/* Kiri: Formulir Daftar */}
            <div className="order-2 md:order-1 flex flex-col justify-center md:w-1/2 w-full px-8 md:px-24 py-12">
                <div className="mb-10">
                    <h1 className="text-4xl font-semibold mb-2">Buat Akun</h1>
                    <p className=" mb-8">Bergabunglah bersama kami dan mulai perjalanan jakartamengabdi!</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="fullName">Nama Lengkap</Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="Budi Santoso"
                                    required
                                    className="mt-2 pl-10 bg-white"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <User size={20} />
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email">Email Anda</Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="anda@email.com"
                                    required
                                    className="mt-2 pl-10 bg-white"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail size={20} />
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="phone">Nomor Telepon</Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="08xxxxxxxxxx"
                                    required
                                    className="mt-2 pl-10 bg-white"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Phone size={20} />
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password">Kata Sandi</Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="mt-2 pl-10 bg-white"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock size={20} />
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    className="mt-2 pl-10 bg-white"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock size={20} />
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-[#ED8002] hover:bg-[#ED8002] nt-semibold text-lg py-2 rounded shadow cursor-pointer"
                            disabled={loading}
                        >
                            {loading ? 'Membuat Akun...' : 'Buat Akun'}
                        </Button>
                        <p className=" text-sm text-center">
                            Sudah punya akun? <a href="/signin" className="text-[#ED8002] hover:underline">Masuk di sini</a>
                        </p>
                    </form>
                </div>
            </div>

            {/* Kanan: Gambar */}
            <div className="order-1 md:order-2 mb-4 md:mb-0 flex md:w-1/2 items-center justify-center">
                <div className="relative w-full h-full min-h-[450px] md:min-h-[500px]">
                    <Image src={coffeImage} alt="Daftar" layout="fill" objectFit="cover" className="rounded-l-3xl" />
                </div>
            </div>
        </section>
    )
}