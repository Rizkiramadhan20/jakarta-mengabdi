import React from 'react';

import { Button } from '@/components/ui/button';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { UploadCloud, Trash2 } from 'lucide-react';

interface FormModalProps {
    isEditMode: boolean;
    form: { name: string; thumbnail: string[] };
    setForm: (form: { name: string; thumbnail: string[] }) => void;
    creating: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    closeModal: () => void;
    imagePreviews: string[];
    setImagePreviews: React.Dispatch<React.SetStateAction<string[]>>;
    uploading: boolean;
    uploadProgress: { done: number; total: number };
    inputRef: React.RefObject<HTMLInputElement | null>;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    dragActive: boolean;
    handleDrag: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    pendingImages: File[];
    setPendingImages: (imgs: File[]) => void;
    draggedImageIdx: number | null;
    isDraggingImage: boolean;
    handleImageDragStart: (idx: number) => void;
    handleImageDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    handleImageDrop: (e: React.DragEvent<HTMLDivElement>, idx: number) => void;
    handleImageDragEnd: () => void;
}

const FormModal: React.FC<FormModalProps> = ({
    isEditMode,
    form,
    setForm,
    creating,
    handleChange,
    handleSubmit,
    closeModal,
    imagePreviews,
    setImagePreviews,
    uploading,
    uploadProgress,
    inputRef,
    handleImageChange,
    dragActive,
    handleDrag,
    handleDrop,
    pendingImages,
    setPendingImages,
    draggedImageIdx,
    isDraggingImage,
    handleImageDragStart,
    handleImageDragOver,
    handleImageDrop,
    handleImageDragEnd,
}) => {
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 space-y-4 w-full max-w-full">
            <div className='flex flex-col gap-2'>
                <Label htmlFor="name">Nama JMerch</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className='flex flex-col gap-2'>
                <Label htmlFor="thumbnail">Thumbnail</Label>
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
                            id="thumbnail"
                            name="thumbnail"
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
                            Click or drag images here
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                        {imagePreviews.map((img, idx) => (
                            <div
                                key={idx}
                                className={`relative group cursor-move ${isDraggingImage && draggedImageIdx === idx ? 'opacity-50' : ''}`}
                                draggable
                                onDragStart={() => handleImageDragStart(idx)}
                                onDragOver={handleImageDragOver}
                                onDrop={e => handleImageDrop(e, idx)}
                                onDragEnd={handleImageDragEnd}
                            >
                                <Image
                                    width={1080}
                                    height={1080}
                                    src={img}
                                    alt={`Preview ${idx + 1}`}
                                    className="w-full h-24 object-cover rounded-md border border-border shadow-sm"
                                />
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
                                            setImagePreviews(imagePreviews.filter((imgUrl: string) => imgUrl !== img))
                                            setForm({ ...form, thumbnail: form.thumbnail.filter((imgUrl: string) => imgUrl !== img) })
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
            <DialogFooter>
                <Button type="submit" disabled={creating || uploading}>{isEditMode ? (creating ? 'Menyimpan...' : 'Simpan') : (creating ? 'Membuat...' : 'Buat')}</Button>
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={closeModal}>Batal</Button>
                </DialogClose>
            </DialogFooter>
        </form>
    );
};

export default FormModal;
