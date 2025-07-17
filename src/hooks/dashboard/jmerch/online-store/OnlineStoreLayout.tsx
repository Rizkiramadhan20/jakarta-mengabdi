"use client"

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'

import { ChevronRight } from "lucide-react"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import FormModal from '@/hooks/dashboard/jmerch/online-store/modal/FormModal';

import DeleteModal from '@/hooks/dashboard/jmerch/online-store/modal/DeleteModal';

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination'
import { useManagamentOnlineStore } from '@/hooks/dashboard/jmerch/online-store/utils/useManagamentOnlineStore';

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

import CategorySkelaton from '@/hooks/dashboard/jmerch/online-store/OnlineStoreSkelaton';

export default function OnlineStoreLayout() {
    const {
        onlineStore,
        loading,
        modalOpen, setModalOpen,
        isEditMode,
        form, setForm,
        creating,
        deleteModalOpen, setDeleteModalOpen,
        deletingId, setDeletingId,
        openCreateModal,
        openEditModal,
        closeModal,
        handleChange,
        handleSubmit,
        handleDelete,
    } = useManagamentOnlineStore();

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const [search, setSearch] = useState("");

    const filteredOnlineStore = onlineStore.filter((cat: any) =>
        cat.name?.toLowerCase().includes(search.toLowerCase()) ||
        cat.url?.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filteredOnlineStore.length / itemsPerPage);
    const paginatedOnlineStore = filteredOnlineStore.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <section className='overflow-hidden'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border rounded-2xl border-border bg-card shadow-sm gap-4'>
                <div className='flex flex-col gap-3'>
                    <h3 className='text-2xl md:text-3xl font-bold'>
                        Manajemen Online Store
                    </h3>
                    <ol className='flex gap-2 items-center text-sm text-muted-foreground'>
                        <li className='flex items-center hover:text-primary transition-colors'>
                            <span>Dashboard</span>
                            <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
                        </li>
                        <li className='flex items-center text-primary font-medium'>
                            <span>Online Store</span>
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
                            Tambah Online Store
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-lg max-h-[90vh] overflow-y-auto'>
                        <DialogHeader>
                            <DialogTitle>{isEditMode ? 'Edit Online Store' : 'Tambah Online Store'}</DialogTitle>
                        </DialogHeader>
                        <FormModal
                            isEditMode={isEditMode}
                            form={form}
                            setForm={setForm}
                            creating={creating}
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                            closeModal={closeModal}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="mt-8">
                <div className="mb-4 flex justify-start">
                    <input
                        type="text"
                        placeholder="Cari Online Store..."
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border rounded-lg px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                {loading ? (
                    <CategorySkelaton />
                ) : filteredOnlineStore.length === 0 && onlineStore.length > 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 border rounded-2xl bg-white/95 shadow-md">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="w-20 h-20 mb-4 opacity-80 mx-auto" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#888" strokeWidth="2" fill="#f3f4f6" />
                            <path d="M8 15c1.333-2 6.667-2 8 0" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
                            <circle cx="9" cy="10" r="1" fill="#888" />
                            <circle cx="15" cy="10" r="1" fill="#888" />
                        </svg>
                        <h4 className="text-lg font-semibold mb-1">Online Store tidak ditemukan</h4>
                        <p className="text-muted-foreground text-sm">Coba kata kunci lain.</p>
                    </div>
                ) : onlineStore.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 border rounded-2xl bg-white/95 shadow-md">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="w-20 h-20 mb-4 opacity-80 mx-auto" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#888" strokeWidth="2" fill="#f3f4f6" />
                            <path d="M8 15c1.333-2 6.667-2 8 0" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
                            <circle cx="9" cy="10" r="1" fill="#888" />
                            <circle cx="15" cy="10" r="1" fill="#888" />
                        </svg>
                        <h4 className="text-lg font-semibold mb-1">Belum ada Online Store</h4>
                        <p className="text-muted-foreground text-sm">Online Store belum tersedia. Mulai tambahkan Online Store baru.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-border bg-card stacked-table-container">
                        <Table className="min-w-[600px] md:table-auto stacked-table">
                            <TableHeader>
                                <TableRow className="bg-gray-100">
                                    <TableHead className="w-12 font-bold text-gray-700 px-4 py-3">No</TableHead>
                                    <TableHead className="font-bold text-gray-700 px-4 py-3">Nama Online Store</TableHead>
                                    <TableHead className="font-bold text-gray-700 px-4 py-3">URL Online Store</TableHead>
                                    <TableHead className="font-bold text-gray-700 px-4 py-3">Tanggal Dibuat</TableHead>
                                    <TableHead className="w-40 font-bold text-gray-700 px-4 py-3">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className='overflow-auto'>
                                {paginatedOnlineStore.map((onlineStore: any, idx: number) => (
                                    <TableRow
                                        key={onlineStore.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <TableCell data-label="No" className="px-4 py-2">{(currentPage - 1) * itemsPerPage + idx + 1}</TableCell>
                                        <TableCell data-label="Nama Online Store" className="px-4 py-2">{onlineStore.name}</TableCell>
                                        <TableCell data-label="URL Online Store" className="px-4 py-2">{onlineStore.url}</TableCell>
                                        <TableCell data-label="Tanggal Dibuat" className="px-4 py-2">{new Date(onlineStore.created_at).toLocaleDateString('id-ID')}</TableCell>
                                        <TableCell data-label="Aksi" className="px-4 py-2">
                                            <div className="flex flex-row gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="hover:bg-blue-50 hover:text-blue-600 transition"
                                                    onClick={() => openEditModal(onlineStore)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="hover:bg-red-50 hover:text-red-600 transition"
                                                    onClick={() => {
                                                        setDeletingId(onlineStore.id);
                                                        setDeleteModalOpen(true);
                                                    }}
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {onlineStore.length > itemsPerPage && (
                <Pagination className="mt-8">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink isActive={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}

            <DeleteModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                deletingId={deletingId}
                setDeleteModalOpen={setDeleteModalOpen}
                setDeletingId={setDeletingId}
                handleDelete={handleDelete}
            />
        </section>
    )
}