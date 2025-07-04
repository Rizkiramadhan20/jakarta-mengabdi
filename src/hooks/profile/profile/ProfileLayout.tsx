"use client"

import React from 'react'

import { Card, CardHeader, CardContent } from '@/components/ui/card'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

import { Badge } from '@/components/ui/badge'

import { ChartContainer } from '@/components/ui/chart'

import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer }
    from 'recharts'

const user = {
    full_name: 'Karlina Rizky',
    email: 'karlina@example.com',
    role: 'User',
    photo_url: '',
    phone: '+62 812-3456-7890',
    created_at: '2023-01-15',
}

const barData = [
    { name: 'Donasi', value: 12 },
    { name: 'Volunteer', value: 8 },
    { name: 'Kakak Saku', value: 5 },
]

const pieData = [
    { name: 'Selesai', value: 18 },
    { name: 'Tertunda', value: 4 },
    { name: 'Pending', value: 3 },
]

const COLORS = ['#6366f1', '#22d3ee', '#f59e42']

export default function Profile() {
    return (
        <div>
            <Card className="flex flex-col md:flex-row items-center gap-6 p-6">
                <Avatar className="w-20 h-20">
                    {user.photo_url ? (
                        <AvatarImage src={user.photo_url} alt={user.full_name} />
                    ) : (
                        <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                            {user.full_name.charAt(0)}
                        </AvatarFallback>
                    )}
                </Avatar>
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold truncate">{user.full_name}</h2>
                    <p className="text-muted-foreground truncate">{user.email}</p>
                    <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{user.role}</Badge>
                        <Badge variant="outline">{user.phone}</Badge>
                        <Badge variant="outline">Bergabung: {user.created_at}</Badge>
                    </div>
                </div>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <h3 className="font-semibold text-lg">Aktivitas</h3>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{ Donasi: { color: COLORS[0], label: 'Donasi' }, Volunteer: { color: COLORS[1], label: 'Volunteer' }, 'Kakak Saku': { color: COLORS[2], label: 'Kakak Saku' } }}>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={barData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Bar dataKey="value">
                                        {barData.map((entry, idx) => (
                                            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <h3 className="font-semibold text-lg">Status Transaksi</h3>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{ Selesai: { color: COLORS[0], label: 'Selesai' }, Tertunda: { color: COLORS[1], label: 'Tertunda' }, Pending: { color: COLORS[2], label: 'Pending' } }}>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                                        {pieData.map((entry, idx) => (
                                            <Cell key={`cell-pie-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}