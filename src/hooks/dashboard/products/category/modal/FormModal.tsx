import React from 'react';

import { Button } from '@/components/ui/button';

import { DialogFooter, DialogClose } from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

interface FormModalProps {
    isEditMode: boolean;
    form: any;
    setForm: (form: any) => void;
    creating: boolean;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    closeModal: () => void;
}

const FormModal: React.FC<FormModalProps> = ({
    isEditMode,
    form,
    setForm,
    creating,
    handleChange,
    handleSubmit,
    closeModal,
}) => {
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 space-y-4 w-full max-w-full">
            <div className='flex flex-col gap-2'>
                <Label htmlFor="name">Nama Kategori</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className='flex flex-col gap-2'>
                <Label htmlFor="thumbnail">Thumbnail (URL Gambar)</Label>
                <Input id="thumbnail" name="thumbnail" value={form.thumbnail} onChange={handleChange} placeholder="https://..." type="url" required />
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
