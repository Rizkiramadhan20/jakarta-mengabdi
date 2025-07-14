"use client"

import React from 'react'

import { Card, CardHeader, CardContent } from '@/components/ui/card'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

import { Badge } from '@/components/ui/badge'

import { useAuth } from '@/utils/context/AuthContext'

import imagekitInstance from '@/utils/imagekit/imagekit';

import { supabase } from '@/utils/supabase/supabase';

import { useState, useRef } from 'react';

import toast from 'react-hot-toast';

export default function Profile() {
    const { profile, loading, user, changePassword, signOut } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [phone, setPhone] = useState(profile?.phone || '');
    const [newPassword, setNewPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!profile) {
        return <div>Profile not found</div>;
    }

    const handleEditPhoto = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Validasi tipe dan ukuran file
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Format file tidak didukung. Gunakan JPG, PNG, atau WebP');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Ukuran file terlalu besar. Maksimal 5MB');
            return;
        }
        setIsUploading(true);
        try {
            // Convert file to base64
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            const base64 = await base64Promise;
            // Upload ke ImageKit
            const result = await imagekitInstance.upload({
                file: base64,
                fileName: `profile-${profile.id || profile.email}-${Date.now()}`,
                folder: '/profiles',
            });
            if (!result || !result.url) {
                throw new Error('Gagal upload foto');
            }
            // Update photo_url di Supabase
            const { error } = await supabase
                .from(process.env.NEXT_PUBLIC_PROFILES as string)
                .update({ photo_url: result.url })
                .eq('id', profile.id);
            if (error) {
                toast.error('Gagal update foto profil: ' + error.message);
                return;
            }
            toast.success('Foto profil berhasil diperbarui!');
            window.location.reload();
        } catch (err) {
            toast.error('Terjadi kesalahan saat upload foto');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Update phone
            let phoneSuccess = true;
            if (phone !== profile?.phone) {
                const { error } = await supabase
                    .from(process.env.NEXT_PUBLIC_PROFILES as string)
                    .update({ phone })
                    .eq('id', profile?.id);
                if (error) {
                    toast.error('Gagal update nomor telepon: ' + error.message);
                    phoneSuccess = false;
                } else {
                    toast.success('Nomor telepon berhasil diperbarui!');
                }
            }
            // Update password jika diisi
            let passwordSuccess = true;
            if (newPassword) {
                const result = await changePassword(newPassword);
                if (result) {
                    toast.success('Password berhasil diubah! Silakan login ulang.');
                    setNewPassword('');
                    await signOut();
                    window.location.href = '/signin';
                    return;
                } else {
                    toast.error('Gagal mengubah password!');
                    passwordSuccess = false;
                }
            }
            if (phoneSuccess && passwordSuccess) {
                setIsEditing(false);
                window.location.reload();
            }
        } catch (err) {
            toast.error('Terjadi kesalahan saat menyimpan perubahan');
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setPhone(profile?.phone || '');
        setNewPassword('');
    };

    // Format tanggal
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-8">
            <Card className="flex flex-col md:flex-row items-center gap-8 p-8 shadow-lg rounded-2xl bg-white/90 dark:bg-zinc-900/80 border-0">
                <div className="relative group">
                    <Avatar className="w-28 h-28 shadow-md border-4 border-primary/20">
                        {profile.photo_url ? (
                            <AvatarImage src={profile.photo_url} alt={profile.full_name} />
                        ) : (
                            <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                                {profile.full_name?.charAt(0)}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <button
                        type="button"
                        onClick={handleEditPhoto}
                        className="absolute bottom-2 right-2 bg-primary text-white rounded-full p-2 shadow-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/50 transition group-hover:scale-110 disabled:opacity-60"
                        disabled={isUploading}
                        title="Edit Foto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6" /></svg>
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handlePhotoChange}
                        disabled={isUploading}
                    />
                    {isUploading && <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-zinc-900/80 rounded-full"><span className="text-xs text-primary animate-pulse">Uploading...</span></div>}
                </div>
                <div className="flex-1 min-w-0 text-center md:text-left space-y-2">
                    <h2 className="text-3xl font-bold truncate">{profile.full_name}</h2>
                    <p className="text-muted-foreground truncate text-base">{profile.email}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                        <Badge variant="secondary" className="text-sm px-3 py-1">{profile.role}</Badge>
                        <Badge variant="outline" className="text-sm px-3 py-1">{profile.phone}</Badge>
                        <Badge variant="outline" className="text-sm px-3 py-1">Bergabung: {profile.created_at?.slice(0, 10)}</Badge>
                    </div>
                </div>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="rounded-2xl shadow-md border-0 bg-white/90 dark:bg-zinc-900/80">
                    <CardHeader>
                        <h3 className="font-semibold text-lg">Aktifitas</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 text-base">
                            <div className="flex items-center gap-2">
                                {/* SVG Clock Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span className="font-medium">Terakhir login:</span>
                                <span className="truncate">{formatDate(user?.last_sign_in_at)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* SVG Calendar Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <span className="font-medium">Akun dibuat:</span>
                                <span className="truncate">{formatDate(user?.created_at)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl shadow-md border-0 bg-white/90 dark:bg-zinc-900/80">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <h3 className="font-semibold text-lg">Ubah Password & Nomor Telepon</h3>
                        {!isEditing ? (
                            <button
                                type="button"
                                className="text-primary underline text-sm hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                                onClick={handleEdit}
                            >
                                Edit
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="text-muted-foreground underline text-sm hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                                onClick={handleCancel}
                                disabled={isSaving}
                            >
                                Batal
                            </button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col gap-6" onSubmit={handleSave}>
                            <div>
                                <label className="block text-sm font-medium mb-2">Nomor Telepon</label>
                                <input
                                    type="text"
                                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition text-base bg-white dark:bg-zinc-800"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    disabled={!isEditing || isSaving}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Password Baru</label>
                                <input
                                    type="password"
                                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition text-base bg-white dark:bg-zinc-800"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="Kosongkan jika tidak ingin mengubah password"
                                    disabled={!isEditing || isSaving}
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                disabled={!isEditing || isSaving}
                            >
                                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}