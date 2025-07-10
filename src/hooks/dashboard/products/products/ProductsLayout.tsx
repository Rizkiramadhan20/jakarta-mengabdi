"use client"

import React, { useEffect } from 'react'

import { Button } from '@/components/ui/button'

import { ChevronRight, Image as ImageIcon, Search } from "lucide-react"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { supabase } from '@/utils/supabase/supabase'

import type { Product } from '@/interface/products'

import { useManagamentProducts } from '@/hooks/dashboard/products/products/utils/useManagamentProducts';

import FormModal from '@/hooks/dashboard/products/products/modal/FormModal';

import ViewModal from '@/hooks/dashboard/products/products/modal/ViewModal';

import DeleteModal from '@/hooks/dashboard/products/products/modal/DeleteModal';

import ProductsSkelaton from '@/hooks/dashboard/products/products/ProductsSkelaton'

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination'

import { Card } from '@/components/ui/card'

import Image from 'next/image'

import { Input } from '@/components/ui/input'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ProductsLayout() {
    const {
        products, setProducts,
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
        viewingProduct,
        categories,
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
    } = useManagamentProducts();

    const [currentPage, setCurrentPage] = React.useState(1);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('');
    const itemsPerPage = 10;

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            const { data, error } = await supabase.from(process.env.NEXT_PUBLIC_PRODUCTS as string).select('*').order('created_at', { ascending: false })
            if (!error && data) setProducts(data as Product[])
            setLoading(false)
        }
        fetchProducts()
    }, [creating])

    return (
        <section>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border rounded-2xl border-border bg-card shadow-sm gap-4'>
                <div className='flex flex-col gap-3'>
                    <h3 className='text-2xl md:text-3xl font-bold'>
                        Manajemen Produk
                    </h3>
                    <ol className='flex gap-2 items-center text-sm text-muted-foreground'>
                        <li className='flex items-center hover:text-primary transition-colors'>
                            <span>Dashboard</span>
                            <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
                        </li>
                        <li className='flex items-center text-primary font-medium'>
                            <span>Products</span>
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
                            Buat Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-6xl max-h-[90vh] overflow-y-auto'>
                        <DialogHeader>
                            <DialogTitle>{isEditMode ? 'Edit Product' : 'Create Product'}</DialogTitle>
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
                            categories={categories}
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
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <div className="mt-6 mb-4 w-full md:w-fit flex flex-col md:flex-row items-center gap-3 md:gap-6 bg-white/80 border border-gray-200 rounded-xl shadow-sm px-4 py-3">
                <div className="relative w-full md:w-72">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search className="w-5 h-5" />
                    </span>
                    <Input
                        placeholder="Cari produk..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-3 bg-white border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition placeholder:text-gray-400"
                    />
                </div>
                <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value === 'all' ? '' : value)}>
                    <SelectTrigger className="w-full md:w-48 h-10 bg-white border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition">
                        <SelectValue placeholder="Semua Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        {categories.map((cat, index) => (
                            <SelectItem key={index} value={cat.name}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {/* Product Cards Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <ProductsSkelaton />
                ) : products.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 border rounded-2xl bg-white/95 shadow-md">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="w-20 h-20 mb-4 opacity-80 mx-auto" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#888" strokeWidth="2" fill="#f3f4f6" />
                            <path d="M8 15c1.333-2 6.667-2 8 0" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
                            <circle cx="9" cy="10" r="1" fill="#888" />
                            <circle cx="15" cy="10" r="1" fill="#888" />
                        </svg>
                        <h4 className="text-lg font-semibold mb-1">Belum ada produk</h4>
                        <p className="text-muted-foreground text-sm">Produk belum tersedia. Mulai tambahkan produk baru untuk mengisi toko Anda.</p>
                    </div>
                ) : paginatedProducts.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-8 border rounded-2xl bg-white/95 shadow-md">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="w-20 h-20 mb-4 opacity-80 mx-auto" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#888" strokeWidth="2" fill="#f3f4f6" />
                            <path d="M8 15c1.333-2 6.667-2 8 0" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
                            <circle cx="9" cy="10" r="1" fill="#888" />
                            <circle cx="15" cy="10" r="1" fill="#888" />
                        </svg>
                        <h4 className="text-lg font-semibold mb-1">Produk tidak ditemukan</h4>
                        <p className="text-muted-foreground text-sm">Tidak ada produk yang cocok dengan kriteria pencarian Anda.</p>
                    </div>
                ) : (
                    paginatedProducts.map((product, idx) => (
                        <Card
                            key={idx}
                            className="relative p-0 bg-white/95 rounded-2xl border border-gray-100 transition-all duration-300 group flex flex-col overflow-hidden"
                        >
                            <div className="flex flex-col h-full">
                                <div className="relative w-full aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {/* Badge Stok & Terjual */}
                                    <span className="absolute bottom-2 left-2 bg-white/90 text-xs font-semibold text-gray-800 rounded-full px-3 py-1 shadow-sm border border-gray-200 select-none z-10">
                                        Stok: {product.stock}
                                    </span>
                                    <span className="absolute bottom-2 left-[85] bg-white/90 text-xs font-semibold text-gray-800 rounded-full px-3 py-1 shadow-sm border border-gray-200 select-none z-10">
                                        Terjual: {product.sold}
                                    </span>
                                    {product.image_urls && product.image_urls.length > 0 ? (
                                        <Image
                                            src={product.image_urls[0]}
                                            width={1080}
                                            height={810}
                                            alt={product.name}
                                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 z-0"
                                            style={{ aspectRatio: '4/3' }}
                                            priority={idx < 3}
                                        />
                                    ) : (
                                        <span className="text-gray-400">No image</span>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col gap-2 p-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-base font-semibold text-gray-900 truncate max-w-[180px]">{product.name}</span>
                                        <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors duration-200 ${product.status === 'tersedia' ? 'bg-green-100 text-green-800' : product.status === 'tidak tersedia' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-600'}`}>{product.status.charAt(0).toUpperCase() + product.status.slice(1)}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                                        <span>Harga: <span className="font-medium">Rp{Number(product.price).toLocaleString()}</span></span>
                                    </div>
                                    <span className="text-xs text-gray-500">Dibuat: {new Date(product.created_at).toLocaleDateString('id-ID')}</span>
                                    <div className="flex flex-row gap-2 mt-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 min-w-[80px]"
                                            onClick={() => openViewModal(product)}
                                        >
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 min-w-[80px]"
                                            onClick={() => openEditModal(product)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 min-w-[80px]"
                                            onClick={() => {
                                                setDeletingId(product.id);
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
            {filteredProducts.length > itemsPerPage && (
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
        </section>
    )
}