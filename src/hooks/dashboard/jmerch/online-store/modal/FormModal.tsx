import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormModalProps {
    isEditMode: boolean;
    form: { name: string; url: string };
    setForm: (form: { name: string; url: string }) => void;
    creating: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
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
                <Label htmlFor="name">Nama Online Store</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Nama Toko Online" />
            </div>
            <div className='flex flex-col gap-2'>
                <Label htmlFor="url">URL Online Store</Label>
                <Input id="url" name="url" value={form.url} onChange={handleChange} required placeholder="https://contoh-toko.com" />
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
