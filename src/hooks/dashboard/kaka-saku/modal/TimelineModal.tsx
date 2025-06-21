import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { UploadCloud, Trash2 } from 'lucide-react';
import Image from 'next/image';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select';

interface TimelineModalProps {
    isEditMode: boolean;
    form: any;
    setForm: (form: any) => void;
    uploading: boolean;
    imagePreview: string | null;
    dragActive: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
    pendingImages: File[];
    setPendingImages: (imgs: File[]) => void;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleDrag: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    closeModal: () => void;
    setImagePreview: (img: string | null) => void;
}

const TimelineModal: React.FC<TimelineModalProps> = ({
    isEditMode,
    form,
    setForm,
    uploading,
    imagePreview,
    dragActive,
    inputRef,
    pendingImages,
    setPendingImages,
    handleChange,
    handleImageChange,
    handleSubmit,
    handleDrag,
    handleDrop,
    closeModal,
    setImagePreview,
}) => {
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 space-y-4 w-full max-w-full">
            <div className='flex flex-col gap-2'>
                <Label htmlFor="type">Type</Label>
                <Select
                    value={form.type}
                    onValueChange={value => setForm({ ...form, type: value })}
                >
                    <SelectTrigger className="w-full rounded-md border px-3 py-2 text-sm">
                        <SelectValue placeholder="Pilih tipe timeline" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="📦 Paket Donasi">📦 Paket Donasi</SelectItem>
                        <SelectItem value="🎁 Benefit">🎁 Benefit</SelectItem>
                        <SelectItem value="💸 Transparansi">💸 Transparansi</SelectItem>
                        <SelectItem value="📥 Cara Donasi">📥 Cara Donasi</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className='flex flex-col gap-2'>
                <Label htmlFor="image">Image</Label>
                {!imagePreview && (
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
                            id="image"
                            name="image"
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
                        Uploading image...
                    </div>
                )}
                {imagePreview && (
                    <div className="relative group aspect-video w-full max-w-md">
                        <Image
                            width={1080}
                            height={1080}
                            src={imagePreview}
                            alt="Timeline Preview"
                            className="w-full h-full object-cover rounded-md border border-border shadow-sm"
                        />
                        <button
                            type="button"
                            className="absolute top-1 right-1 bg-white/80 hover:bg-red-100 text-red-500 rounded-full p-1 shadow transition-opacity opacity-0 group-hover:opacity-100"
                            style={{ transition: 'opacity 0.2s' }}
                            onClick={e => {
                                e.stopPropagation();
                                setImagePreview(null);
                                setPendingImages([]);
                                setForm({ ...form, image_url: "" });
                            }}
                            title="Remove image"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>

            <DialogFooter className="mt-4">
                <Button type="submit" disabled={uploading}>
                    {uploading ? 'Saving...' : isEditMode ? 'Update Timeline' : 'Add Timeline'}
                </Button>
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                </DialogClose>
            </DialogFooter>
        </form>
    );
};

export default TimelineModal; 