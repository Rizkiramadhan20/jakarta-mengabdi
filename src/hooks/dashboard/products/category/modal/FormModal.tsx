import React from 'react';

import { Button } from '@/components/ui/button';

import { DialogFooter, DialogClose } from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import Image from 'next/image';

import { UploadCloud, Trash2 } from 'lucide-react';

interface FormModalProps {
    isEditMode: boolean;
    form: any;
    setForm: (form: any) => void;
    creating: boolean;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    closeModal: () => void;
    imagePreviews: string[];
    setImagePreviews: React.Dispatch<React.SetStateAction<string[]>>;
    uploading: boolean;
    uploadProgress: { done: number; total: number };
    inputRef: React.RefObject<HTMLInputElement | null>;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
}) => {
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 space-y-4 w-full max-w-full">
            <div className='flex flex-col gap-2'>
                <Label htmlFor="name">Nama Kategori</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required />
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
                                    setForm({ ...form, thumbnail: '' });
                                }}
                                title="Remove image"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <DialogFooter>
                <Button type="submit" disabled={creating}>{isEditMode ? (creating ? 'Menyimpan...' : 'Simpan') : (creating ? 'Membuat...' : 'Buat')}</Button>
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={closeModal}>Batal</Button>
                </DialogClose>
            </DialogFooter>
        </form>
    );
};

export default FormModal;
