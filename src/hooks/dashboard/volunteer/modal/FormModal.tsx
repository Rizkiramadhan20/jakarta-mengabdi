import React from 'react';

import { Button } from '@/components/ui/button';

import { DialogFooter, DialogClose } from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { formatIDR, getRawNumberFromIDR } from '@/base/helper/FormatPrice';

import { UploadCloud, Trash2, Plus, X } from 'lucide-react';

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

import { format } from 'date-fns';

import { FormModalProps } from '@/interface/volunteer'

import QuillEditor from '@/base/helper/QuilEditor';

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
    setPendingImages,
    pendingImages,
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
    // Handler untuk payment_options (jsonb array)
    const addPaymentOption = () => {
        setForm({
            ...form,
            payment_options: [
                ...(form.payment_options || []),
                { type: 'gratis', price: 0 },
            ],
        });
    };
    const updatePaymentOption = (idx: number, key: 'type' | 'price', value: any) => {
        const newOptions = [...(form.payment_options || [])];
        if (key === 'type') {
            newOptions[idx].type = value;
            if (value === 'gratis') newOptions[idx].price = 0;
        } else {
            newOptions[idx].price = value;
        }
        setForm({ ...form, payment_options: newOptions });
    };
    const removePaymentOption = (idx: number) => {
        const newOptions = (form.payment_options || []).filter((_, i) => i !== idx);
        setForm({ ...form, payment_options: newOptions });
    };

    // Helper functions for JSON array management
    const addDetailItem = () => {
        const newDetail = Array.isArray(form.detail) ? [...form.detail, ''] : [''];
        setForm({ ...form, detail: newDetail });
    };

    const updateDetailItem = (index: number, value: string) => {
        const newDetail = Array.isArray(form.detail) ? [...form.detail] : [];
        newDetail[index] = value;
        setForm({ ...form, detail: newDetail });
    };

    const removeDetailItem = (index: number) => {
        const newDetail = Array.isArray(form.detail) ? form.detail.filter((_, i) => i !== index) : [];
        setForm({ ...form, detail: newDetail });
    };

    const addDevisiItem = () => {
        const newDevisi = Array.isArray(form.devisi) ? [...form.devisi, ''] : [''];
        setForm({ ...form, devisi: newDevisi });
    };

    const updateDevisiItem = (index: number, value: string) => {
        const newDevisi = Array.isArray(form.devisi) ? [...form.devisi] : [];
        newDevisi[index] = value;
        setForm({ ...form, devisi: newDevisi });
    };

    const removeDevisiItem = (index: number) => {
        const newDevisi = Array.isArray(form.devisi) ? form.devisi.filter((_, i) => i !== index) : [];
        setForm({ ...form, devisi: newDevisi });
    };

    const addTimelineItem = () => {
        const newTimeline = Array.isArray(form.timeline) ? [...form.timeline, ''] : [''];
        setForm({ ...form, timeline: newTimeline });
    };

    const updateTimelineItem = (index: number, value: string) => {
        const newTimeline = Array.isArray(form.timeline) ? [...form.timeline] : [];
        newTimeline[index] = value;
        setForm({ ...form, timeline: newTimeline });
    };

    const removeTimelineItem = (index: number) => {
        const newTimeline = Array.isArray(form.timeline) ? form.timeline.filter((_, i) => i !== index) : [];
        setForm({ ...form, timeline: newTimeline });
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

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="form_link">Form Link</Label>
                    <Input id="form_link" name="form_link" value={form.form_link} onChange={handleChange} required placeholder="https://..." />
                </div>

                <div className='flex flex-col gap-2'>
                    <Label htmlFor="location">Lokasi</Label>
                    <Input id="location" name="location" value={form.location} onChange={handleChange} required />
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* WAKTU MULAI */}
                <div className='flex flex-col'>
                    <Label htmlFor="time">Waktu Mulai</Label>
                    <div className="flex gap-2 items-end">
                        <div className="flex flex-col flex-1">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`w-full h-10 justify-start text-left font-normal rounded-md border px-3 py-2 text-sm ${!form.time ? 'text-muted-foreground' : ''}`}
                                    >
                                        {form.time ? format(new Date(form.time), 'dd/MM/yyyy') : 'Pilih tanggal mulai'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={form.time ? new Date(form.time) : undefined}
                                        onSelect={date => {
                                            if (!date) return;
                                            const prev = form.time ? new Date(form.time) : new Date();
                                            const jam = prev.getHours().toString().padStart(2, '0');
                                            const menit = prev.getMinutes().toString().padStart(2, '0');
                                            const iso = `${format(date, 'yyyy-MM-dd')}T${jam}:${menit}`;
                                            setForm({ ...form, time: iso });
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="flex flex-col items-start">
                            <span className="text-xs text-muted-foreground ml-1">Jam</span>
                            <Input
                                type="time"
                                value={form.time ? format(new Date(form.time), 'HH:mm') : ''}
                                onChange={e => {
                                    const date = form.time ? new Date(form.time) : new Date();
                                    const [jam, menit] = e.target.value.split(':');
                                    date.setHours(Number(jam));
                                    date.setMinutes(Number(menit));
                                    const iso = format(date, "yyyy-MM-dd'T'HH:mm");
                                    setForm({ ...form, time: iso });
                                }}
                                className="w-24 h-10"
                                required
                            />
                        </div>
                    </div>
                </div>
                {/* WAKTU SELESAI */}
                <div className='flex flex-col'>
                    <Label htmlFor="last_time">Waktu Selesai</Label>
                    <div className="flex gap-2 items-end">
                        <div className="flex flex-col flex-1">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`w-full h-10 justify-start text-left font-normal rounded-md border px-3 py-2 text-sm ${!form.last_time ? 'text-muted-foreground' : ''}`}
                                    >
                                        {form.last_time ? format(new Date(form.last_time), 'dd/MM/yyyy') : 'Pilih tanggal selesai'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={form.last_time ? new Date(form.last_time) : undefined}
                                        onSelect={date => {
                                            if (!date) return;
                                            const prev = form.last_time ? new Date(form.last_time) : new Date();
                                            const jam = prev.getHours().toString().padStart(2, '0');
                                            const menit = prev.getMinutes().toString().padStart(2, '0');
                                            const iso = `${format(date, 'yyyy-MM-dd')}T${jam}:${menit}`;
                                            setForm({ ...form, last_time: iso });
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-xs text-muted-foreground ml-1">Jam</span>
                            <Input
                                type="time"
                                value={form.last_time ? format(new Date(form.last_time), 'HH:mm') : ''}
                                onChange={e => {
                                    const date = form.last_time ? new Date(form.last_time) : new Date();
                                    const [jam, menit] = e.target.value.split(':');
                                    date.setHours(Number(jam));
                                    date.setMinutes(Number(menit));
                                    const iso = format(date, "yyyy-MM-dd'T'HH:mm");
                                    setForm({ ...form, last_time: iso });
                                }}
                                className="w-24 h-10"
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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

                {/* OPSI PEMBAYARAN JSONB */}
                <div className="flex flex-col gap-2 w-full">
                    <Label>Opsi Pembayaran</Label>
                    {(form.payment_options || []).map((opt, idx) => (
                        <div key={idx} className="flex gap-2 items-center w-full">
                            <Select
                                value={opt.type}
                                onValueChange={val => updatePaymentOption(idx, 'type', val as 'berbayar' | 'gratis')}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="berbayar">Berbayar</SelectItem>
                                    <SelectItem value="gratis">Gratis</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                type="text"
                                className="w-full"
                                placeholder="Harga"
                                value={opt.type === 'gratis' ? '' : (opt.price === 0 ? '' : formatIDR(Number(opt.price)))}
                                onChange={e => updatePaymentOption(idx, 'price', getRawNumberFromIDR(e.target.value))}
                                disabled={opt.type === 'gratis'}
                                required={opt.type === 'berbayar'}
                                min="0"
                                inputMode="numeric"
                                pattern="[0-9.]*"
                            />
                            <Button type="button" size="icon" variant="destructive" onClick={() => removePaymentOption(idx)}><Trash2 size={16} /></Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addPaymentOption} className="w-fit mt-1"><Plus size={16} className="mr-2" />Tambah Opsi Pembayaran</Button>
                </div>
            </div>

            {/* IMAGE UPLOAD SECTION */}
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
                                <Image width={1080} height={1080} src={url} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover rounded-md border border-border shadow-sm" />
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
                                            setForm({ ...form, img_url: form.img_url.filter((imgUrl: string) => imgUrl !== url) })
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

            <div className='grid grid-cols-1 gap-10'>
                <div className='flex flex-col gap-2'>
                    <div className="flex items-center gap-2 mb-1">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="2" fill="#E0E7FF" /><path d="M12 8v8M8 12h8" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" /></svg>
                        <Label htmlFor="description">Deskripsi</Label>
                    </div>
                    <Textarea
                        id="description"
                        name="description"
                        className="min-h-[80px]"
                        value={form.description}
                        onChange={handleChange}
                        required
                        placeholder="Masukkan deskripsi singkat tentang volunteer ini..."
                    />
                </div>

                <div className='flex flex-col gap-2'>
                    <div className="flex items-center gap-2 mb-1">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="2" fill="#E0E7FF" /><path d="M8 11h8M8 15h8" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" /></svg>
                        <Label>Detail (JSON Array)</Label>
                    </div>
                    <div className="space-y-2">
                        {Array.isArray(form.detail) && form.detail.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={item}
                                    onChange={(e) => updateDetailItem(index, e.target.value)}
                                    placeholder={`Detail item ${index + 1}`}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeDetailItem(index)}
                                >
                                    <X size={16} />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addDetailItem}
                            className="w-full"
                        >
                            <Plus size={16} className="mr-2" />
                            Tambah Detail
                        </Button>
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <div className="flex items-center gap-2 mb-1">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="2" fill="#E0E7FF" /><path d="M8 11h8M8 15h8" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" /></svg>
                        <Label>Devisi (JSON Array)</Label>
                    </div>
                    <div className="space-y-2">
                        {Array.isArray(form.devisi) && form.devisi.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={item}
                                    onChange={(e) => updateDevisiItem(index, e.target.value)}
                                    placeholder={`Devisi item ${index + 1}`}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeDevisiItem(index)}
                                >
                                    <X size={16} />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addDevisiItem}
                            className="w-full"
                        >
                            <Plus size={16} className="mr-2" />
                            Tambah Devisi
                        </Button>
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <div className="flex items-center gap-2 mb-1">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="2" fill="#E0E7FF" /><path d="M8 11h8M8 15h8" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" /></svg>
                        <Label>Timeline (JSON Array)</Label>
                    </div>
                    <div className="space-y-2">
                        {Array.isArray(form.timeline) && form.timeline.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={item}
                                    onChange={(e) => updateTimelineItem(index, e.target.value)}
                                    placeholder={`Timeline item ${index + 1}`}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeTimelineItem(index)}
                                >
                                    <X size={16} />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addTimelineItem}
                            className="w-full"
                        >
                            <Plus size={16} className="mr-2" />
                            Tambah Timeline
                        </Button>
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <div className="flex items-center gap-2 mb-1">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="2" fill="#E0E7FF" /><path d="M8 11h8M8 15h8" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" /></svg>
                        <Label htmlFor="content">Konten</Label>
                    </div>

                    <QuillEditor
                        value={form.content}
                        onChange={val => setForm({ ...form, content: val })}
                        placeholder="Masukkan konten lengkap tentang volunteer ini..."
                        className="min-h-[250px]"
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
