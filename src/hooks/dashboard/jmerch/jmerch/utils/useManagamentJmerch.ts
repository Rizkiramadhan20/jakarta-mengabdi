import { useState, useEffect, useRef } from "react";

import toast from "react-hot-toast";

import { supabase } from "@/utils/supabase/supabase";

import { JMerch } from "@/interface/jmerch";

import imagekitInstance from "@/utils/imagekit/imagekit";

export function useManagamentJMerch() {
  const [jmerch, setJMerch] = useState<JMerch[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    thumbnail: [] as string[],
  });
  const [creating, setCreating] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    form.thumbnail ? form.thumbnail : []
  );
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [draggedImageIdx, setDraggedImageIdx] = useState<number | null>(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchJMerch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from(process.env.NEXT_PUBLIC_JMERCH as string)
        .select("id, name, thumbnail, created_at")
        .order("created_at", { ascending: false });
      if (error) {
      }
      if (!error && data) setJMerch(data as JMerch[]);
      setLoading(false);
    };
    fetchJMerch();
  }, [creating]);

  const openCreateModal = () => {
    setForm({
      name: "",
      thumbnail: [],
    });
    setImagePreviews([]);
    setIsEditMode(false);
    setEditingId(null);
    setModalOpen(true);
  };
  const openEditModal = (jmerch: JMerch) => {
    setForm({
      name: jmerch.name,
      thumbnail: jmerch.thumbnail || [],
    });
    setImagePreviews(jmerch.thumbnail ? jmerch.thumbnail : []);
    setIsEditMode(true);
    setEditingId(jmerch.id);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setIsEditMode(false);
    setEditingId(null);
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, files } = e.target as any;
    if (type === "file" && files && files[0]) {
      // File upload handled in FormModal, so skip here
      return;
    }
    setForm({ ...form, [name]: value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    let error = null;
    if (isEditMode && editingId) {
      const res = await supabase
        .from(process.env.NEXT_PUBLIC_JMERCH as string)
        .update({
          name: form.name,
          thumbnail: form.thumbnail,
        })
        .eq("id", editingId);
      error = res.error;
      if (!error) {
        toast.success("JMerch berhasil diupdate!");
      } else {
        toast.error("Gagal mengupdate JMerch!");
      }
    } else {
      const res = await supabase
        .from(process.env.NEXT_PUBLIC_JMERCH as string)
        .insert({
          name: form.name,
          thumbnail: form.thumbnail,
        });
      error = res.error;
      if (!error) {
        toast.success("JMerch berhasil dibuat!");
      } else {
        toast.error("Gagal membuat JMerch!");
      }
    }
    setCreating(false);
    if (!error) {
      closeModal();
      const { data, error } = await supabase
        .from(process.env.NEXT_PUBLIC_JMERCH as string)
        .select("id, name, thumbnail, created_at")
        .order("created_at", { ascending: false });
      if (error) {
      }
      if (data) setJMerch(data as JMerch[]);
    }
  };
  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from(process.env.NEXT_PUBLIC_JMERCH as string)
      .delete()
      .eq("id", id);
    if (!error) {
      setJMerch(jmerch.filter((c) => c.id !== id));
      toast.success("JMerch berhasil dihapus!");
    } else {
      toast.error("Gagal menghapus JMerch!");
    }
  };
  const uploadImage = async (file: File): Promise<string> => {
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const base64 = await base64Promise;
      const result = await imagekitInstance.upload({
        file: base64,
        fileName: `jmerch-${Date.now()}`,
        folder: "/jmerch",
      });
      if (!result || !result.url) {
        throw new Error("Failed to upload image");
      }
      return result.url;
    } catch (error) {
      throw new Error("Failed to upload image");
    }
  };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadProgress({ done: 0, total: files.length });
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImage(files[i]);
        urls.push(url);
        setUploadProgress({ done: i + 1, total: files.length });
      }
      // Tambahkan gambar baru ke array yang sudah ada, bukan mengganti
      const newImagePreviews = [...imagePreviews, ...urls];
      const newThumbnail = [...form.thumbnail, ...urls];
      setImagePreviews(newImagePreviews);
      setForm({ ...form, thumbnail: newThumbnail });
    } catch (error) {
      setUploadProgress({ done: 0, total: 0 });
    }
    setUploading(false);
    // Reset input file agar bisa memilih file yang sama lagi
    if (e.target) {
      e.target.value = "";
    }
  };

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploading(true);
      setUploadProgress({ done: 0, total: e.dataTransfer.files.length });
      try {
        const urls: string[] = [];
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          const url = await uploadImage(e.dataTransfer.files[i]);
          urls.push(url);
          setUploadProgress({
            done: i + 1,
            total: e.dataTransfer.files.length,
          });
        }
        // Tambahkan gambar baru ke array yang sudah ada, bukan mengganti
        const newImagePreviews = [...imagePreviews, ...urls];
        const newThumbnail = [...form.thumbnail, ...urls];
        setImagePreviews(newImagePreviews);
        setForm({ ...form, thumbnail: newThumbnail });
      } catch (error) {
        setUploadProgress({ done: 0, total: 0 });
      }
      setUploading(false);
    }
  };
  // Drag-sort handlers
  const handleImageDragStart = (idx: number) => {
    setDraggedImageIdx(idx);
    setIsDraggingImage(true);
  };
  const handleImageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedImageIdx === null) return;
    const newPreviews = [...imagePreviews];
    const [removed] = newPreviews.splice(draggedImageIdx, 1);
    newPreviews.splice(idx, 0, removed);
    setImagePreviews(newPreviews);
    setForm({ ...form, thumbnail: newPreviews });
    setDraggedImageIdx(null);
    setIsDraggingImage(false);
  };
  const handleImageDragEnd = () => {
    setDraggedImageIdx(null);
    setIsDraggingImage(false);
  };

  return {
    jmerch,
    setJMerch,
    loading,
    setLoading,
    modalOpen,
    setModalOpen,
    isEditMode,
    setIsEditMode,
    editingId,
    setEditingId,
    form,
    setForm,
    creating,
    setCreating,
    deleteModalOpen,
    setDeleteModalOpen,
    deletingId,
    setDeletingId,
    openCreateModal,
    openEditModal,
    closeModal,
    handleChange,
    handleSubmit,
    handleDelete,
    imagePreviews,
    setImagePreviews,
    uploading,
    setUploading,
    uploadProgress,
    setUploadProgress,
    inputRef,
    handleImageChange,
    uploadImage,
    pendingImages,
    setPendingImages,
    dragActive,
    handleDrag,
    handleDrop,
    draggedImageIdx,
    isDraggingImage,
    handleImageDragStart,
    handleImageDragOver,
    handleImageDrop,
    handleImageDragEnd,
  };
}
