import React from 'react'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Label } from '@/components/ui/label'

import { Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'

import { Eye, EyeOff } from 'lucide-react'

type CreateFormData = {
    full_name: string
    email: string
    phone: string
    photo_url?: string
    password: string
    confirmPassword: string
}

type ModalFormProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    form: CreateFormData
    onFormChange: (field: string, value: string) => void
    showPassword: boolean
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>
    showConfirmPassword: boolean
    setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>
    onCancel: () => void
    onConfirm: () => void
    creating: boolean
}

export default function ModalForm({
    open,
    onOpenChange,
    form,
    onFormChange,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    onCancel,
    onConfirm,
    creating,
}: ModalFormProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Tambah Admin Baru</DialogTitle>
                    <DialogDescription>
                        Masukkan informasi admin baru. User ID akan dibuat otomatis. Password akan digunakan untuk autentikasi. Semua field wajib diisi kecuali foto profil.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="full_name">Nama Lengkap</Label>
                        <Input
                            id="full_name"
                            placeholder="Masukkan nama lengkap"
                            value={form.full_name}
                            onChange={(e) => onFormChange('full_name', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Masukkan email"
                            value={form.email}
                            onChange={(e) => onFormChange('email', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <Input
                            id="phone"
                            placeholder="Masukkan nomor telepon"
                            value={form.phone}
                            onChange={(e) => onFormChange('phone', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Masukkan password"
                                value={form.password}
                                onChange={(e) => onFormChange('password', e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Konfirmasi password"
                                value={form.confirmPassword}
                                onChange={(e) => onFormChange('confirmPassword', e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={creating}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={
                            creating ||
                            !form.full_name ||
                            !form.email ||
                            !form.phone ||
                            !form.password ||
                            !form.confirmPassword
                        }
                    >
                        {creating ? 'Membuat...' : 'Buat Admin'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
