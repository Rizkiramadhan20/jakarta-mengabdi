"use client"

import React, { useEffect } from 'react'

import { Button } from '@/components/ui/button'

import { ChevronRight } from "lucide-react"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { supabase } from '@/utils/supabase/supabase'

import type { KakaSaku } from '@/interface/kakaSaku'

import { useManagamentKakaSaku } from '@/hooks/dashboard/kaka-saku/utils/useManagamentKakaSaku';

import FormModal from '@/hooks/dashboard/kaka-saku/modal/FormModal';

import TimelineModal from '@/hooks/dashboard/kaka-saku/modal/TimelineModal';

import ViewModal from '@/hooks/dashboard/kaka-saku/modal/ViewModal';

import DeleteModal from '@/hooks/dashboard/kaka-saku/modal/DeleteModal';

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination'

import { Card } from '@/components/ui/card'

export default function DonasiLayout() {
    const {
        kakasaku, setKakasaku,
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
        closeViewModal,
        openViewModal,
        // Timeline functions
        timelineModalOpen,
        setTimelineModalOpen,
        timelineForm,
        setTimelineForm,
        isTimelineEditMode,
        timelineImagePreview,
        setTimelineImagePreview,
        timelinePendingImages,
        setTimelinePendingImages,
        timelineUploading,
        timelineInputRef,
        openTimelineModal,
        openEditTimelineModal,
        closeTimelineModal,
        handleTimelineChange,
        handleTimelineImageChange,
        handleTimelineSubmit,
        deleteTimelineItem,
    } = useManagamentKakaSaku();

    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(kakasaku.length / itemsPerPage);
    const paginatedKakaSaku = kakasaku.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        const fetchKakaSaku = async () => {
            setLoading(true)
            const { data, error } = await supabase.from(process.env.NEXT_PUBLIC_KAKA_SAKU as string).select('*').order('created_at', { ascending: false })
            if (!error && data) setKakasaku(data as KakaSaku[])
            setLoading(false)
        }
        fetchKakaSaku()
    }, [creating])

    return (
        <section>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border rounded-2xl border-border bg-card shadow-sm gap-4'>
                <div className='flex flex-col gap-3'>
                    <h3 className='text-2xl md:text-3xl font-bold'>
                        Manajemen Kaka Saku
                    </h3>
                    <ol className='flex gap-2 items-center text-sm text-muted-foreground'>
                        <li className='flex items-center hover:text-primary transition-colors'>
                            <span>Dashboard</span>
                            <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
                        </li>
                        <li className='flex items-center text-primary font-medium'>
                            <span>Kaka Saku</span>
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
                            Buat Kaka Saku
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
                        <DialogHeader>
                            <DialogTitle>{isEditMode ? 'Edit Kaka Saku' : 'Create Kaka Saku'}</DialogTitle>
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
                            handleChange={handleChange}
                            handleImageChange={handleImageChange}
                            handleSubmit={handleSubmit}
                            handleDrag={handleDrag}
                            handleDrop={handleDrop}
                            closeModal={closeModal}
                            setImagePreviews={imgs => setImagePreview(imgs[0] || null)}
                            openTimelineModal={openTimelineModal}
                            openEditTimelineModal={openEditTimelineModal}
                            deleteTimelineItem={deleteTimelineItem}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            {/* Donasi Cards Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-8">
                        Loading...
                    </div>
                ) : kakasaku.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 border rounded-2xl bg-white/95 shadow-md">
                        <img src="/globe.svg" alt="No Kakasaku" className="w-20 h-20 mb-4 opacity-80 mx-auto" />
                        <h4 className="text-lg font-semibold mb-1">Belum ada Kaka Saku</h4>
                        <p className="text-muted-foreground text-sm">Donasi belum tersedia. Mulai tambahkan Kaka Saku baru.</p>
                    </div>
                ) : (
                    paginatedKakaSaku.map((item, idx) => (
                        <Card
                            key={item.id}
                            className="relative p-0 bg-white/95 rounded-2xl border border-gray-100 transition-all duration-300 group flex flex-col overflow-hidden"
                        >
                            <div className="flex flex-col h-full">
                                <div className="relative w-full aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {/* Badge Status */}
                                    <span className={`absolute top-2 left-2 px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full z-10 transition-colors duration-200 ${item.status === 'open' ? 'bg-green-100 text-green-800' : item.status === 'closed' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-600'}`}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.title} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 z-0" style={{ aspectRatio: '4/3' }} />
                                    ) : (
                                        <span className="text-gray-400">No image</span>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col gap-2 p-4">
                                    <span className="text-base font-semibold text-gray-900 truncate max-w-[180px]">{item.title}</span>
                                    <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                                        <span>Target: <span className="font-medium">Rp{Number(item.target_amount).toLocaleString()}</span></span>
                                        <span>Terkumpul: <span className="font-medium">Rp{Number(item.current_amount).toLocaleString()}</span></span>
                                        <span>Kaka Saku: <span className="font-medium">{item.kakaksaku || 0}</span></span>
                                    </div>
                                    <span className="text-xs text-gray-500">Deadline: {item.deadline ? new Date(item.deadline).toLocaleDateString('id-ID') : '-'}</span>
                                    <span className="text-xs text-gray-500">Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID')}</span>
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
            {kakasaku.length > itemsPerPage && (
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
            />
            {/* View Modal moved to its own component */}
            <ViewModal
                open={viewModalOpen}
                onOpenChange={open => { if (!open) closeViewModal(); }}
                viewingProduct={viewingProduct}
                onClose={closeViewModal}
            />

            {/* Timeline Modal */}
            <Dialog open={timelineModalOpen} onOpenChange={setTimelineModalOpen}>
                <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
                    <DialogHeader>
                        <DialogTitle>{isTimelineEditMode ? 'Edit Timeline' : 'Add Timeline'}</DialogTitle>
                    </DialogHeader>
                    <TimelineModal
                        isEditMode={isTimelineEditMode}
                        form={timelineForm}
                        setForm={setTimelineForm}
                        uploading={timelineUploading}
                        imagePreview={timelineImagePreview}
                        dragActive={false}
                        inputRef={timelineInputRef}
                        pendingImages={timelinePendingImages}
                        setPendingImages={setTimelinePendingImages}
                        handleChange={handleTimelineChange}
                        handleImageChange={handleTimelineImageChange}
                        handleSubmit={handleTimelineSubmit}
                        handleDrag={() => { }}
                        handleDrop={() => { }}
                        closeModal={closeTimelineModal}
                        setImagePreview={setTimelineImagePreview}
                    />
                </DialogContent>
            </Dialog>
        </section>
    )
}