"use client"

import React from 'react'

import { Button } from '@/components/ui/button'

import { ChevronRight } from "lucide-react"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import FormModal from '@/hooks/dashboard/jmerch/jmerch/modal/FormModal';

import DeleteModal from '@/hooks/dashboard/jmerch/jmerch/modal/DeleteModal';

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination'

import { useManagamentJMerch } from '@/hooks/dashboard/jmerch/jmerch/utils/useManagamentJmerch';

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

import CategorySkelaton from '@/hooks/dashboard/jmerch/jmerch/JmerchSkelaton';

export default function JmerchLayout() {
    const {
        jmerch,
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
        imagePreviews,
        setImagePreviews,
        uploading,
        uploadProgress,
        inputRef,
        handleImageChange,
        pendingImages,
        setPendingImages,
        dragActive,
        handleDrag,
        handleDrop,
        draggedImageIdx,
        isDraggingImage,
        handleImageDragStart,
        handleImageDragOver,
        handleImageDrop,
        handleImageDragEnd,
    } = useManagamentJMerch();

    const [currentPage, setCurrentPage] = React.useState(1);

    const itemsPerPage = 10;

    const [search, setSearch] = React.useState("");

    const filteredJMerch = jmerch.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filteredJMerch.length / itemsPerPage);
    const paginatedJMerch = filteredJMerch.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <section className='overflow-hidden'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border rounded-2xl border-border bg-card shadow-sm gap-4'>
                <div className='flex flex-col gap-3'>
                    <h3 className='text-2xl md:text-3xl font-bold'>
                        Manajemen JMerch
                    </h3>
                    <ol className='flex gap-2 items-center text-sm text-muted-foreground'>
                        <li className='flex items-center hover:text-primary transition-colors'>
                            <span>Dashboard</span>
                            <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
                        </li>
                        <li className='flex items-center text-primary font-medium'>
                            <span>JMerch</span>
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
                            Tambah JMerch
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-lg max-h-[90vh] overflow-y-auto'>
                        <DialogHeader>
                            <DialogTitle>{isEditMode ? 'Edit JMerch' : 'Tambah JMerch'}</DialogTitle>
                        </DialogHeader>
                        <FormModal
                            isEditMode={isEditMode}
                            form={form}
                            setForm={setForm}
                            creating={creating}
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                            closeModal={closeModal}
                            imagePreviews={imagePreviews}
                            setImagePreviews={setImagePreviews}
                            uploading={uploading}
                            uploadProgress={uploadProgress}
                            inputRef={inputRef}
                            handleImageChange={handleImageChange}
                            pendingImages={pendingImages}
                            setPendingImages={setPendingImages}
                            dragActive={dragActive}
                            handleDrag={handleDrag}
                            handleDrop={handleDrop}
                            draggedImageIdx={draggedImageIdx}
                            isDraggingImage={isDraggingImage}
                            handleImageDragStart={handleImageDragStart}
                            handleImageDragOver={handleImageDragOver}
                            handleImageDrop={handleImageDrop}
                            handleImageDragEnd={handleImageDragEnd}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="mt-8">
                <div className="mb-4 flex justify-start">
                    <input
                        type="text"
                        placeholder="Cari JMerch..."
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
                ) : filteredJMerch.length === 0 && jmerch.length > 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 border rounded-2xl bg-white/95 shadow-md">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="w-20 h-20 mb-4 opacity-80 mx-auto" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#888" strokeWidth="2" fill="#f3f4f6" />
                            <path d="M8 15c1.333-2 6.667-2 8 0" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
                            <circle cx="9" cy="10" r="1" fill="#888" />
                            <circle cx="15" cy="10" r="1" fill="#888" />
                        </svg>
                        <h4 className="text-lg font-semibold mb-1">JMerch tidak ditemukan</h4>
                        <p className="text-muted-foreground text-sm">Coba kata kunci lain.</p>
                    </div>
                ) : jmerch.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 border rounded-2xl bg-white/95 shadow-md">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="w-20 h-20 mb-4 opacity-80 mx-auto" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#888" strokeWidth="2" fill="#f3f4f6" />
                            <path d="M8 15c1.333-2 6.667-2 8 0" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
                            <circle cx="9" cy="10" r="1" fill="#888" />
                            <circle cx="15" cy="10" r="1" fill="#888" />
                        </svg>
                        <h4 className="text-lg font-semibold mb-1">Belum ada JMerch</h4>
                        <p className="text-muted-foreground text-sm">JMerch belum tersedia. Mulai tambahkan JMerch baru.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-border bg-card stacked-table-container">
                        <Table className="min-w-[600px] md:table-auto stacked-table">
                            <TableHeader>
                                <TableRow className="bg-gray-100">
                                    <TableHead className="w-12 font-bold text-gray-700 px-4 py-3">No</TableHead>
                                    <TableHead className="font-bold text-gray-700 px-4 py-3">Gambar</TableHead>
                                    <TableHead className="font-bold text-gray-700 px-4 py-3">Nama JMerch</TableHead>
                                    <TableHead className="font-bold text-gray-700 px-4 py-3">Tanggal Dibuat</TableHead>
                                    <TableHead className="w-40 font-bold text-gray-700 px-4 py-3">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className='overflow-auto'>
                                {paginatedJMerch.map((jmerch, idx) => (
                                    <TableRow
                                        key={jmerch.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <TableCell data-label="No" className="px-4 py-2">{(currentPage - 1) * itemsPerPage + idx + 1}</TableCell>
                                        <TableCell data-label="Gambar" className="px-4 py-2">
                                            {Array.isArray(jmerch.thumbnail) && jmerch.thumbnail.length > 0 ? (
                                                <img src={jmerch.thumbnail[0] || ""} alt={jmerch.name} className="w-16 h-16 object-cover rounded-md" />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                                                    <span className="text-xs text-gray-500">No Image</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell data-label="Nama JMerch" className="px-4 py-2">{jmerch.name}</TableCell>
                                        <TableCell data-label="Tanggal Dibuat" className="px-4 py-2">{new Date(jmerch.created_at).toLocaleDateString('id-ID')}</TableCell>
                                        <TableCell data-label="Aksi" className="px-4 py-2">
                                            <div className="flex flex-row gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="hover:bg-blue-50 hover:text-blue-600 transition"
                                                    onClick={() => openEditModal(jmerch)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="hover:bg-red-50 hover:text-red-600 transition"
                                                    onClick={() => {
                                                        setDeletingId(jmerch.id);
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

            {jmerch.length > itemsPerPage && (
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