"use client"

import React, { useEffect, useState } from 'react';

import { useAuth } from '@/utils/context/AuthContext';

import { supabase } from '@/utils/supabase/supabase';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

import { Input } from '@/components/ui/input';

import { Search } from 'lucide-react';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import ImagePlaceholder from '@/base/helper/ImagePlaceholder';

import ViewModal from '@/hooks/profile/donasi/donasi/modal/ViewModal';

import DonasiSkelaton from "@/hooks/profile/donasi/donasi/DonasiSkelaton"

interface DonasiTransaction {
    id: number;
    order_id: string;
    name: string;
    email: string;
    photo_url?: string;
    image_url: string;
    amount: number;
    status: string;
    payment_type?: string;
    transaction_time?: string;
    midtrans_response?: string;
}

export default function Page() {
    const { profile } = useAuth();
    const [transactions, setTransactions] = useState<DonasiTransaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [modalContent, setModalContent] = useState<any>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!profile?.email) return;
            setLoading(true);
            const { data, error } = await supabase
                .from(process.env.NEXT_PUBLIC_DONASI_TRANSACTION as string)
                .select('*')
                .eq('email', profile.email)
                .order('transaction_time', { ascending: false });
            if (!error && data) setTransactions(data);
            setLoading(false);
        };
        fetchTransactions();
    }, [profile?.email]);

    const handleViewMore = (midtrans_response: any) => {
        let resp: any = midtrans_response;
        if (typeof resp === 'string') {
            try { resp = JSON.parse(resp); } catch { /* ignore */ }
        }
        setModalContent(resp);
        setOpenModal(true);
    };

    // Helper to render status badge and icon
    const getStatusBadge = (status: string) => {
        let color: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
        let icon = (
            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
        );
        let displayStatus = status;
        if (status === 'settlement') {
            displayStatus = 'success';
        }
        if (status === 'settlement' || status === 'capture' || status === 'success') {
            color = 'default';
            icon = (
                <svg className="w-4 h-4 inline-block mr-1 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            );
        } else if (status === 'pending') {
            color = 'secondary';
            icon = (
                <svg className="w-4 h-4 inline-block mr-1 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
            );
        } else if (status === 'expire' || status === 'cancel' || status === 'deny' || status === 'failure') {
            color = 'destructive';
            icon = (
                <svg className="w-4 h-4 inline-block mr-1 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            );
        }
        return (
            <Badge variant={color} className="flex items-center gap-1 px-2 py-1">
                {icon}{displayStatus}
            </Badge>
        );
    };

    // Filter transactions by status and search
    const filteredTransactions = transactions.filter(trx => {
        const matchesStatus = statusFilter === 'all'
            ? true
            : statusFilter === 'success'
                ? ['settlement', 'capture', 'success'].includes(trx.status)
                : trx.status === 'pending';
        const matchesSearch =
            trx.name.toLowerCase().includes(search.toLowerCase()) ||
            trx.order_id.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <section>
            <h2 className="text-2xl md:text-4xl font-extrabold mb-8 text-primary tracking-tight text-center md:text-left">Semua Data Transaksi Donasi Anda</h2>
            <div className="mb-8 w-full flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <div className="relative w-full md:w-96">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search className="w-5 h-5" />
                    </span>
                    <Input
                        type="text"
                        placeholder="Cari transaksi berdasarkan nama atau Order ID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl shadow focus:border-primary focus:ring-2 focus:ring-primary/20 transition placeholder:text-gray-400 text-base"
                    />
                </div>
                <Select
                    value={statusFilter}
                    onValueChange={value => setStatusFilter(value)}
                >
                    <SelectTrigger className="w-full md:w-56 h-14 bg-white border border-gray-200 rounded-2xl shadow focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-base">
                        <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="success">Berhasil</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {loading ? (
                <DonasiSkelaton />
            ) : filteredTransactions.length === 0 ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <p className="text-gray-400 text-lg">Tidak ada transaksi ditemukan.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredTransactions.map((trx) => {
                        return (
                            <Card key={trx.id} className="rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 bg-white flex flex-col min-h-[440px] p-0 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-auto">
                                {/* Image Banner */}
                                {trx.image_url ? (
                                    <div className="w-full h-56 rounded-t-3xl overflow-hidden bg-gray-50 border-b border-gray-100 flex items-center justify-center relative">
                                        <img
                                            src={trx.image_url}
                                            alt="Bukti Transfer"
                                            className="object-cover w-full h-full"
                                        />
                                        <div className="absolute bottom-4 left-4 z-10">
                                            {getStatusBadge(trx.status)}
                                        </div>
                                        <div className="absolute bottom-4 right-4 z-10">
                                            <span className="text-xs bg-white/80 rounded px-2 py-1 shadow">
                                                {trx.transaction_time ? new Date(trx.transaction_time).toLocaleString() : '-'}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-56 rounded-t-3xl overflow-hidden bg-gray-50 border-b border-gray-100 flex items-center justify-center relative">
                                        <ImagePlaceholder className="w-full h-full" />
                                        <div className="absolute bottom-4 left-4 z-10">
                                            {getStatusBadge(trx.status)}
                                        </div>
                                        <div className="absolute bottom-4 right-4 z-10">
                                            <span className="text-xs  bg-white/80 rounded px-2 py-1 shadow">
                                                {trx.transaction_time ? new Date(trx.transaction_time).toLocaleString() : '-'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <CardContent className="flex flex-col gap-4 px-6 pb-2">
                                    {/* User Info */}
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-14 h-14 border-2 border-primary/30 shadow-md">
                                            {trx.photo_url ? (
                                                <AvatarImage src={trx.photo_url} alt={trx.name} />
                                            ) : (
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">{trx.name?.charAt(0) || '?'}</AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-semibold text-gray-800 text-base">{trx.name}</span>
                                            <span className="text-xs text-gray-500">{trx.email}</span>
                                        </div>
                                    </div>
                                    {/* Transaction Info */}
                                    <div className="flex flex-col gap-1 mt-2">
                                        <span className="text-md font-extrabold text-primary">Rp {trx.amount.toLocaleString()}</span>
                                        <span className="text-sm text-gray-600">Payment Type: <span className="font-semibold text-gray-800">{trx.payment_type || '-'}</span></span>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-2 px-6 pb-6 pt-2 mt-auto">
                                    {trx.midtrans_response ? (
                                        <Button
                                            variant="outline"
                                            className="w-full rounded-xl h-12 text-base font-semibold text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-900"
                                            onClick={() => handleViewMore(trx.midtrans_response)}
                                        >
                                            Lihat Detail
                                        </Button>
                                    ) : (
                                        <span className="text-gray-300 text-xs text-center w-full">Tidak ada detail</span>
                                    )}
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}
            <ViewModal open={openModal} onOpenChange={setOpenModal} modalContent={modalContent} />
        </section>
    );
}

