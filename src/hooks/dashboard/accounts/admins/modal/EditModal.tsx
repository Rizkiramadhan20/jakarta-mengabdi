import React from 'react'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Label } from '@/components/ui/label'

import { Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'

import { Profile } from '@/interface/profile'

type EditType = 'status' | 'password'

type EditModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: Profile | null
    editType: EditType
    newPassword: string
    confirmPassword: string
    setNewPassword: (value: string) => void
    setConfirmPassword: (value: string) => void
    updating: boolean
    onCancel: () => void
    onConfirm: () => void
}

export default function EditModal({
    open,
    onOpenChange,
    user,
    editType,
    newPassword,
    confirmPassword,
    setNewPassword,
    setConfirmPassword,
    updating,
    onCancel,
    onConfirm,
}: EditModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {editType === 'status'
                            ? `${user?.is_active ? 'Nonaktifkan' : 'Aktifkan'} Pengguna`
                            : 'Ubah Password Pengguna'
                        }
                    </DialogTitle>
                    <DialogDescription>
                        {editType === 'status' ? (
                            <>
                                Apakah Anda yakin ingin{' '}
                                <span className="font-semibold">
                                    {user?.is_active ? 'menonaktifkan' : 'mengaktifkan'}
                                </span>{' '}
                                pengguna <span className="font-semibold">{user?.full_name || user?.email}</span>?
                            </>
                        ) : (
                            <>
                                Masukkan password baru untuk pengguna{' '}
                                <span className="font-semibold">{user?.full_name || user?.email}</span>.
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>

                {editType === 'password' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Password Baru</Label>
                            <Input
                                key={`newPassword-${user?.id}`}
                                id="newPassword"
                                type="password"
                                placeholder="Masukkan password baru"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                            <Input
                                key={`confirmPassword-${user?.id}`}
                                id="confirmPassword"
                                type="password"
                                placeholder="Konfirmasi password baru"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={updating}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={updating || (editType === 'password' && (!newPassword || !confirmPassword))}
                    >
                        {updating ? 'Mengubah...' : editType === 'status'
                            ? (user?.is_active ? 'Nonaktifkan' : 'Aktifkan')
                            : 'Ubah Password'
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
