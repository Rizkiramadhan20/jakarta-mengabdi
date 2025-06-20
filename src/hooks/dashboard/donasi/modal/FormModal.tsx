import React from 'react';

import { Button } from '@/components/ui/button';

import { DialogFooter, DialogClose } from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';

import { formatIDR, getRawNumberFromIDR } from '@/base/helper/FormatPrice';

import { UploadCloud, Trash2 } from 'lucide-react';

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
    const handleTargetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = getRawNumberFromIDR(e.target.value);
        setForm({ ...form, target_amount: rawValue });
    };

    React.useEffect(() => {
        if (!form.message_template) {
            setForm((prev: any) => ({
                ...prev,
                message_template: 'Terima kasih {{name}} atas donasi sebesar {{amount}}. Pembayaran Anda {{status}}.'
            }));
        }
    }, []);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 space-y-4 w-full max-w-full">
            <div className='flex flex-col gap-2'>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className='flex flex-col gap-2'>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={form.description} onChange={handleChange} required className="h-32 resize-none" />
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
                <Label htmlFor="message_template">Message Template</Label>
                <Textarea id="message_template" name="message_template" value={form.message_template || ''} onChange={handleChange} className="h-32 resize-none" />
            </div>
            <div className='flex flex-col gap-2'>
                <Label htmlFor="images">Image</Label>
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
                                            setForm({ ...form, image_url: url })
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
