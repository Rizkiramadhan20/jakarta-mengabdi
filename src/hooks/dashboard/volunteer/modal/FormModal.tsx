import React from 'react';

import { Button } from '@/components/ui/button';

import { DialogFooter, DialogClose } from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { formatIDR, getRawNumberFromIDR } from '@/base/helper/FormatPrice';

import { UploadCloud, Trash2 } from 'lucide-react';

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select';

import type { Volunteer } from '@/types/volunteer';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

interface FormModalProps {
    isEditMode: boolean;
    form: Volunteer | Omit<Volunteer, 'id' | 'created_at' | 'updated_at'>;
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
    handleDeleteFileDocument: (fileUrl: string) => Promise<void>;
}

const CATEGORIES = [
    'pilar cerdas',
    'pilar sehat',
    'pilar lestari',
    'pilar peduli',
];

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
    handleDeleteFileDocument,
}) => {
    // Custom handler for price input
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = getRawNumberFromIDR(e.target.value);
        setForm({ ...form, price: rawValue === '' ? 0 : Number(rawValue) });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 space-y-4 w-full max-w-full">
            <div className='flex flex-col gap-2'>
                <Label htmlFor="title">Judul Volunteer</Label>
                <Input id="title" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="category">Kategori</Label>
                    <Select
                        value={form.category}
                        onValueChange={value => setForm({ ...form, category: value })}
                    >
                        <SelectTrigger className="w-full rounded-md border px-3 py-2 text-sm">
                            <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="quota_available">Kuota</Label>
                    <Input id="quota_available" name="quota_available" type="number" value={form.quota_available} onChange={handleChange} required min="0" />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="price">Harga</Label>
                    <Input
                        id="price"
                        name="price"
                        type="text"
                        value={form.price === 0 ? '' : formatIDR(Number(form.price))}
                        onChange={handlePriceChange}
                        required
                        min="0"
                        inputMode="numeric"
                        pattern="[0-9.]*"
                    />
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="time">Waktu</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={`w-full justify-start text-left font-normal rounded-md border px-3 py-2 text-sm ${!form.time ? 'text-muted-foreground' : ''}`}
                            >
                                {form.time ? new Date(form.time).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short', hour12: false }) : 'Pilih tanggal & waktu'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={form.time ? new Date(form.time) : undefined}
                                onSelect={date => {
                                    if (date) {
                                        setForm({ ...form, time: date.toISOString().slice(0, 16) });
                                    }
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="location">Lokasi</Label>
                    <Input id="location" name="location" value={form.location} onChange={handleChange} required />
                </div>

                <div className='flex flex-col gap-2'>
                    <Label htmlFor="file_document">File Dokumen</Label>
                    <Input
                        id="file_document"
                        name="file_document"
                        type="file"
                        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip,application/x-zip-compressed,application/octet-stream"
                        onChange={e => {
                            const file = e.target.files && e.target.files[0];
                            if (file) {
                                setForm({ ...form, file_document: file });
                            }
                        }}
                    />
                    {typeof form.file_document === 'object' && form.file_document !== null && 'name' in form.file_document && (
                        <span className="text-xs text-muted-foreground mt-1">{(form.file_document as File).name}</span>
                    )}
                    {typeof form.file_document === 'string' && form.file_document && (
                        <div className="flex items-center gap-2 mt-1">
                            <a
                                href={form.file_document}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 underline"
                            >
                                Lihat dokumen lama
                            </a>
                            <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="text-xs px-2 py-1"
                                onClick={async () => {
                                    await handleDeleteFileDocument(form.file_document as string);
                                    setForm({ ...form, file_document: '' });
                                }}
                            >
                                Hapus
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <Label htmlFor="img_url">Gambar</Label>
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
                            id="img_url"
                            name="img_url"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={uploading}
                            ref={inputRef}
                            style={{ display: 'none' }}
                        />
                        <UploadCloud className="w-8 h-8 text-muted-foreground mb-1" />
                        <span className="text-muted-foreground font-medium">
                            {dragActive ? 'Drop image here...' : 'Click or drag image here'}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">Max file size: 2MB. JPG, PNG, or GIF.</span>
                    </div>
                )}
                {uploading && (
                    <div className="text-xs text-muted-foreground mt-1">
                        Uploading... {uploadProgress.done}/{uploadProgress.total} image
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
                                        setPendingImages([]);
                                        setImagePreviews([]);
                                        setForm({ ...form, img_url: '' });
                                    }}
                                    title="Remove image"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className='flex flex-col gap-2'>
                <Label htmlFor="detail">Detail</Label>
                <Textarea
                    id="detail"
                    name="detail"
                    className="min-h-[80px]"
                    value={form.detail}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className='flex flex-col gap-2'>
                <Label htmlFor="criteria">Kriteria</Label>
                <Textarea
                    id="criteria"
                    name="criteria"
                    className="min-h-[60px]"
                    value={form.criteria}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className='flex flex-col gap-2'>
                <Label htmlFor="tasks">Tugas</Label>
                <Textarea
                    id="tasks"
                    name="tasks"
                    className="min-h-[60px]"
                    value={form.tasks}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className='flex flex-col gap-2'>
                <Label htmlFor="goals">Goals (pisahkan dengan koma)</Label>
                <Input id="goals" name="goals" value={Array.isArray(form.goals) ? form.goals.join(', ') : form.goals} onChange={e => setForm({ ...form, goals: e.target.value.split(',').map((g: string) => g.trim()) })} required />
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
