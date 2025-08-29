"use client"

import React, { useEffect, useState } from 'react'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

import { supabase } from '@/utils/supabase/supabase'

import { HandPlatter, DollarSign, CreditCard, TrendingUp, Gift } from 'lucide-react'

import Image from 'next/image'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

import { useAuth } from '@/utils/context/AuthContext'
import type { Donasi } from '@/interface/donasi'

import DashboardSkeleton from "@/hooks/dashboard/DashboardSkeleton"

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
)

interface DonasiTransaction {
    id: string;
    order_id: string;
    donasi_id: number;
    name: string;
    email: string;
    photo_url?: string;
    image_url: string;
    amount: number;
    status: string;
    payment_type?: string;
    transaction_time?: string;
    midtrans_response?: string;
    created_at?: string;
}

interface KakasakuTransaction {
    id: string;
    order_id: string;
    kaka_saku_id: number;
    name: string;
    email: string;
    photo_url?: string;
    image_url: string;
    amount: number;
    status: string;
    payment_type?: string;
    transaction_time?: string;
    midtrans_response?: string;
    created_at?: string;
}

interface KakaSaku {
    id: number;
    title: string;
    slug: string;
    description?: string;
    image_url?: string;
    kakaksaku: number;
    share: number;
    target_amount: number;
    current_amount: number;
    status: "open" | "closed";
    deadline?: string;
    created_at: string;
    message_template?: string;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true)
    const [currentTime, setCurrentTime] = useState(new Date())
    const [donasiTransactions, setDonasiTransactions] = useState<DonasiTransaction[]>([])
    const [kakasakuTransactions, setKakasakuTransactions] = useState<KakasakuTransaction[]>([])
    const [kakasakuData, setKakasakuData] = useState<KakaSaku[]>([])
    const [donationsData, setDonationsData] = useState<Donasi[]>([])
    const [donasiStats, setDonasiStats] = useState({
        total: 0,
        totalAmount: 0,
        pending: 0,
        completed: 0,
        failed: 0
    })
    const [kakasakuStats, setKakasakuStats] = useState({
        total: 0,
        totalAmount: 0,
        pending: 0,
        completed: 0,
        failed: 0
    })

    useEffect(() => {
        const fetchData = async () => {
            try {

                // Fetch donasi transactions
                const { data: donasiData, error: donasiError } = await supabase
                    .from(process.env.NEXT_PUBLIC_DONASI_TRANSACTION as string)
                    .select('*')
                    .eq('status', 'settlement')
                    .order('transaction_time', { ascending: false })
                    .limit(10)

                if (!donasiError && donasiData) {
                    setDonasiTransactions(donasiData)
                    calculateDonasiStats(donasiData)
                }

                // Fetch kakasaku transactions
                const { data: kakasakuData, error: kakasakuError } = await supabase
                    .from(process.env.NEXT_PUBLIC_KAKASAKU_TRANSACTION as string)
                    .select('*')
                    .eq('status', 'settlement')
                    .order('transaction_time', { ascending: false })
                    .limit(10)

                if (!kakasakuError && kakasakuData) {
                    setKakasakuTransactions(kakasakuData)
                    calculateKakasakuStats(kakasakuData)
                }

                // Fetch kakasaku data (only open status)
                const { data: kakasakuDataList, error: kakasakuListError } = await supabase
                    .from(process.env.NEXT_PUBLIC_KAKA_SAKU as string)
                    .select('*')
                    .eq('status', 'open')
                    .order('created_at', { ascending: false })
                    .limit(10)

                if (!kakasakuListError && kakasakuDataList) {
                    setKakasakuData(kakasakuDataList)
                }

                // Fetch donations data (only open status)
                const { data: donationsDataList, error: donationsListError } = await supabase
                    .from(process.env.NEXT_PUBLIC_DONATIONS as string)
                    .select('*')
                    .eq('status', 'open')
                    .order('created_at', { ascending: false })
                    .limit(10)

                if (!donationsListError && donationsDataList) {
                    setDonationsData(donationsDataList)
                }

            } catch (error) {
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [user?.id])

    const calculateDonasiStats = (transactions: DonasiTransaction[]) => {
        const stats = {
            total: transactions.length,
            totalAmount: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
            pending: 0, // All are success
            completed: transactions.length, // All are success
            failed: 0 // No failed transactions shown
        }
        setDonasiStats(stats)
    }

    const calculateKakasakuStats = (transactions: KakasakuTransaction[]) => {
        const stats = {
            total: transactions.length,
            totalAmount: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
            pending: 0, // All are success
            completed: transactions.length, // All are success
            failed: 0 // No failed transactions shown
        }
        setKakasakuStats(stats)
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    if (loading) {
        return (
            <DashboardSkeleton />
        )
    }

    return (
        <section className='pb-10'>
            {/* Transaction Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                {/* Donasi Transactions Card */}
                <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-300">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-base sm:text-lg font-semibold">Success Donasi Transactions</h2>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-xs sm:text-sm font-medium text-blue-600 mb-1">Total Success</h3>
                            <p className="text-xl sm:text-2xl font-bold text-blue-700">{donasiStats.total}</p>
                        </div>

                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-xs sm:text-sm font-medium text-blue-600 mb-1">Total Amount</h3>
                            <p className="text-base sm:text-lg font-semibold text-blue-700">
                                {formatCurrency(donasiStats.totalAmount)}
                            </p>
                        </div>

                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-xs sm:text-sm font-medium text-blue-600 mb-1">Status</h3>
                            <div className="flex gap-2">
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">✓ {donasiStats.completed} Success</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kakasaku Transactions Card */}
                <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-300">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-base sm:text-lg font-semibold">Success Kakasaku Transactions</h2>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-xs sm:text-sm font-medium text-green-600 mb-1">Total Success</h3>
                            <p className="text-xl sm:text-2xl font-bold text-green-700">{kakasakuStats.total}</p>
                        </div>

                        <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-xs sm:text-sm font-medium text-green-600 mb-1">Total Amount</h3>
                            <p className="text-base sm:text-lg font-semibold text-green-700">
                                {formatCurrency(kakasakuStats.totalAmount)}
                            </p>
                        </div>

                        <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-xs sm:text-sm font-medium text-green-600 mb-1">Status</h3>
                            <div className="flex gap-2">
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">✓ {kakasakuStats.completed} Success</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Combined Statistics Card */}
                <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-300">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-base sm:text-lg font-semibold">Combined Overview</h2>
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-xs sm:text-sm font-medium text-purple-600 mb-1">Total Transactions</h3>
                            <p className="text-xl sm:text-2xl font-bold text-purple-700">{donasiStats.total + kakasakuStats.total}</p>
                        </div>

                        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-xs sm:text-sm font-medium text-purple-600 mb-1">Total Revenue</h3>
                            <p className="text-base sm:text-lg font-semibold text-purple-700">
                                {formatCurrency(donasiStats.totalAmount + kakasakuStats.totalAmount)}
                            </p>
                        </div>

                        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-xs sm:text-sm font-medium text-purple-600 mb-1">Success Rate</h3>
                            <p className="text-base sm:text-lg font-semibold text-purple-700">
                                {donasiStats.total + kakasakuStats.total > 0
                                    ? Math.round(((donasiStats.completed + kakasakuStats.completed) / (donasiStats.total + kakasakuStats.total)) * 100)
                                    : 0}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-300">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-base sm:text-lg font-semibold">Success Transactions Overview</h2>
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <HandPlatter className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        <div className="bg-orange-50 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-xs sm:text-sm font-medium text-orange-600 mb-1">Total Success</h3>
                            <p className="text-xl sm:text-2xl font-bold text-orange-700">{donasiStats.total + kakasakuStats.total}</p>
                        </div>

                        <div className="bg-orange-50 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-xs sm:text-sm font-medium text-orange-600 mb-1">Total Revenue</h3>
                            <p className="text-base sm:text-lg font-semibold text-orange-700">{formatCurrency(donasiStats.totalAmount + kakasakuStats.totalAmount)}</p>
                        </div>

                        <div className="bg-orange-50 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-xs sm:text-sm font-medium text-orange-600 mb-1">Last Updated</h3>
                            <p className="text-base sm:text-lg font-semibold text-orange-700">
                                {currentTime.toLocaleDateString('id-ID')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Recent Donasi Transactions */}
                <div className="bg-white rounded-xl border border-gray-300 p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-blue-500" />
                        Recent Success Donasi Transactions
                    </h2>
                    <div className="space-y-3">
                        {donasiTransactions.length > 0 ? (
                            donasiTransactions.slice(0, 5).map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span className="text-sm font-semibold text-blue-600">
                                                {transaction.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{transaction.name}</p>
                                            <p className="text-xs text-gray-500">{transaction.transaction_time ? formatDate(transaction.transaction_time) : 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-sm">{formatCurrency(transaction.amount)}</p>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Success</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <DollarSign className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No success donasi transactions yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Kakasaku Transactions */}
                <div className="bg-white rounded-xl border border-gray-300 p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-green-500" />
                        Recent Success Kakasaku Transactions
                    </h2>
                    <div className="space-y-3">
                        {kakasakuTransactions.length > 0 ? (
                            kakasakuTransactions.slice(0, 5).map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                            <span className="text-sm font-semibold text-green-600">
                                                {transaction.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{transaction.name}</p>
                                            <p className="text-xs text-gray-500">{transaction.transaction_time ? formatDate(transaction.transaction_time) : 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-sm">{formatCurrency(transaction.amount)}</p>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Success</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <CreditCard className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No success kakasaku transactions yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* Kakasaku Data Cards */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-purple-500" />
                    Kakasaku Data
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {kakasakuData.length > 0 ? (
                        kakasakuData.map((item) => {
                            const progress = item.target_amount > 0 ? (item.current_amount / item.target_amount) * 100 : 0;
                            return (
                                <Card key={item.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-base line-clamp-2">{item.title}</CardTitle>
                                                <CardDescription className="text-xs text-gray-500 mt-1">
                                                    {item.slug}
                                                </CardDescription>
                                            </div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'open'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {item.status === 'open' ? 'Open' : 'Closed'}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    {item.image_url && (
                                        <div className="px-6 -mt-2 mb-4">
                                            <div className="w-full aspect-[16/9] rounded-lg overflow-hidden relative">
                                                <Image
                                                    src={item.image_url}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Target:</span>
                                            <span className="font-semibold text-sm">{formatCurrency(item.target_amount)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Current:</span>
                                            <span className="font-semibold text-sm text-blue-600">{formatCurrency(item.current_amount)}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>Progress</span>
                                                <span>{progress.toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t border-gray-100">
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>Deadline:</span>
                                                <span>{item.deadline ? formatDate(item.deadline) : 'No deadline'}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                                                <span>Created:</span>
                                                <span>{formatDate(item.created_at)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="col-span-full">
                            <Card className="text-center py-12">
                                <Gift className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p className="text-gray-500">No kakasaku data available</p>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            {/* Donations Data Cards */}
            <div className="mb-6">
                <div className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Donations Data
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {donationsData.length > 0 ? (
                        donationsData.map((item) => {
                            const progress = item.target_amount > 0 ? (item.current_amount / item.target_amount) * 100 : 0;
                            return (
                                <Card key={item.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-base line-clamp-2">{item.title}</CardTitle>
                                                <CardDescription className="text-xs text-gray-500 mt-1">
                                                    {item.slug}
                                                </CardDescription>
                                            </div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'open'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {item.status === 'open' ? 'Open' : 'Closed'}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    {item.image_url && (
                                        <div className="px-6 -mt-2 mb-4">
                                            <div className="w-full aspect-[16/9] rounded-lg overflow-hidden relative">
                                                <Image
                                                    src={item.image_url}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Target:</span>
                                            <span className="font-semibold text-sm">{formatCurrency(item.target_amount)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Current:</span>
                                            <span className="font-semibold text-sm text-green-600">{formatCurrency(item.current_amount)}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>Progress</span>
                                                <span>{progress.toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t border-gray-100">
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>Deadline:</span>
                                                <span>{item.deadline ? formatDate(item.deadline) : 'No deadline'}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                                                <span>Created:</span>
                                                <span>{formatDate(item.created_at)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="col-span-full">
                            <Card className="text-center py-12">
                                <DollarSign className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p className="text-gray-500">No donations data available</p>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}