import React from 'react';

import { Button } from '@/components/ui/button';

import { DialogFooter, DialogClose } from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';

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

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';

import {
    Calendar,
} from '@/components/ui/calendar';

import { slugify } from '@/base/helper/slugify';

import { FormModalProps } from "@/interface/donasi"

import QuillEditor from '@/base/helper/QuilEditor';

const FormModal: React.FC<FormModalProps> = ({
    isEditMode,
    form,
    setForm,
    creating,
    uploading,
    imagePreviews,
    inputRef,
    uploadProgress,
    handleChange,
    handleImageChange,
    handleSubmit,
    closeModal,
    setImagePreviews,
}) => {
    const handleTargetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = getRawNumberFromIDR(e.target.value);
        setForm({ ...form, target_amount: rawValue });
    };

    // Update slug otomatis saat title berubah
    React.useEffect(() => {
        setForm((prev: any) => ({ ...prev, slug: slugify(form.title) }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.title]);

    React.useEffect(() => {
        if (!form.message_template) {
            setForm((prev: any) => ({
                ...prev,
                message_template: 'Terima kasih, {name}.\nKamu telah berhasil melakukan transaksi donasi sebesar {amount} untuk {title}.\n\n🕒 Waktu Transaksi: {transaction_time}\n📝 Status Pembayaran: {status}\n\nSimpan pesan ini sebagai bukti transaksi.\nAda pertanyaan? Hubungi kami kapan saja.\n\n✨ Makasih banyak, {name}!\n\n🎯 Program: {title}\n💸 Donasi: {amount}\n🟢 Status: {status}\n🗓️ Waktu: {transaction_time}'
            }));
        }
    }, []);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 space-y-4 w-full max-w-full">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" value={form.title} onChange={handleChange} required />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" name="slug" value={form.slug} readOnly required placeholder="contoh: donasi-anak-yatim" />
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor="target_amount">Target Amount</Label>
                    <Input
                        id="target_amount"
                        name="target_amount"
                        type="text"
                        value={form.target_amount ? formatIDR(Number(form.target_amount)) : ''}
                        onChange={handleTargetAmountChange}
                        required
                        min="0"
                        inputMode="numeric"
                        pattern="[0-9.]*"
                    />
                </div>

                <div className='flex flex-col gap-2'>
                    <Label htmlFor="deadline">Deadline</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={
                                    `w-full justify-start text-left font-normal rounded-md border px-3 py-2 text-sm ${!form.deadline ? 'text-muted-foreground' : ''}`
                                }
                            >
                                {form.deadline ? new Date(form.deadline).toLocaleDateString('id-ID') : 'Pilih tanggal deadline'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={form.deadline ? new Date(form.deadline) : undefined}
                                onSelect={date => {
                                    setForm({ ...form, deadline: date ? date.toISOString().slice(0, 10) : '' });
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
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
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className='flex flex-col gap-2'>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={form.description} onChange={handleChange} required className="h-32 resize-none" />
            </div>

            <div className='flex flex-col gap-2'>
                <Label htmlFor="content">Content</Label>
                <QuillEditor
                    value={form.content || ''}
                    onChange={(val: string) => setForm({ ...form, content: val })}
                    placeholder="Tulis konten lengkap donasi di sini..."
                    className="bg-white"
                    height="250px"
                />
            </div>

            <div className='flex flex-col gap-2'>
                <Label htmlFor="message_template">Message Template</Label>
                <Textarea id="message_template" name="message_template" value={form.message_template || ''} onChange={handleChange} className="h-32 resize-none" />
            </div>

            <div className='flex flex-col gap-2'>
                <Label htmlFor="images">Image</Label>
                {imagePreviews.length === 0 && (
                    <div
                        onClick={() => inputRef.current?.click()}
                        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors relative min-h-[120px] select-none
                            ${uploading ? 'border-primary bg-accent/30' : 'border-border bg-background'}
                            hover:border-primary hover:bg-accent/20
                        `}
                        style={{ minHeight: 120 }}
                    >
                        <input
                            id="images"
                            name="images"
                            type="file"
                            accept="image/*"
                            multiple={false}
                            onChange={handleImageChange}
                            disabled={uploading}
                            ref={inputRef}
                            style={{ display: 'none' }}
                        />
                        <UploadCloud className="w-8 h-8 text-muted-foreground mb-1" />
                        <span className="text-muted-foreground font-medium">
                            {uploading ? 'Uploading...' : 'Click or drag image here'}
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
                    <div className="grid grid-cols-1 gap-3 mt-3">
                        <div className="relative group aspect-square min-h-[50px]">
                            <Image
                                width={1080}
                                height={1080}
                                src={imagePreviews[0]}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-md border border-border shadow-sm aspect-square"
                            />
                            <button
                                type="button"
                                className="absolute top-1 right-1 bg-white/80 hover:bg-red-100 text-red-500 rounded-full p-1 shadow transition-opacity opacity-100"
                                style={{ transition: 'opacity 0.2s' }}
                                onClick={e => {
                                    e.stopPropagation();
                                    setImagePreviews([]);
                                    setForm({ ...form, image_url: '' });
                                }}
                                title="Remove image"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <DialogFooter className="mt-4">
                <Button type="submit" disabled={creating || uploading}>
                    {creating ? 'Saving...' : isEditMode ? 'Update Donasi' : 'Create Donasi'}
                </Button>
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                </DialogClose>
            </DialogFooter>
        </form>
    );
};

export default FormModal;
