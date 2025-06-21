import React from 'react';

import { Button } from '@/components/ui/button';

import { DialogFooter, DialogClose } from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { formatIDR, getRawNumberFromIDR } from '@/base/helper/FormatPrice';

import { UploadCloud, Trash2 } from 'lucide-react';

import Image from 'next/image';

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select';

import { Textarea } from '@/components/ui/textarea';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Calendar } from '@/components/ui/calendar';

import { FormModalProps } from '@/interface/volunteer'

import { slugify } from '@/base/helper/slugify';

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
    handleChange,
    handleSubmit,
    handleDrag,
    handleDrop,
    closeModal,
    setImagePreviews,
    handleDeleteFileDocument,
}) => {
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = getRawNumberFromIDR(e.target.value);
        setForm({ ...form, price: rawValue === '' ? 0 : Number(rawValue) });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 space-y-4 w-full max-w-full">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" value={form.title} onChange={handleChange} required />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" name="slug" value={form.slug} readOnly required placeholder="contoh: volunteer-anak-yatim" />
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='flex flex-col gap-2'>
                    <div className="flex items-center gap-2 mb-1">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#E0E7FF" /><path d="M12 8v4l3 3" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" /></svg>
                        <Label htmlFor="category">Kategori</Label>
                    </div>
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
                    <div className="flex items-center gap-2 mb-1">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="2" fill="#E0E7FF" /><path d="M8 11h8M8 15h8" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" /></svg>
                        <Label htmlFor="quota_available">Kuota</Label>
                    </div>
                    <Input id="quota_available" name="quota_available" type="number" value={form.quota_available} onChange={handleChange} required min="0" />
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='flex flex-col gap-2'>
                    <div className="flex items-center gap-2 mb-1">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#E0E7FF" /><path d="M12 8v4l3 3" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" /></svg>
                        <Label htmlFor="time">Waktu</Label>
                    </div>
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
                    <div className="flex items-center gap-2 mb-1">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="10" r="4" fill="#E0E7FF" /><path d="M12 2C7.03 2 3 6.03 3 11c0 5.25 7.5 11 9 11s9-5.75 9-11c0-4.97-4.03-9-9-9z" stroke="#6366F1" strokeWidth="2" /></svg>
                        <Label htmlFor="location">Lokasi</Label>
                    </div>
                    <Input id="location" name="location" value={form.location} onChange={handleChange} required />
                </div>

                <div className='flex flex-col gap-2'>
                    <div className="flex items-center gap-2 mb-1">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="6" y="4" width="12" height="16" rx="2" fill="#E0E7FF" /><path d="M9 8h6M9 12h6M9 16h3" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" /></svg>
                        <Label htmlFor="file_document">File Dokumen</Label>
                    </div>
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

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col gap-2'>
                    <div className="flex items-center gap-2 mb-1">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="2" fill="#E0E7FF" /><path d="M12 8v8M8 12h8" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" /></svg>
                        <Label htmlFor="price">Harga</Label>
                    </div>
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

                <div className='flex flex-col gap-2'>
                    <div className="flex items-center gap-2 mb-1">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#E0E7FF" /><path d="M12 8v4l3 3" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" /></svg>
                        <Label htmlFor="goals">Goals (pisahkan dengan koma)</Label>
                    </div>
                    <Input id="goals" name="goals" value={Array.isArray(form.goals) ? form.goals.join(', ') : form.goals} onChange={e => setForm({ ...form, goals: e.target.value.split(',').map((g: string) => g.trim()) })} required />
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
                    <div className="grid gap-3 mt-3">
                        {imagePreviews.map((url: string, idx: number) => (
                            <div
                                key={idx}
                                className="relative group aspect-[1/1] w-full max-w-xs"
                            >
                                <Image width={1080} height={1080} src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover rounded-md border border-border shadow-sm aspect-[1/1]" />
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-white/80 hover:bg-red-100 text-red-500 rounded-full p-1 shadow transition-opacity opacity-0 group-hover:opacity-100"
                                    style={{ transition: 'opacity 0.2s' }}
                                    onClick={e => {
                                        e.stopPropagation();
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

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col gap-2'>
                    <div className="flex items-center gap-2 mb-1">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="2" fill="#E0E7FF" /><path d="M8 11h8M8 15h8" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" /></svg>
                        <Label htmlFor="detail">Detail</Label>
                    </div>
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
                    <div className="flex items-center gap-2 mb-1">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="2" fill="#E0E7FF" /><path d="M8 11h8M8 15h8" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" /></svg>
                        <Label htmlFor="criteria">Kriteria</Label>
                    </div>
                    <Textarea
                        id="criteria"
                        name="criteria"
                        className="min-h-[80px]"
                        value={form.criteria}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className='flex flex-col gap-2'>
                <div className="flex items-center gap-2 mb-1">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="2" fill="#E0E7FF" /><path d="M8 11h8M8 15h8" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" /></svg>
                    <Label htmlFor="tasks">Tugas</Label>
                </div>
                <Textarea
                    id="tasks"
                    name="tasks"
                    className="min-h-[60px]"
                    value={form.tasks}
                    onChange={handleChange}
                    required
                />
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
