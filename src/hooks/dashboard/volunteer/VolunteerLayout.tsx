"use client"

import React, { useEffect } from 'react'

import { Button } from '@/components/ui/button'

import { ChevronRight } from "lucide-react"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { supabase } from '@/utils/supabase/supabase'

import { Volunteer } from '@/interface/volunteer'

import { useManagamentVolunteer } from '@/hooks/dashboard/volunteer/utils/useManagamentVolunteer'

import FormModal from '@/hooks/dashboard/volunteer/modal/FormModal'

import ViewModal from '@/hooks/dashboard/volunteer/modal/ViewModal'

import DeleteModal from '@/hooks/dashboard/volunteer/modal/DeleteModal'

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

import VolunteerCardSkeleton from '@/hooks/dashboard/volunteer/VolunteerSkelaton'

import Image from 'next/image'

import { formatDateTimeIndo } from '@/base/helper/FormatDate';

export default function VolunteerLayout() {
    const {
        volunteers, setVolunteers,
        loading, setLoading,
        modal, setModal,
        form, setForm,
        creating,
        uploading,
        imagePreviews, setImagePreviews,
        dragActive,
        inputRef,
        uploadProgress,
        setPendingImages,
        pendingImages,
        deleteModalOpen, setDeleteModalOpen,
        deletingId, setDeletingId,
        viewModalOpen,
        viewingVolunteer,
        openCreateModal,
        openEditModal,
        closeModal,
        handleChange,
        handleImageChange,
        handleSubmit,
        handleDrag,
        handleDrop,
        handleDelete,
        closeViewModal,
        openViewModal,
        handleDeleteFileDocument,
        deleting,
        draggedImageIdx,
        isDraggingImage,
        handleImageDragStart,
        handleImageDragOver,
        handleImageDrop,
        handleImageDragEnd,
    } = useManagamentVolunteer();

    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(volunteers.length / itemsPerPage);
    const paginatedVolunteers = volunteers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        const fetchVolunteers = async () => {
            setLoading(true)
            const { data, error } = await supabase.from(process.env.NEXT_PUBLIC_VOLUNTEERS as string).select('*').order('created_at', { ascending: false })
            if (!error && data) setVolunteers(data as Volunteer[])
            setLoading(false)
        }
        fetchVolunteers()
    }, [creating])

    return (
        <section className='overflow-hidden'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border rounded-2xl border-border bg-card shadow-sm gap-4'>
                <div className='flex flex-col gap-3'>
                    <h3 className='text-2xl md:text-3xl font-bold'>
                        Manajemen Volunteer
                    </h3>
                    <ol className='flex gap-2 items-center text-sm text-muted-foreground'>
                        <li className='flex items-center hover:text-primary transition-colors'>
                            <span>Dashboard</span>
                            <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
                        </li>
                        <li className='flex items-center text-primary font-medium'>
                            <span>Volunteer</span>
                        </li>
                    </ol>
                </div>

                <Dialog open={modal.open} onOpenChange={open => setModal(m => ({ ...m, open }))}>
                    <DialogTrigger asChild>
                        <Button
                            variant="default"
                            className="w-full md:w-auto px-6 py-2.5 font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                            onClick={openCreateModal}
                        >
                            Tambah Volunteer
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-5xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto'>
                        <DialogHeader>
                            <DialogTitle>{modal.editMode ? 'Edit Volunteer' : 'Tambah Volunteer'}</DialogTitle>
                        </DialogHeader>
                        <FormModal
                            isEditMode={modal.editMode}
                            form={form}
                            setForm={setForm}
                            creating={creating}
                            uploading={uploading}
                            imagePreviews={imagePreviews}
                            dragActive={dragActive}
                            inputRef={inputRef}
                            uploadProgress={uploadProgress}
                            setPendingImages={setPendingImages}
                            pendingImages={pendingImages}
                            draggedImageIdx={draggedImageIdx}
                            isDraggingImage={isDraggingImage}
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                            handleDrag={handleDrag}
                            handleDrop={handleDrop}
                            handleImageDragStart={handleImageDragStart}
                            handleImageDragOver={handleImageDragOver}
                            handleImageDrop={handleImageDrop}
                            handleImageDragEnd={handleImageDragEnd}
                            closeModal={closeModal}
                            setImagePreviews={setImagePreviews}
                            handleDeleteFileDocument={handleDeleteFileDocument}
                            handleImageChange={handleImageChange}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            {/* Volunteer Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {loading ? (
                    <VolunteerCardSkeleton />
                ) : paginatedVolunteers.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 border rounded-2xl bg-white/95 shadow-md">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="w-20 h-20 mb-4 opacity-80 mx-auto" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#888" strokeWidth="2" fill="#f3f4f6" />
                            <path d="M8 15c1.333-2 6.667-2 8 0" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
                            <circle cx="9" cy="10" r="1" fill="#888" />
                            <circle cx="15" cy="10" r="1" fill="#888" />
                        </svg>
                        <h4 className="text-lg font-semibold mb-1">Belum ada data volunteer.</h4>
                        <p className="text-muted-foreground text-sm">Volunteer belum tersedia. Mulai tambahkan volunteer baru.</p>
                    </div>
                ) : (
                    paginatedVolunteers.map((volunteer) => (
                        <Card
                            key={volunteer.id}
                            className="relative p-0 bg-white rounded-xl border border-gray-200 transition-all duration-300 group flex flex-col overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/60"
                        >
                            <CardHeader className="relative p-0 flex flex-col items-stretch">
                                <div className="relative w-full aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {/* Badge Kategori */}
                                    {volunteer.category && (
                                        <span className="absolute top-3 left-3 bg-primary/90 text-xs font-semibold text-white rounded-full px-3 py-1 shadow-md border border-primary/80 select-none z-10">
                                            {volunteer.category}
                                        </span>
                                    )}
                                    <Image
                                        src={volunteer.img_url[0] || '/placeholder.png'}
                                        alt={volunteer.title}
                                        width={1080}
                                        height={1080}
                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 z-0 rounded-t-xl"
                                        style={{ aspectRatio: '4/3', objectFit: 'cover' }}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2 p-5 pt-0">
                                <CardTitle className="text-lg font-bold text-gray-900 truncate max-w-full leading-tight mb-1">
                                    {volunteer.title}
                                </CardTitle>
                                <div className="flex flex-wrap gap-3 text-sm text-gray-700 mb-1">
                                    <span>Lokasi: <span className="font-medium">{volunteer.location}</span></span>
                                </div>
                                <span className="text-xs text-gray-500">Jadwal event: {volunteer.time ? formatDateTimeIndo(volunteer.time) : '-'}</span>
                                {volunteer.payment_options && volunteer.payment_options.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {volunteer.payment_options.map((option, idx) => (
                                            <span key={idx} className="text-xs px-2 py-1 rounded bg-gray-100 border border-gray-200 text-gray-700">
                                                {option.type === "gratis"
                                                    ? "Gratis"
                                                    : `Berbayar: Rp${Number(option.price).toLocaleString()}`}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-500">Harga: -</span>
                                )}
                            </CardContent>
                            <CardFooter className="flex flex-row gap-2 mt-2 px-5 pb-4">
                                <Button size="sm" variant="secondary" className="flex-1 min-w-[80px] font-medium" onClick={() => openViewModal(volunteer)}>
                                    Lihat
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1 min-w-[80px] font-medium border-primary/60" onClick={() => openEditModal(volunteer)}>
                                    Edit
                                </Button>
                                <Button size="sm" variant="destructive" className="flex-1 min-w-[80px] font-medium" onClick={() => { setDeletingId(volunteer.id); setDeleteModalOpen(true); }}>
                                    Hapus
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
            {/* Pagination */}
            {volunteers.length > itemsPerPage && (
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
            <DeleteModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                deletingId={deletingId}
                setDeleteModalOpen={setDeleteModalOpen}
                setDeletingId={setDeletingId}
                handleDelete={handleDelete}
                deleting={deleting}
            />
            <ViewModal
                open={viewModalOpen}
                onOpenChange={open => { if (!open) closeViewModal(); }}
                viewingVolunteer={viewingVolunteer}
                onClose={closeViewModal}
            />
        </section>
    )
}