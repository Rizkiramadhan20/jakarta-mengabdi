export type Volunteer = {
  id: number;
  img_url: string;
  title: string;
  slug: string;
  detail: string;
  goals: any; // JSONB, dapat diketik lebih ketat jika diperlukan
  category: "pilar cerdas" | "pilar sehat" | "pilar lestari" | "pilar peduli";
  quota_available: number;
  time: string; // String ISO untuk cap waktu
  location: string;
  tasks: string;
  criteria: string;
  file_document?: string | null;
  created_at: string;
  updated_at: string;
  price: number;
};

export interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deletingId: number | null;
  setDeleteModalOpen: (open: boolean) => void;
  setDeletingId: (id: number | null) => void;
  handleDelete: (id: number) => Promise<void>;
  deleting: boolean;
}

export interface FormModalProps {
  isEditMode: boolean;
  form: Volunteer | Omit<Volunteer, "id" | "created_at" | "updated_at">;
  setForm: (form: any) => void;
  creating: boolean;
  uploading: boolean;
  imagePreviews: string[];
  dragActive: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  uploadProgress: { done: number; total: number };
  setPendingImages: (imgs: File[]) => void;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleDrag: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  closeModal: () => void;
  setImagePreviews: (imgs: string[]) => void;
  handleDeleteFileDocument: (fileUrl: string) => Promise<void>;
}
