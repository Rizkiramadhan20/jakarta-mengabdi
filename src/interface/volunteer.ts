export type Volunteer = {
  id: number;
  img_url: string[];
  title: string;
  slug: string;
  description: string;
  detail: any; // JSON field
  devisi: any; // JSON field
  timeline: any; // JSON field
  content: string;
  category: "pilar cerdas" | "pilar sehat" | "pilar lestari" | "pilar peduli";
  session_type: "onsite" | "online";
  date: string;
  start_time: string;
  last_time: string;
  last_registration: string;
  location: string;
  form_link: string;
  file_document?: string | null;
  created_at: string;
  updated_at: string;
  payment_type: "gratis" | "berbayar";
  price: number;
};

export interface PaymentOption {
  type: "berbayar" | "gratis";
  price: number;
}

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
  pendingImages: File[];
  draggedImageIdx: number | null;
  isDraggingImage: boolean;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleDrag: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleImageDragStart: (idx: number) => void;
  handleImageDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleImageDrop: (e: React.DragEvent<HTMLDivElement>, idx: number) => void;
  handleImageDragEnd: () => void;
  closeModal: () => void;
  setImagePreviews: (imgs: string[]) => void;
  handleDeleteFileDocument: (fileUrl: string) => Promise<void>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
