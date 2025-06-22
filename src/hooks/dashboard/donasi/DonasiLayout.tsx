"use client"

import React, { useEffect } from 'react'

import { Button } from '@/components/ui/button'

import { ChevronRight, Search } from "lucide-react"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { supabase } from '@/utils/supabase/supabase'

import type { Donasi } from '@/interface/donasi'

import { useManagamentDonasi } from '@/hooks/dashboard/donasi/utils/useManagamentDonasi';

import FormModal from '@/hooks/dashboard/donasi/modal/FormModal';

import ViewModal from '@/hooks/dashboard/donasi/modal/ViewModal';

import DeleteModal from '@/hooks/dashboard/donasi/modal/DeleteModal';

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination'

import { Card } from '@/components/ui/card'

import DonasiSkeleton from "@/hooks/dashboard/donasi/DonasiSkelaton"

import { Input } from '@/components/ui/input'

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

export default function DonasiLayout() {
    const {
        donasi, setDonasi,
        loading, setLoading,
        modalOpen, setModalOpen,
        isEditMode,
        form, setForm,
        creating,
        uploading,
        imagePreview, setImagePreview,
        inputRef,
        uploadProgress,
        deleteModalOpen, setDeleteModalOpen,
        deletingId, setDeletingId,
        viewModalOpen,
        viewingProduct,
        openCreateModal,
        openEditModal,
        closeModal,
        handleChange,
        handleImageChange,
        handleSubmit,
        handleDelete,
        closeViewModal,
        openViewModal,
    } = useManagamentDonasi();

    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 8;
    const [search, setSearch] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("all");

    // Filter donasi berdasarkan search dan status
    const filteredDonasi = donasi.filter(item => {
        const matchTitle = item.title.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter && statusFilter !== "all" ? item.status === statusFilter : true;
        return matchTitle && matchStatus;
    });
    const totalPages = Math.ceil(filteredDonasi.length / itemsPerPage);
    const paginatedDonasi = filteredDonasi.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        const fetchDonasi = async () => {
            setLoading(true)
            const { data, error } = await supabase.from(process.env.NEXT_PUBLIC_DONATIONS as string).select('*').order('created_at', { ascending: false })
            if (!error && data) setDonasi(data as Donasi[])
            setLoading(false)
        }
        fetchDonasi()
    }, [creating])

    return (
        <section>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border rounded-2xl border-border bg-card shadow-sm gap-4'>
                <div className='flex flex-col gap-3'>
                    <h3 className='text-2xl md:text-3xl font-bold'>
                        Manajemen Donasi
                    </h3>
                    <ol className='flex gap-2 items-center text-sm text-muted-foreground'>
                        <li className='flex items-center hover:text-primary transition-colors'>
                            <span>Dashboard</span>
                            <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
                        </li>
                        <li className='flex items-center text-primary font-medium'>
                            <span>Donasi</span>
                        </li>
                    </ol>
                </div>

                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="default"
                            className="w-full md:w-auto px-6 py-2.5 font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                            onClick={openCreateModal}
                        >
                            Create Donasi
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
                        <DialogHeader>
                            <DialogTitle>{isEditMode ? 'Edit Donasi' : 'Create Donasi'}</DialogTitle>
                        </DialogHeader>
                        <FormModal
                            isEditMode={isEditMode}
                            form={form}
                            setForm={setForm}
                            creating={creating}
                            uploading={uploading}
                            imagePreviews={imagePreview ? [imagePreview] : []}
                            inputRef={inputRef}
                            uploadProgress={uploadProgress}
                            handleChange={handleChange}
                            handleImageChange={handleImageChange}
                            handleSubmit={handleSubmit}
                            closeModal={closeModal}
                            setImagePreviews={imgs => setImagePreview(imgs[0] || null)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filter/Search Bar */}
            <div className="mt-6 mb-4 w-full md:w-fit flex flex-row items-center gap-3 md:gap-6 bg-white/80 border border-gray-200 rounded-xl shadow-sm px-4 py-3">
                <div className="relative w-full md:w-72">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search className="w-5 h-5" />
                    </span>
                    <Input
                        type="text"
                        placeholder="Cari donasi berdasarkan judul..."
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full h-10 pl-10 pr-3 bg-white border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition placeholder:text-gray-400"
                    />
                </div>

                <Select
                    value={statusFilter}
                    onValueChange={value => {
                        setStatusFilter(value);
                        setCurrentPage(1);
                    }}
                >
                    <SelectTrigger className="w-full md:w-48 h-10 bg-white border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition">
                        <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {/* Donasi Cards Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    <DonasiSkeleton />
                ) : donasi.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 border rounded-2xl bg-white/95 shadow-md">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="w-20 h-20 mb-4 opacity-80 mx-auto" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#888" strokeWidth="2" fill="#f3f4f6" />
                            <path d="M8 15c1.333-2 6.667-2 8 0" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
                            <circle cx="9" cy="10" r="1" fill="#888" />
                            <circle cx="15" cy="10" r="1" fill="#888" />
                        </svg>
                        <h4 className="text-lg font-semibold mb-1">Belum ada donasi</h4>
                        <p className="text-muted-foreground text-sm">Donasi belum tersedia. Mulai tambahkan donasi baru.</p>
                    </div>
                ) : filteredDonasi.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 border rounded-2xl bg-white/95 shadow-md">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="w-20 h-20 mb-4 opacity-80 mx-auto" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#888" strokeWidth="2" fill="#f3f4f6" />
                            <path d="M8 15c1.333-2 6.667-2 8 0" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
                            <circle cx="9" cy="10" r="1" fill="#888" />
                            <circle cx="15" cy="10" r="1" fill="#888" />
                        </svg>
                        <h4 className="text-lg font-semibold mb-1">Tidak ada donasi yang sesuai</h4>
                        <p className="text-muted-foreground text-sm">Coba ubah kata kunci pencarian atau filter status.</p>
                    </div>
                ) : (
                    paginatedDonasi.map((item, idx) => (
                        <Card
                            key={item.id}
                            className="relative p-0 bg-white/95 rounded-2xl border border-gray-100 transition-all duration-300 group flex flex-col overflow-hidden"
                        >
                            <div className="flex flex-col h-full">
                                <div className="relative w-full aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {/* Badge Status */}
                                    <div className='flex gap-4'>
                                        <span className={`absolute bottom-4 left-2 px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full z-10 transition-colors duration-200 ${item.status === 'open' ? 'bg-green-100 text-green-800' : item.status === 'closed' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-600'}`}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>

                                        {/* Deadline Badge */}
                                        <span className="absolute bottom-4 left-20 px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full z-10 bg-blue-100 text-blue-800">
                                            Deadline: {item.deadline ? new Date(item.deadline).toLocaleDateString('id-ID') : '-'}
                                        </span>
                                    </div>

                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.title} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 z-0" style={{ aspectRatio: '4/3' }} />
                                    ) : (
                                        <span className="text-gray-400">No image</span>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col gap-2 p-4">
                                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded w-fit inline-block shadow-sm">
                                        Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID')}
                                    </span>

                                    <span className="text-base font-semibold text-gray-900 truncate max-w-[180px]">{item.title}</span>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-700 items-center">
                                        <span>
                                            <span className="font-semibold text-gray-600">🎯 Target Donasi:</span>
                                            <span className="font-bold text-primary ml-1">Rp{Number(item.target_amount).toLocaleString()}</span>
                                        </span>
                                        <span className="mx-2 text-gray-300">|</span>
                                        <span>
                                            <span className="font-semibold text-gray-600">💰 Dana Terkumpul:</span>
                                            <span className="font-bold text-green-600 ml-1">Rp{Number(item.current_amount).toLocaleString()}</span>
                                        </span>
                                        <span className="mx-2 text-gray-300">|</span>
                                        <span>
                                            <span className="font-semibold text-gray-600">📊 Jumlah Donatur:</span>
                                            <span className="font-bold text-blue-600 ml-1">{item.donations || 0}</span>
                                        </span>
                                        <span className="mx-2 text-gray-300">|</span>
                                        <span>
                                            <span className="font-semibold text-gray-600">📤 Share:</span>
                                            <span className="font-bold text-orange-600 ml-1">{item.share || 0}</span>
                                        </span>
                                    </div>

                                    <div className="flex flex-row gap-2 mt-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 min-w-[80px]"
                                            onClick={() => openViewModal(item)}
                                        >
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 min-w-[80px]"
                                            onClick={() => openEditModal(item)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 min-w-[80px]"
                                            onClick={() => {
                                                setDeletingId(item.id);
                                                setDeleteModalOpen(true);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
            {/* Pagination */}
            {donasi.length > itemsPerPage && (
                <div className="py-4 mt-5 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={e => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }}
                                    aria-disabled={currentPage === 1}
                                />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        href="#"
                                        isActive={currentPage === i + 1}
                                        onClick={e => { e.preventDefault(); setCurrentPage(i + 1); }}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={e => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                                    aria-disabled={currentPage === totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
            <DeleteModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                deletingId={deletingId}
                setDeleteModalOpen={setDeleteModalOpen}
                setDeletingId={setDeletingId}
                handleDelete={handleDelete}
            />
            {/* View Modal moved to its own component */}
            <ViewModal
                open={viewModalOpen}
                onOpenChange={open => { if (!open) closeViewModal(); }}
                viewingProduct={viewingProduct}
                onClose={closeViewModal}
            />
        </section>
    )
}