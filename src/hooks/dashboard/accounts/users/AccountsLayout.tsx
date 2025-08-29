"use client"

import React from 'react'

import { ChevronRight, Search, Users, Mail, Phone, Calendar, Edit, Trash2, MoreHorizontal, Key, ToggleLeft, ToggleRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'

import { Badge } from '@/components/ui/badge'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import { Label } from '@/components/ui/label'

import { format } from 'date-fns'

import { id } from 'date-fns/locale'

import AccountsSkeleton from "@/hooks/dashboard/accounts/users/AccountsSkelaton"

import { useManagementAccounts } from '@/hooks/dashboard/accounts/users/lib/useManagementAccounts'

export default function AccountsLayout() {
    const {
        users,
        loading,
        searchTerm,
        setSearchTerm,
        deleteDialogOpen,
        setDeleteDialogOpen,
        userToDelete,
        deleting,
        filteredUsers,
        handleDeleteClick,
        handleDeleteConfirm,
        handleDeleteCancel,
        // Edit functionality
        editDialogOpen,
        setEditDialogOpen,
        userToEdit,
        editType,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        updating,
        handleEditClick,
        handleEditConfirm,
        handleEditCancel,
        handleEditDialogChange
    } = useManagementAccounts()

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd MMMM yyyy', { locale: id })
        } catch {
            return 'Invalid Date'
        }
    }

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border rounded-2xl border-border bg-card shadow-sm gap-4'>
                <div className='flex flex-col gap-3'>
                    <h3 className='text-2xl md:text-3xl font-bold'>
                        Manajemen Accounts
                    </h3>
                    <ol className='flex gap-2 items-center text-sm text-muted-foreground'>
                        <li className='flex items-center hover:text-primary transition-colors'>
                            <span>Dashboard</span>
                            <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
                        </li>
                        <li className='flex items-center text-primary font-medium'>
                            <span>Accounts</span>
                        </li>
                    </ol>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Akun pengguna terdaftar
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.filter(u => u.is_active).length}</div>
                        <p className="text-xs text-muted-foreground">
                            Pengguna aktif
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter(u => {
                                const userDate = new Date(u.created_at)
                                const now = new Date()
                                return userDate.getMonth() === now.getMonth() &&
                                    userDate.getFullYear() === now.getFullYear()
                            }).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Pendaftaran bulan ini
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Akun Pengguna</CardTitle>
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Cari berdasarkan nama, email, atau nomor telepon..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <AccountsSkeleton />
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {searchTerm ? 'Tidak ada pengguna yang ditemukan' : 'Belum ada pengguna terdaftar'}
                        </div>
                    ) : (
                        <>
                            {/* Card View for screens below xl */}
                            <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredUsers.map((user) => (
                                    <Card key={user.id} className="p-4">
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-12 w-12 flex-shrink-0">
                                                {user.photo_url ? (
                                                    <AvatarImage src={user.photo_url} alt={user.full_name} />
                                                ) : (
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        {user.full_name?.charAt(0) || 'U'}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-sm truncate">
                                                    {user.full_name || 'Nama tidak tersedia'}
                                                </h3>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {user.email || 'Email tidak tersedia'}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground truncate">
                                                        {user.phone || 'Telepon tidak tersedia'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDate(user.created_at)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-xs capitalize">
                                                            {user.role}
                                                        </Badge>
                                                        <Badge variant={user.is_active ? "default" : "destructive"} className="text-xs">
                                                            {user.is_active ? "Aktif" : "Nonaktif"}
                                                        </Badge>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEditClick(user, 'status')}>
                                                                <ToggleLeft className="mr-2 h-4 w-4" />
                                                                {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleEditClick(user, 'password')}>
                                                                <Key className="mr-2 h-4 w-4" />
                                                                Ubah Password
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteClick(user)}
                                                                className="text-destructive"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Table View for xl and above */}
                            <div className="hidden xl:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Pengguna</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Telepon</TableHead>
                                            <TableHead>Bergabung</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10">
                                                            {user.photo_url ? (
                                                                <AvatarImage src={user.photo_url} alt={user.full_name} />
                                                            ) : (
                                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                                    {user.full_name?.charAt(0) || 'U'}
                                                                </AvatarFallback>
                                                            )}
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{user.full_name || 'Nama tidak tersedia'}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                                        {user.email || 'Email tidak tersedia'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                                        {user.phone || 'Telepon tidak tersedia'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        {formatDate(user.created_at)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="capitalize">
                                                            {user.role}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={user.is_active ? "default" : "destructive"}>
                                                            {user.is_active ? "Aktif" : "Nonaktif"}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEditClick(user, 'status')}>
                                                                <ToggleLeft className="mr-2 h-4 w-4" />
                                                                {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleEditClick(user, 'password')}>
                                                                <Key className="mr-2 h-4 w-4" />
                                                                Ubah Password
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteClick(user)}
                                                                className="text-destructive"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus Pengguna</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus pengguna{' '}
                            <span className="font-semibold">{userToDelete?.full_name || userToDelete?.email}</span>?
                            <br />
                            <span className="text-destructive">
                                Tindakan ini tidak dapat dibatalkan.
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={handleDeleteCancel}
                            disabled={deleting}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            disabled={deleting}
                        >
                            {deleting ? 'Menghapus...' : 'Hapus Pengguna'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={handleEditDialogChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editType === 'status'
                                ? `${userToEdit?.is_active ? 'Nonaktifkan' : 'Aktifkan'} Pengguna`
                                : 'Ubah Password Pengguna'
                            }
                        </DialogTitle>
                        <DialogDescription>
                            {editType === 'status' ? (
                                <>
                                    Apakah Anda yakin ingin{' '}
                                    <span className="font-semibold">
                                        {userToEdit?.is_active ? 'menonaktifkan' : 'mengaktifkan'}
                                    </span>{' '}
                                    pengguna <span className="font-semibold">{userToEdit?.full_name || userToEdit?.email}</span>?
                                </>
                            ) : (
                                <>
                                    Masukkan password baru untuk pengguna{' '}
                                    <span className="font-semibold">{userToEdit?.full_name || userToEdit?.email}</span>.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    {editType === 'password' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Password Baru</Label>
                                <Input
                                    key={`newPassword-${userToEdit?.id}`}
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
                                    key={`confirmPassword-${userToEdit?.id}`}
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
                            onClick={handleEditCancel}
                            disabled={updating}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleEditConfirm}
                            disabled={updating || (editType === 'password' && (!newPassword || !confirmPassword))}
                        >
                            {updating ? 'Mengubah...' : editType === 'status'
                                ? (userToEdit?.is_active ? 'Nonaktifkan' : 'Aktifkan')
                                : 'Ubah Password'
                            }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    )
}
