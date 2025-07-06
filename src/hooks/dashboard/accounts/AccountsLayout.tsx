"use client"

import React, { useEffect, useState } from 'react'

import { ChevronRight, Search, Users, Mail, Phone, Calendar, Eye, Edit, Trash2 } from "lucide-react"

import { supabase } from '@/utils/supabase/supabase'

import { Profile } from '@/interface/profile'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'

import { Badge } from '@/components/ui/badge'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { format } from 'date-fns'

import { id } from 'date-fns/locale'

import AccountsSkeleton from "@/hooks/dashboard/accounts/AccountsSkelaton"

export default function AccountsLayout() {
    const [users, setUsers] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
    const [viewModalOpen, setViewModalOpen] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from(process.env.NEXT_PUBLIC_PROFILES as string)
                .select('*')
                .eq('role', 'user')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching users:', error)
                return
            }

            setUsers(data || [])
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    )

    const handleViewUser = (user: Profile) => {
        setSelectedUser(user)
        setViewModalOpen(true)
    }

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
                        <div className="text-2xl font-bold">{users.filter(u => u.email).length}</div>
                        <p className="text-xs text-muted-foreground">
                            Pengguna dengan email
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
                                                    <Badge variant="secondary" className="text-xs capitalize">
                                                        {user.role}
                                                    </Badge>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewUser(user)}
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                    </Button>
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
                                                            <div className="text-sm text-muted-foreground">ID: {user.id}</div>
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
                                                    <Badge variant="secondary" className="capitalize">
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewUser(user)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
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

            {/* View User Modal */}
            <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Detail Pengguna</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    {selectedUser.photo_url ? (
                                        <AvatarImage src={selectedUser.photo_url} alt={selectedUser.full_name} />
                                    ) : (
                                        <AvatarFallback className="bg-primary/10 text-primary text-lg">
                                            {selectedUser.full_name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold">{selectedUser.full_name || 'Nama tidak tersedia'}</h3>
                                    <p className="text-sm text-muted-foreground">{selectedUser.email || 'Email tidak tersedia'}</p>
                                    <Badge variant="secondary" className="mt-1 capitalize">
                                        {selectedUser.role}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {selectedUser.phone || 'Telepon tidak tersedia'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        Bergabung: {formatDate(selectedUser.created_at)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        Diperbarui: {formatDate(selectedUser.updated_at)}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <p className="text-xs text-muted-foreground">
                                    ID Pengguna: {selectedUser.id}
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    )
}
