"use client"

import React, { useState } from 'react'

import coffeImage from "@/base/assets/login.png"

import Image from 'next/image'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'

import { Label } from '@/components/ui/label'

import { Checkbox } from '@/components/ui/checkbox'

import { Eye, EyeOff } from 'lucide-react'

import { useAuth } from '@/utils/context/AuthContext'

export default function SigninLayout() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    })
    const { signIn } = useAuth()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }))
    }

    const handleCheckboxChange = (checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            remember: checked
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await signIn(formData.email, formData.password)
        } catch (error) {
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="min-h-screen flex flex-col md:flex-row bg-">
            {/* Left: Login Form */}
            <div className="order-2 md:order-1 flex flex-col justify-center md:w-1/2 w-full px-8 md:px-24 py-12">
                <div className="mb-10">
                    <h1 className="text-4xl font-semibold mb-2">Selamat Datang!</h1>
                    <p className="mb-8">Terima kasih sudah kembali!</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email" >Email Anda</Label>
                            </div>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                className="mt-2 bg-white border-gray-600  placeholder:text-gray-400 focus:border-[#ED8002] focus:ring-[#ED8002]"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password">Kata sandi</Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="mt-2 bg-white border-gray-600  placeholder:text-gray-400 focus:border-[#ED8002] focus:ring-[#ED8002] pr-10"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="remember"
                                    checked={formData.remember}
                                    onCheckedChange={handleCheckboxChange}
                                    className="text-[#ED8002] focus:ring-[#ED8002] data-[state=checked]:bg-[#ED8002] data-[state=checked]:border-[#ED8002] bg-white"
                                />
                                <Label htmlFor="remember">Ingat aku</Label>
                            </div>
                            <a href="/forgot-password" className="hover:underline">Lupa Kata Sandi?</a>
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#ED8002] hover:bg-[#ED8002]  font-semibold text-lg py-2 rounded shadow cursor-pointer"
                        >
                            {isLoading ? 'Loading...' : 'Login'}
                        </Button>
                        <p className="text-sm text-center">
                            Tidak memiliki akun? <a href="/signup" className="text-[#ED8002] hover:underline">Daftar di sini</a>
                        </p>
                    </form>
                </div>
            </div>

            {/* Right: Image */}
            <div className="order-1 md:order-2 mb-4 md:mb-0 flex md:w-1/2 items-center justify-center">
                <div className="relative w-full h-full min-h-[450px] md:min-h-[500px]">
                    <Image src={coffeImage} alt="Login" layout="fill" objectFit="cover" className="rounded-l-3xl" />
                </div>
            </div>
        </section>
    )
}