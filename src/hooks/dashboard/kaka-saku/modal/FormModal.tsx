import React from 'react';

import { Button } from '@/components/ui/button';

import { DialogFooter, DialogClose } from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';

import { formatIDR, getRawNumberFromIDR } from '@/base/helper/FormatPrice';

import { UploadCloud, Trash2, Plus, Edit, Calendar, Clock } from 'lucide-react';

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
    Calendar as CalendarComponent,
} from '@/components/ui/calendar';

import type { Timeline } from '@/types/kakaSaku';

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
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleDrag: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    closeModal: () => void;
    setImagePreviews: (imgs: string[]) => void;
    // Timeline props
    openTimelineModal: () => void;
    openEditTimelineModal: (timeline: Timeline) => void;
    deleteTimelineItem: (id: string) => void;
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
    handleChange,
    handleImageChange,
    handleSubmit,
    handleDrag,
    handleDrop,
    closeModal,
    setImagePreviews,
    openTimelineModal,
    openEditTimelineModal,
    deleteTimelineItem,
}) => {
    const handleTargetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = getRawNumberFromIDR(e.target.value);
        setForm({ ...form, target_amount: rawValue });
    };

    React.useEffect(() => {
        if (!form.message_template) {
            setForm((prev: any) => ({
                ...prev,
                message_template: 'Terima kasih {{name}} atas Kaka Saku sebesar {{amount}}. Pembayaran Anda {{status}}.'
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
                            <CalendarComponent
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

            {/* Timeline Section */}
            <div className='flex flex-col gap-2'>
                <div className="flex items-center justify-between">
                    <Label>Timeline</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={openTimelineModal}
                        className="flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Add Timeline
                    </Button>
                </div>

                {form.timeline && form.timeline.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {form.timeline.map((timeline: Timeline, index: number) => (
                            <div key={timeline.id} className="border rounded-lg p-3 bg-muted/30">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full capitalize">
                                                {timeline.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEditTimelineModal(timeline)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Edit size={14} />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteTimelineItem(timeline.id)}
                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </div>
                                {timeline.image_url && (
                                    <div className="mt-2">
                                        <Image
                                            src={timeline.image_url}
                                            alt={timeline.type}
                                            width={100}
                                            height={60}
                                            className="rounded-md object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground">
                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No timeline items yet</p>
                        <p className="text-xs">Click "Add Timeline" to create your first timeline item</p>
                    </div>
                )}
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
                    <div className="grid grid-cols-1 gap-3 mt-3">
                        {imagePreviews.map((url: string, idx: number) => (
                            <div
                                key={idx}
                                className="relative group aspect-video w-full max-w-md"
                            >
                                <Image
                                    width={1080}
                                    height={1080}
                                    src={url}
                                    alt={`Preview ${idx + 1}`}
                                    className="w-full h-full object-cover rounded-md border border-border shadow-sm"
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
                                            setImagePreviews(imagePreviews.filter((imgUrl: string) => imgUrl !== url))
                                            setForm({ ...form, image_url: url })
                                        }
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
            <DialogFooter className="mt-4">
                <Button type="submit" disabled={creating || uploading}>
                    {creating ? 'Saving...' : isEditMode ? 'Update Kaka Saku' : 'Create Kaka Saku'}
                </Button>
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                </DialogClose>
            </DialogFooter>
        </form>
    );
};

export default FormModal;
