"use client"

import React, { useEffect, useState } from 'react'

import { ChevronRight, Search, Eye, Calendar, Trash2, Download } from "lucide-react"

import { supabase } from '@/utils/supabase/supabase'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'

import { Badge } from '@/components/ui/badge'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { Calendar as CalendarComponent } from '@/components/ui/calendar'

import toast from 'react-hot-toast'

import { downloadTransactionPDF, downloadAllTransactionsPDF } from './pdf/Pdf'

import DeleteModal from '@/hooks/dashboard/kakasakutransaction/kakasakutransaction/modal/DeleteModal'

import ViewModal from '@/hooks/dashboard/kakasakutransaction/kakasakutransaction/modal/ViewModal'

import KakasakutransactionSkelaton from "@/hooks/dashboard/kakasakutransaction/kakasakutransaction/kakasakutransactionSkelaton"

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
}

export default function Kakasakutransaction() {
    const [transactions, setTransactions] = useState<KakasakuTransaction[]>([]);
    const [kakaSakuList, setKakaSakuList] = useState<KakaSaku[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [kakaSakuFilter, setKakaSakuFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<KakasakuTransaction | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingTransaction, setDeletingTransaction] = useState<KakasakuTransaction | null>(null);
    const [deleting, setDeleting] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchTransactions();
        fetchKakaSakuList();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from(process.env.NEXT_PUBLIC_KAKASAKU_TRANSACTION as string)
            .select('*')
            .order('transaction_time', { ascending: false });

        if (!error && data) {
            setTransactions(data);
        }
        setLoading(false);
    };

    const fetchKakaSakuList = async () => {
        const { data, error } = await supabase
            .from(process.env.NEXT_PUBLIC_KAKA_SAKU as string)
            .select('id, title, slug')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setKakaSakuList(data);
        }
    };

    const handleViewTransaction = (transaction: KakasakuTransaction) => {
        setSelectedTransaction(transaction);
        setViewModalOpen(true);
    };

    const handleDeleteTransaction = (transaction: KakasakuTransaction) => {
        setDeletingTransaction(transaction);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingTransaction) return;

        setDeleting(true);
        try {
            const response = await fetch('/api/kakasaku/insert-transaction', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: deletingTransaction.id
                })
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(`Gagal menghapus transaksi: ${result.error || 'Unknown error'}`);
            } else {
                toast.success('Transaksi berhasil dihapus!');
                // Refresh the transactions list
                await fetchTransactions();
                setDeleteModalOpen(false);
                setDeletingTransaction(null);
            }
        } catch (error) {
            toast.error('Gagal menghapus transaksi');
        } finally {
            setDeleting(false);
        }
    };



    const getKakaSakuTitle = (kakaSakuId: number) => {
        const kakaSaku = kakaSakuList.find(ks => ks.id === kakaSakuId);
        return kakaSaku?.title || `ID: ${kakaSakuId}`;
    };

    const getStatusBadge = (status: string) => {
        const statusMap: { [key: string]: { variant: "default" | "secondary" | "destructive" | "outline", label: string } } = {
            'settlement': { variant: 'default', label: 'Berhasil' },
            'capture': { variant: 'default', label: 'Berhasil' },
            'success': { variant: 'default', label: 'Berhasil' },
            'pending': { variant: 'secondary', label: 'Pending' },
            'deny': { variant: 'destructive', label: 'Ditolak' },
            'expire': { variant: 'destructive', label: 'Kadaluarsa' },
            'cancel': { variant: 'outline', label: 'Dibatalkan' }
        };

        const statusInfo = statusMap[status] || { variant: 'outline', label: status };
        return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
    };

    const filteredTransactions = transactions.filter(trx => {
        const matchesSearch =
            trx.name.toLowerCase().includes(search.toLowerCase()) ||
            trx.order_id.toLowerCase().includes(search.toLowerCase()) ||
            trx.email.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === 'all' || trx.status === statusFilter;

        const matchesKakaSaku = kakaSakuFilter === 'all' || trx.kaka_saku_id.toString() === kakaSakuFilter;

        const matchesDate = !dateFilter || (trx.transaction_time &&
            new Date(trx.transaction_time).toDateString() === dateFilter.toDateString());

        return matchesSearch && matchesStatus && matchesKakaSaku && matchesDate;
    });

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to first page when search or filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter, kakaSakuFilter, dateFilter]);

    // Ensure currentPage is valid when totalPages changes
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (currentPage < 1 && totalPages > 0) {
            setCurrentPage(1);
        } else if (totalPages === 0) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);


    return (
        <section>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border rounded-2xl border-border bg-card shadow-sm gap-4'>
                <div className='flex flex-col gap-3'>
                    <h3 className='text-2xl md:text-3xl font-bold'>
                        Manajemen Kaka Saku Transaction
                    </h3>
                    <ol className='flex gap-2 items-center text-sm text-muted-foreground'>
                        <li className='flex items-center hover:text-primary transition-colors'>
                            <span>Dashboard</span>
                            <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
                        </li>
                        <li className='flex items-center text-primary font-medium'>
                            <span>Kaka Saku Transaction</span>
                        </li>
                    </ol>
                </div>
                <div className='flex gap-2'>
                    <Button
                        variant="outline"
                        onClick={() => downloadAllTransactionsPDF(filteredTransactions, kakaSakuList, search, statusFilter, kakaSakuFilter, dateFilter)}
                        disabled={filteredTransactions.length === 0}
                        className="flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Download All PDF
                    </Button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="mt-6 flex flex-wrap md:flex-row gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Cari transaksi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="settlement">Settlement</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={kakaSakuFilter} onValueChange={setKakaSakuFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter Kaka Saku" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Kaka Saku</SelectItem>
                        {kakaSakuList.map((kakaSaku) => (
                            <SelectItem key={kakaSaku.id} value={kakaSaku.id.toString()}>
                                {kakaSaku.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="justify-start text-left font-normal"
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            {dateFilter ? dateFilter.toLocaleDateString('id-ID') : "Pilih Tanggal"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                            mode="single"
                            selected={dateFilter}
                            onSelect={setDateFilter}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Search Results Counter */}
            {(search || statusFilter !== 'all' || kakaSakuFilter !== 'all' || dateFilter) && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm text-blue-800">
                        Menampilkan {paginatedTransactions.length} dari {filteredTransactions.length} transaksi
                        {search && ` (hasil pencarian: "${search}")`}
                        {statusFilter !== 'all' && ` (status: ${statusFilter})`}
                        {kakaSakuFilter !== 'all' && ` (kaka saku: ${getKakaSakuTitle(parseInt(kakaSakuFilter))})`}
                        {dateFilter && ` (tanggal: ${dateFilter.toLocaleDateString('id-ID')})`}
                    </div>
                </div>
            )}

            {/* Transactions Table */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>
                        Daftar Transaksi
                        {filteredTransactions.length !== transactions.length && (
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                ({filteredTransactions.length} dari {transactions.length})
                            </span>
                        )}
                        {filteredTransactions.length === transactions.length && (
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                ({transactions.length})
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <KakasakutransactionSkelaton />
                    ) : filteredTransactions.length === 0 ? (
                        <div className="flex flex-col justify-center items-center py-8">
                            <p className="text-gray-400 text-lg mb-4">
                                {search || statusFilter !== 'all' || kakaSakuFilter !== 'all' || dateFilter
                                    ? 'Tidak ada transaksi yang sesuai dengan filter yang dipilih.'
                                    : 'Tidak ada transaksi ditemukan.'
                                }
                            </p>
                            {(search || statusFilter !== 'all' || kakaSakuFilter !== 'all' || dateFilter) && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearch('');
                                        setStatusFilter('all');
                                        setKakaSakuFilter('all');
                                        setDateFilter(undefined);
                                    }}
                                >
                                    Hapus Semua Filter
                                </Button>
                            )}
                        </div>
                    ) : paginatedTransactions.length === 0 ? (
                        <div className="flex flex-col justify-center items-center py-8">
                            <p className="text-gray-400 text-lg mb-4">
                                Tidak ada transaksi di halaman {currentPage}.
                                {totalPages > 1 && ` Silakan coba halaman lain atau ubah filter.`}
                            </p>
                            <div className="flex gap-2">
                                {currentPage > 1 && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                    >
                                        Halaman Sebelumnya
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearch('');
                                        setStatusFilter('all');
                                        setKakaSakuFilter('all');
                                        setDateFilter(undefined);
                                    }}
                                >
                                    Hapus Semua Filter
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Mobile/Tablet View - Cards */}
                            <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                                {paginatedTransactions.map((trx) => (
                                    <Card key={trx.id} className="p-4">
                                        <div className="space-y-4">
                                            {/* Header with Avatar and Name */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-10 h-10">
                                                        {trx.photo_url ? (
                                                            <AvatarImage src={trx.photo_url} alt={trx.name} />
                                                        ) : (
                                                            <AvatarFallback className="text-sm">
                                                                {trx.name?.charAt(0) || '?'}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{trx.name}</div>
                                                        <div className="text-sm text-gray-500">{trx.email}</div>
                                                    </div>
                                                </div>
                                                {getStatusBadge(trx.status)}
                                            </div>

                                            {/* Transaction Details */}
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-600">Kaka Saku:</span>
                                                    <p className="mt-1">{getKakaSakuTitle(trx.kaka_saku_id)}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600">Amount:</span>
                                                    <p className="mt-1 font-semibold text-green-600">
                                                        Rp {trx.amount.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600">Order ID:</span>
                                                    <p className="mt-1 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                                        {trx.order_id}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600">Payment:</span>
                                                    <p className="mt-1">{trx.payment_type || '-'}</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="font-medium text-gray-600">Image:</span>
                                                    <div className="mt-1">
                                                        {trx.image_url ? (
                                                            <div className="w-full aspect-video rounded-md border overflow-hidden">
                                                                <img
                                                                    src={trx.image_url}
                                                                    alt="Transaction Image"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">No image</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="font-medium text-gray-600">Date:</span>
                                                    <p className="mt-1">
                                                        {trx.transaction_time
                                                            ? new Date(trx.transaction_time).toLocaleString('id-ID')
                                                            : '-'
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 pt-2 border-t">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewTransaction(trx)}
                                                    className="flex-1"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    Detail
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => downloadTransactionPDF(trx, kakaSakuList)}
                                                    className="flex-1"
                                                >
                                                    <Download className="w-4 h-4 mr-1" />
                                                    PDF
                                                </Button>
                                                {trx.status !== 'settlement' && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteTransaction(trx)}
                                                        className="flex-1"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Hapus
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Desktop View - Table (XL and above) */}
                            <div className="hidden xl:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3 font-semibold">Donatur</th>
                                            <th className="text-left p-3 font-semibold">Kaka Saku</th>
                                            <th className="text-left p-3 font-semibold">Order ID</th>
                                            <th className="text-left p-3 font-semibold">Amount</th>
                                            <th className="text-left p-3 font-semibold">Status</th>
                                            <th className="text-left p-3 font-semibold">Date</th>
                                            <th className="text-left p-3 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedTransactions.map((trx) => (
                                            <tr key={trx.id} className="border-b hover:bg-gray-50">
                                                <td className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-8 h-8">
                                                            {trx.photo_url ? (
                                                                <AvatarImage src={trx.photo_url} alt={trx.name} />
                                                            ) : (
                                                                <AvatarFallback className="text-xs">
                                                                    {trx.name?.charAt(0) || '?'}
                                                                </AvatarFallback>
                                                            )}
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{trx.name}</div>
                                                            <div className="text-sm text-gray-500">{trx.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="text-sm">
                                                        {getKakaSakuTitle(trx.kaka_saku_id)}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                        {trx.order_id}
                                                    </code>
                                                </td>
                                                <td className="p-3">
                                                    <span className="font-semibold text-green-600">
                                                        Rp {trx.amount.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    {getStatusBadge(trx.status)}
                                                </td>
                                                <td className="p-3">
                                                    <span className="text-sm text-gray-600">
                                                        {trx.transaction_time
                                                            ? new Date(trx.transaction_time).toLocaleString('id-ID')
                                                            : '-'
                                                        }
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewTransaction(trx)}
                                                        >
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            Detail
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => downloadTransactionPDF(trx, kakaSakuList)}
                                                        >
                                                            <Download className="w-4 h-4 mr-1" />
                                                            PDF
                                                        </Button>
                                                        {trx.status !== 'settlement' && (
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDeleteTransaction(trx)}
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-1" />
                                                                Hapus
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        onClick={() => setCurrentPage(page)}
                                        isActive={currentPage === page}
                                        className="cursor-pointer"
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            {/* View Transaction Modal */}
            <ViewModal
                open={viewModalOpen}
                onOpenChange={setViewModalOpen}
                transaction={selectedTransaction}
                kakaSakuList={kakaSakuList}
            />

            {/* Delete Confirmation Modal */}
            <DeleteModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                transaction={deletingTransaction}
                onDelete={confirmDelete}
                deleting={deleting}
            />
        </section>
    )
}
