"use client"

import React, { useState, useRef } from 'react'

import { useAuth } from '@/utils/context/AuthContext'

import { Card, CardHeader, CardContent } from '@/components/ui/card'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

import { Badge } from '@/components/ui/badge'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'

import { Label } from '@/components/ui/label'

import { Skeleton } from '@/components/ui/skeleton'

import { User, Lock, Save, Edit, X, Camera, Eye, EyeOff } from 'lucide-react'

import { supabase } from '@/utils/supabase/supabase'

import imagekitInstance from '@/utils/imagekit/imagekit'

import toast from 'react-hot-toast'

import ProfileSkeleton from "@/hooks/dashboard/profile/ProfileSkelaton"

export default function ProfileLayout() {
    const { user, profile, loading, changePassword, signOut } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [isEditingPassword, setIsEditingPassword] = useState(false)
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: ''
    })
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Initialize form data when profile loads
    React.useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                email: profile.email || user?.email || '',
                phone: profile.phone || ''
            })
        }
    }, [profile, user])

    if (loading) {
        return (
            <ProfileSkeleton />
        )
    }

    if (!user || !profile) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-muted-foreground">Profile tidak ditemukan</h2>
                    <p className="text-sm text-muted-foreground">Silakan login untuk melihat profile Anda</p>
                </div>
            </div>
        )
    }

    // Format created_at date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            toast.error('Format file tidak didukung. Gunakan JPG, PNG, atau WebP')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Ukuran file terlalu besar. Maksimal 5MB')
            return
        }

        setIsUploadingPhoto(true)
        try {
            // Convert file to base64
            const reader = new FileReader()
            const base64Promise = new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string)
                reader.onerror = reject
                reader.readAsDataURL(file)
            })
            const base64 = await base64Promise

            // Upload to ImageKit using the same approach as useManagementKakaksaku
            const result = await imagekitInstance.upload({
                file: base64,
                fileName: `profile-${user.id}-${Date.now()}`,
                folder: `/profiles/${user.id}`,
                useUniqueFileName: false,
                tags: ['profile', 'user'],
                responseFields: ['url', 'fileId', 'name']
            })

            if (!result || !result.url) {
                throw new Error('Failed to upload image')
            }

            // Update profile in database
            const { error } = await supabase
                .from(process.env.NEXT_PUBLIC_PROFILES as string)
                .update({
                    photo_url: result.url,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)

            if (error) {
                toast.error('Gagal memperbarui photo profile: ' + error.message)
                return
            }

            toast.success('Photo profile berhasil diperbarui!')
            // Refresh the page to show new photo
            window.location.reload()
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Terjadi kesalahan saat mengupload photo')
        } finally {
            setIsUploadingPhoto(false)
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    const handleSaveProfile = async () => {
        if (!user) return

        setIsSubmitting(true)
        try {
            const { error } = await supabase
                .from(process.env.NEXT_PUBLIC_PROFILES as string)
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)

            if (error) {
                toast.error('Gagal memperbarui profile: ' + error.message)
                return
            }

            toast.success('Profile berhasil diperbarui!')
            setIsEditing(false)
        } catch (error) {
            toast.error('Terjadi kesalahan saat memperbarui profile')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Password baru dan konfirmasi password tidak cocok')
            return
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password minimal 6 karakter')
            return
        }

        setIsSubmitting(true)
        try {
            const success = await changePassword(passwordData.newPassword)
            if (success) {
                toast.success('Password berhasil diubah! Anda akan logout dalam 3 detik...')

                // Reset form
                setIsEditingPassword(false)
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })

                // Logout after 3 seconds
                setTimeout(async () => {
                    await signOut()
                }, 3000)
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat mengubah password')
        } finally {
            setIsSubmitting(false)
        }
    }

    const cancelEdit = () => {
        setIsEditing(false)
        setFormData({
            full_name: profile.full_name || '',
            email: profile.email || user?.email || '',
            phone: profile.phone || ''
        })
    }

    const cancelPasswordEdit = () => {
        setIsEditingPassword(false)
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        })
        setShowNewPassword(false)
        setShowConfirmPassword(false)
    }

    return (
        <section className="space-y-6">
            {/* Profile Header */}
            <Card className="flex flex-col md:flex-row items-center gap-6 p-6">
                <div className="relative">
                    <Avatar className="w-20 h-20">
                        {profile.photo_url ? (
                            <AvatarImage src={profile.photo_url} alt={profile.full_name} />
                        ) : (
                            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                                {profile.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <Button
                        size="sm"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                        onClick={triggerFileInput}
                        disabled={isUploadingPhoto}
                    >
                        {isUploadingPhoto ? (
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Camera className="w-4 h-4" />
                        )}
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold truncate">{profile.full_name || 'Nama tidak tersedia'}</h2>
                    <p className="text-muted-foreground truncate">{profile.email || user.email}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge variant="secondary" className="capitalize">
                            {profile.role || 'user'}
                        </Badge>
                        {profile.created_at && (
                            <Badge variant="outline">
                                Bergabung: {formatDate(profile.created_at)}
                            </Badge>
                        )}
                    </div>
                </div>
            </Card>

            {/* Profile Information Form */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        <h3 className="font-semibold text-lg">Informasi Profile</h3>
                    </div>
                    {!isEditing ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelEdit}
                                disabled={isSubmitting}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Batal
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSaveProfile}
                                disabled={isSubmitting}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Nama Lengkap</Label>
                            <Input
                                id="full_name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Masukkan nama lengkap"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                disabled={true} // Email tidak bisa diubah
                                placeholder="Masukkan email"
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Masukkan nomor telepon"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Password Change Form */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        <h3 className="font-semibold text-lg">Ubah Password</h3>
                    </div>
                    {!isEditingPassword ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditingPassword(true)}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Password
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelPasswordEdit}
                                disabled={isSubmitting}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Batal
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleChangePassword}
                                disabled={isSubmitting}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSubmitting ? 'Menyimpan...' : 'Simpan Password'}
                            </Button>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    {isEditingPassword ? (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Password Baru</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Masukkan password baru"
                                        className="pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Konfirmasi password baru"
                                        className="pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Lock className="w-4 h-4" />
                            <span>Password Anda aman</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    )
}
