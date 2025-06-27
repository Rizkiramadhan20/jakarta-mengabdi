export interface Donasi {
  id: number;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  image_url?: string;
  donations: number;
  share: number;
  target_amount: number;
  current_amount: number;
  status: "open" | "closed";
  deadline?: string;
  created_at: string;
  message_template?: string;
}

export type DonasiFormData = {
  title: string;
  slug: string;
  description: string;
  content?: string;
  donations: number;
  share: number;
  target_amount: number;
  current_amount: number;
  status: "open" | "closed";
  deadline: string;
  image_url: string;
  message_template?: string;
};

export interface FormModalProps {
  isEditMode: boolean;
  form: DonasiFormData;
  setForm: (form: any) => void;
  creating: boolean;
  uploading: boolean;
  imagePreviews: string[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  uploadProgress: { done: number; total: number };
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  closeModal: () => void;
  setImagePreviews: (imgs: string[]) => void;
}

export interface ViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewingProduct: Donasi | null;
  onClose: () => void;
}

export interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deletingId: number | null;
  setDeleteModalOpen: (open: boolean) => void;
  setDeletingId: (id: number | null) => void;
  handleDelete: (id: number) => Promise<void>;
}
