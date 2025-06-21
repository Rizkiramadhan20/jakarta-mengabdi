export interface KakaSaku {
  id: number;
  title: string;
  slug: string;
  description?: string;
  image_url?: string;
  target_amount: number;
  current_amount: number;
  status: "open" | "closed";
  deadline?: string;
  created_at: string;
  message_template?: string;
  timeline: Timeline[];
}

export interface Timeline {
  id: string;
  type: string;
  image_url?: string;
}

export interface TimelineModalProps {
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
export interface FormModalProps {
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

export interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deletingId: number | null;
  setDeleteModalOpen: (open: boolean) => void;
  setDeletingId: (id: number | null) => void;
  handleDelete: (id: number) => Promise<void>;
}

export interface ViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewingProduct: KakaSaku | null;
  onClose: () => void;
}
