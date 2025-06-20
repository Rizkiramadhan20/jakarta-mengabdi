"use client"

import React, { useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'

import { ChevronRight, Image as ImageIcon, } from "lucide-react"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { supabase } from '@/utils/supabase/supabase'

import type { Volunteer } from '@/types/volunteer'

import { useManagamentVolunteer } from '@/hooks/dashboard/volunteer/utils/useManagamentVolunteer'

import FormModal from '@/hooks/dashboard/volunteer/modal/FormModal'

import ViewModal from '@/hooks/dashboard/volunteer/modal/ViewModal'

import DeleteModal from '@/hooks/dashboard/volunteer/modal/DeleteModal'

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination'

import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription, CardAction } from '@/components/ui/card'

import VolunteerCardSkeleton from '@/hooks/dashboard/volunteer/VolunteerSkelaton'

export default function VolunteerLayout() {
    const {
        volunteers, setVolunteers,
        loading, setLoading,
        modalOpen, setModalOpen,
        isEditMode,
        form, setForm,
        creating,
        uploading,
        imagePreviews, setImagePreviews,
        dragActive,
        inputRef,
        uploadProgress,
        pendingImages, setPendingImages,
        draggedImageIdx,
        isDraggingImage,
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
        handleImageDragStart,
        handleImageDragOver,
        handleImageDrop,
        handleImageDragEnd,
        closeViewModal,
        openViewModal,
        handleDeleteFileDocument,
        deleting,
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

                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="default"
                            className="w-full md:w-auto px-6 py-2.5 font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                            onClick={openCreateModal}
                        >
                            Tambah Volunteer
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
                        <DialogHeader>
                            <DialogTitle>{isEditMode ? 'Edit Volunteer' : 'Tambah Volunteer'}</DialogTitle>
                        </DialogHeader>
                        <FormModal
                            isEditMode={isEditMode}
                            form={form}
                            setForm={setForm}
                            creating={creating}
                            uploading={uploading}
                            imagePreviews={imagePreviews}
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
                            setImagePreviews={setImagePreviews}
                            handleDeleteFileDocument={handleDeleteFileDocument}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            {/* Volunteer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {loading ? (
                    <VolunteerCardSkeleton />
                ) : paginatedVolunteers.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground py-12">Belum ada data volunteer.</div>
                ) : (
                    paginatedVolunteers.map((volunteer) => (
                        <Card key={volunteer.id} className="relative">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <img
                                    src={volunteer.img_url || '/placeholder.png'}
                                    alt={volunteer.title}
                                    className="w-20 h-20 object-cover rounded-lg border"
                                />
                                <div>
                                    <CardTitle className="text-lg font-bold">{volunteer.title}</CardTitle>
                                    <CardDescription>{volunteer.category}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <div><span className="font-medium">Kuota:</span> {volunteer.quota_available}</div>
                                <div><span className="font-medium">Lokasi:</span> {volunteer.location}</div>
                                <div><span className="font-medium">Waktu:</span> {new Date(volunteer.time).toLocaleString("id-ID")}</div>
                                <div><span className="font-medium">Harga:</span> Rp{Number(volunteer.price).toLocaleString()}</div>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => openViewModal(volunteer)}>
                                    Lihat
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => openEditModal(volunteer)}>
                                    Edit
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => { setDeletingId(volunteer.id); setDeleteModalOpen(true); }}>
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