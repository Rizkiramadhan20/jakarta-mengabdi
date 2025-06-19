"use client"

import React, { useEffect } from 'react'

import { Button } from '@/components/ui/button'

import { ChevronRight, Image as ImageIcon, } from "lucide-react"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { supabase } from '@/utils/supabase/supabase'

import type { Product } from '@/types/products'

import { useReactTable, getCoreRowModel, ColumnDef } from '@tanstack/react-table';

import { useManagamentProducts } from '@/hooks/dashboard/products/utils/useManagamentProducts';

import FormModal from '@/hooks/dashboard/products/modal/FormModal';

import ViewModal from '@/hooks/dashboard/products/modal/ViewModal';

import DeleteModal from '@/hooks/dashboard/products/modal/DeleteModal';

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

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
            if (!error && data) setProducts(data as Product[])
            setLoading(false)
        }
        fetchProducts()
    }, [creating])

    // Table columns definition
    const columns = React.useMemo<ColumnDef<Product, any>[]>(() => [
        {
            header: 'Image',
            accessorKey: 'image_urls',
            cell: ({ row }) => {
                const urls = row.original.image_urls;
                return urls && urls.length > 0 ? (
                    <img src={urls[0]} alt={row.original.name} className="w-16 h-16 object-cover rounded-md border" />
                ) : (
                    <span className="text-muted-foreground">No image</span>
                );
            },
        },
        {
            header: 'Name',
            accessorKey: 'name',
        },
        {
            header: 'Price',
            accessorKey: 'price',
            cell: ({ getValue }) => `Rp${Number(getValue() as number).toLocaleString()}`,
        },
        {
            header: 'Stock',
            accessorKey: 'stock',
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ getValue }) => {
                const status = getValue() as string;
                return (
                    <span className={
                        status === 'tersedia' ? 'text-green-600 font-semibold' :
                            status === 'tidak tersedia' ? 'text-red-600 font-semibold' :
                                'text-gray-500 font-semibold'
                    }>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                );
            },
        },
        {
            header: 'Created At',
            accessorKey: 'created_at',
            cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString('id-ID'),
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openViewModal(row.original)}>
                        View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEditModal(row.original)}>
                        Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => {
                        setDeletingId(row.original.id);
                        setDeleteModalOpen(true);
                    }}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ], [openEditModal, openViewModal]);

    const table = useReactTable({
        data: products,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <section>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border rounded-2xl border-border bg-card shadow-sm gap-4'>
                <div className='flex flex-col gap-3'>
                    <h3 className='text-2xl md:text-3xl font-bold'>
                        Products
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
                            Create Content
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
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
            {/* Product Table */}
            <div className="mt-8 overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200/80">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-4 sm:px-6 py-5 text-left text-xs sm:text-sm font-semibold text-gray-600 tracking-wider">Image</th>
                                <th className="px-4 sm:px-6 py-5 text-left text-xs sm:text-sm font-semibold text-gray-600 tracking-wider">Name</th>
                                <th className="px-4 sm:px-6 py-5 text-left text-xs sm:text-sm font-semibold text-gray-600 tracking-wider">Price</th>
                                <th className="px-4 sm:px-6 py-5 text-left text-xs sm:text-sm font-semibold text-gray-600 tracking-wider">Stock</th>
                                <th className="px-4 sm:px-6 py-5 text-left text-xs sm:text-sm font-semibold text-gray-600 tracking-wider">Status</th>
                                <th className="px-4 sm:px-6 py-5 text-left text-xs sm:text-sm font-semibold text-gray-600 tracking-wider">Created At</th>
                                <th className="px-4 sm:px-6 py-5 text-xs sm:text-sm font-semibold text-gray-600 tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/80 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center px-4 py-6">Loading...</td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center px-4 py-8">
                                        <div className="flex flex-col items-center justify-center py-8">
                                            <img src="/globe.svg" alt="No products" className="w-20 h-20 mb-4 opacity-80 mx-auto" />
                                            <h4 className="text-lg font-semibold mb-1">Belum ada produk</h4>
                                            <p className="text-muted-foreground text-sm">Produk belum tersedia. Mulai tambahkan produk baru untuk mengisi toko Anda.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product, idx) => (
                                    <tr key={product.id} className="hover:bg-gray-50/80 transition-colors duration-200">
                                        <td className="px-4 sm:px-6 py-5 whitespace-nowrap">
                                            {product.image_urls && product.image_urls.length > 0 ? (
                                                <img src={product.image_urls[0]} alt={product.name} className="w-16 h-16 object-cover rounded-md border" />
                                            ) : (
                                                <span className="text-gray-400">No image</span>
                                            )}
                                        </td>
                                        <td className="px-4 sm:px-6 py-5 whitespace-nowrap">
                                            <span className="text-sm sm:text-base font-medium text-gray-900">{product.name}</span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-5 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">Rp{Number(product.price).toLocaleString()}</span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-5 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">{product.stock}</span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-5 whitespace-nowrap">
                                            <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-medium rounded-full transition-colors duration-200 ${product.status === 'tersedia' ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' : product.status === 'tidak tersedia' ? 'bg-red-50 text-red-700 ring-1 ring-red-600/20' : 'bg-gray-100 text-gray-500 ring-1 ring-gray-400/20'}`}>{product.status.charAt(0).toUpperCase() + product.status.slice(1)}</span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-5 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">{new Date(product.created_at).toLocaleDateString('id-ID')}</span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <button
                                                    className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all duration-200"
                                                    onClick={() => openViewModal(product)}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-all duration-200"
                                                    onClick={() => openEditModal(product)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-all duration-200"
                                                    onClick={() => {
                                                        setDeletingId(product.id);
                                                        setDeleteModalOpen(true);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
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