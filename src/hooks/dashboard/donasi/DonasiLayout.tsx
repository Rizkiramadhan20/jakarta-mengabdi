"use client"

import React, { useEffect } from 'react'

import { Button } from '@/components/ui/button'

import { ChevronRight, Image as ImageIcon, } from "lucide-react"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { supabase } from '@/utils/supabase/supabase'

import type { Donasi } from '@/types/donasi'

import { useManagamentDonasi } from '@/hooks/dashboard/donasi/utils/useManagamentDonasi';

import FormModal from '@/hooks/dashboard/donasi/modal/FormModal';

import ViewModal from '@/hooks/dashboard/donasi/modal/ViewModal';

import DeleteModal from '@/hooks/dashboard/donasi/modal/DeleteModal';

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination'

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

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
        dragActive,
        inputRef,
        uploadProgress,
        pendingImages, setPendingImages,
        draggedImageIdx,
        isDraggingImage,
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
        handleDrag,
        handleDrop,
        handleDelete,
        handleImageDragStart,
        handleImageDragOver,
        handleImageDrop,
        handleImageDragEnd,
        closeViewModal,
        openViewModal,
    } = useManagamentDonasi();

    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(donasi.length / itemsPerPage);
    const paginatedDonasi = donasi.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                            dragActive={dragActive}
                            inputRef={inputRef}
                            uploadProgress={uploadProgress}
                            pendingImages={pendingImages}
                            setPendingImages={setPendingImages}
                            draggedImageIdx={draggedImageIdx}
                            isDraggingImage={isDraggingImage}
                            handleChange={handleChange}
                            handleImageChange={handleImageChange}
                            handleSubmit={handleSubmit}
                            handleDrag={handleDrag}
                            handleDrop={handleDrop}
                            handleImageDragStart={handleImageDragStart}
                            handleImageDragOver={handleImageDragOver}
                            handleImageDrop={handleImageDrop}
                            handleImageDragEnd={handleImageDragEnd}
                            closeModal={closeModal}
                            setImagePreviews={imgs => setImagePreview(imgs[0] || null)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            {/* Donasi Table */}
            <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
                <Table className="min-w-[900px]">
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="px-4 py-3 font-semibold text-gray-700 border-b">Gambar</TableHead>
                            <TableHead className="px-4 py-3 font-semibold text-gray-700 border-b">Judul</TableHead>
                            <TableHead className="px-4 py-3 font-semibold text-gray-700 border-b">Target</TableHead>
                            <TableHead className="px-4 py-3 font-semibold text-gray-700 border-b">Terkumpul</TableHead>
                            <TableHead className="px-4 py-3 font-semibold text-gray-700 border-b">Status</TableHead>
                            <TableHead className="px-4 py-3 font-semibold text-gray-700 border-b">Deadline</TableHead>
                            <TableHead className="px-4 py-3 font-semibold text-gray-700 border-b">Dibuat</TableHead>
                            <TableHead className="px-4 py-3 font-semibold text-gray-700 border-b">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center px-6 py-8">Loading...</TableCell>
                            </TableRow>
                        ) : donasi.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center px-6 py-12">
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <img src="/globe.svg" alt="No donasi" className="w-20 h-20 mb-4 opacity-80 mx-auto" />
                                        <h4 className="text-lg font-semibold mb-1">Belum ada donasi</h4>
                                        <p className="text-muted-foreground text-sm">Donasi belum tersedia. Mulai tambahkan donasi baru.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedDonasi.map((item, idx) => (
                                <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <TableCell className="px-4 py-3 border-b">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover rounded-md border" />
                                        ) : (
                                            <span className="text-gray-400">No image</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 border-b max-w-[180px] truncate">
                                        <span className="text-base font-medium text-gray-900">{item.title}</span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 border-b">
                                        <span className="text-sm text-gray-700 font-medium">Rp{Number(item.target_amount).toLocaleString()}</span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 border-b">
                                        <span className="text-sm text-gray-700 font-medium">Rp{Number(item.current_amount).toLocaleString()}</span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 border-b">
                                        <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors duration-200 ${item.status === 'open' ? 'bg-green-100 text-green-800' : item.status === 'closed' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-600'}`}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 border-b">
                                        <span className="text-sm text-gray-700">{item.deadline ? new Date(item.deadline).toLocaleDateString('id-ID') : '-'}</span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 border-b">
                                        <span className="text-sm text-gray-700">{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 border-b">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" size="icon" className="w-8 h-8 p-0 flex items-center justify-center">
                                                    <span className="sr-only">Aksi</span>
                                                    <ChevronRight className="w-5 h-5" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-40 p-2">
                                                <div className="flex flex-col gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="justify-start text-blue-700 hover:bg-blue-50"
                                                        onClick={() => openViewModal(item)}
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="justify-start text-yellow-700 hover:bg-yellow-50"
                                                        onClick={() => openEditModal(item)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="justify-start text-red-700 hover:bg-red-50"
                                                        onClick={() => {
                                                            setDeletingId(item.id);
                                                            setDeleteModalOpen(true);
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                {/* Pagination */}
                {donasi.length > itemsPerPage && (
                    <div className="py-4 flex justify-center">
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
            </div>
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