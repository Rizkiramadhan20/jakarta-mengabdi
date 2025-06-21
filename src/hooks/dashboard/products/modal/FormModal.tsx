import React from 'react';

import { Button } from '@/components/ui/button';

import { DialogFooter, DialogClose } from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import QuilEditor from '@/base/helper/QuilEditor';

import { formatIDR } from '@/base/helper/FormatPrice';

import { UploadCloud, Trash2 } from 'lucide-react';

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select';

interface FormModalProps {
    isEditMode: boolean;
    form: any;
    setForm: (form: any) => void;
    creating: boolean;
    uploading: boolean;
    imagePreviews: string[];
    dragActive: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
    uploadProgress: { done: number; total: number };
    pendingImages: File[];
    setPendingImages: (imgs: File[]) => void;
    draggedImageIdx: number | null;
    isDraggingImage: boolean;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleDrag: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    handleImageDragStart: (idx: number) => void;
    handleImageDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    handleImageDrop: (e: React.DragEvent<HTMLDivElement>, idx: number) => void;
    handleImageDragEnd: () => void;
    closeModal: () => void;
    setImagePreviews: (imgs: string[]) => void;
}

const FormModal: React.FC<FormModalProps> = ({
    isEditMode,
    form,
    setForm,
    creating,
    uploading,
    imagePreviews,
    dragActive,
    inputRef,
    uploadProgress,
    pendingImages,
    setPendingImages,
    draggedImageIdx,
    isDraggingImage,
    handleChange,
    handleImageChange,
    handleSubmit,
    handleDrag,
    handleDrop,
    handleImageDragStart,
    handleImageDragOver,
    handleImageDrop,
    handleImageDragEnd,
    closeModal,
    setImagePreviews,
}) => {
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 space-y-4 w-full max-w-full">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" name="slug" value={form.slug} readOnly required placeholder="contoh: produk-anak-yatim" />
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="price">Harga</Label>
                    <Input id="price" name="price" type="text" value={form.price === 0 ? '' : formatIDR(form.price)} onChange={handleChange} required min="0" />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="stock">Stok</Label>
                    <Input id="stock" name="stock" type="text" value={form.stock === 0 ? '' : form.stock.toString()} onChange={handleChange} required min="0" />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={form.status}
                        onValueChange={value => setForm({ ...form, status: value })}
                    >
                        <SelectTrigger className="w-full rounded-md border px-3 py-2 text-sm">
                            <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tidak tersedia">Tidak Tersedia</SelectItem>
                            <SelectItem value="tersedia">Tersedia</SelectItem>
                            <SelectItem value="arsip">Arsip</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <Label htmlFor="images">Images</Label>
                {imagePreviews.length === 0 && (
                    <div
                        onClick={() => inputRef.current?.click()}
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors relative min-h-[120px] select-none
                            ${uploading ? 'border-primary bg-accent/30' : dragActive ? 'border-blue-500 bg-blue-50' : 'border-border bg-background'}
                            hover:border-primary hover:bg-accent/20
                        `}
                        style={{ minHeight: 120 }}
                    >
                        <input
                            id="images"
                            name="images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            disabled={uploading}
                            ref={inputRef}
                            style={{ display: 'none' }}
                        />
                        <UploadCloud className="w-8 h-8 text-muted-foreground mb-1" />
                        <span className="text-muted-foreground font-medium">
                            {dragActive ? 'Drop images here...' : 'Click or drag images here'}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">Max file size: 2MB. JPG, PNG, or GIF.</span>
                    </div>
                )}
                {uploading && (
                    <div className="text-xs text-muted-foreground mt-1">
                        Uploading... {uploadProgress.done}/{uploadProgress.total} images
                        <div className="w-full bg-muted h-2 rounded mt-1">
                            <div
                                className="bg-primary h-2 rounded transition-all"
                                style={{ width: `${uploadProgress.total > 0 ? (uploadProgress.done / uploadProgress.total) * 100 : 0}%` }}
                            />
                        </div>
                    </div>
                )}
                {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-3">
                        {imagePreviews.map((url: string, idx: number) => (
                            <div
                                key={idx}
                                className={`relative group cursor-move ${isDraggingImage && draggedImageIdx === idx ? 'opacity-50' : ''}`}
                                draggable
                                onDragStart={() => handleImageDragStart(idx)}
                                onDragOver={handleImageDragOver}
                                onDrop={e => handleImageDrop(e, idx)}
                                onDragEnd={handleImageDragEnd}
                            >
                                <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover rounded-md border border-border shadow-sm" />
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-white/80 hover:bg-red-100 text-red-500 rounded-full p-1 shadow transition-opacity opacity-0 group-hover:opacity-100"
                                    style={{ transition: 'opacity 0.2s' }}
                                    onClick={e => {
                                        e.stopPropagation();
                                        if (pendingImages.length > 0) {
                                            setPendingImages(pendingImages.filter((_, i) => i !== idx))
                                            setImagePreviews(imagePreviews.filter((_, i) => i !== idx))
                                        } else {
                                            setImagePreviews(imagePreviews.filter((imgUrl: string) => imgUrl !== url))
                                            setForm({ ...form, image_urls: form.image_urls.filter((imgUrl: string) => imgUrl !== url) })
                                        }
                                    }}
                                    title="Remove image"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity pointer-events-none">
                                    Geser untuk urutkan
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className='flex flex-col gap-2'>
                <Label htmlFor="content">Deskripsi</Label>
                <div className="bg-white rounded-md border px-1 py-1">
                    <QuilEditor
                        value={form.content}
                        onChange={(val: string) => setForm({ ...form, content: val })}
                        placeholder="Enter content..."
                        height="200px"
                    />
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" disabled={creating || uploading}>{isEditMode ? (creating ? 'Saving...' : 'Save') : (creating ? 'Creating...' : 'Create')}</Button>
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                </DialogClose>
            </DialogFooter>
        </form>
    );
};

export default FormModal;
