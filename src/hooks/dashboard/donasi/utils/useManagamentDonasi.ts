import { useState, useRef, useEffect } from "react";

import toast from "react-hot-toast";

import { supabase } from "@/utils/supabase/supabase";

import imagekitInstance from "@/utils/imagekit/imagekit";

import type { Donasi } from "@/types/donasi";

export function useManagamentDonasi() {
  const [donasi, setDonasi] = useState<Donasi[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    target_amount: 0,
    current_amount: 0,
    status: "open",
    deadline: "",
    image_url: "",
    message_template: "",
  });
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    done: number;
    total: number;
  }>({ done: 0, total: 0 });
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [draggedImageIdx, setDraggedImageIdx] = useState<number | null>(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Donasi | null>(null);

  useEffect(() => {
    const fetchDonasi = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from(process.env.NEXT_PUBLIC_DONATIONS as string)
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setDonasi(data as Donasi[]);
      setLoading(false);
    };
    fetchDonasi();
  }, [creating]);

  const openCreateModal = () => {
    setForm({
      title: "",
      description: "",
      target_amount: 0,
      current_amount: 0,
      status: "open",
      deadline: "",
      image_url: "",
      message_template: "",
    });
    setImagePreview(null);
    setIsEditMode(false);
    setEditingId(null);
    setModalOpen(true);
  };
  const openEditModal = (donasi: Donasi) => {
    setForm({
      title: donasi.title,
      description: donasi.description || "",
      target_amount: donasi.target_amount,
      current_amount: donasi.current_amount,
      status: donasi.status,
      deadline: donasi.deadline || "",
      image_url: donasi.image_url || "",
      message_template: donasi.message_template || "",
    });
    setImagePreview(donasi.image_url || null);
    setIsEditMode(true);
    setEditingId(donasi.id);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setIsEditMode(false);
    setEditingId(null);
    setImagePreview(null);
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "target_amount") {
      const raw = value.replace(/\D/g, "");
      const num = raw === "" ? 0 : Number(raw);
      setForm({ ...form, target_amount: isNaN(num) ? 0 : num });
    } else if (name === "current_amount") {
      const num = value === "" ? 0 : Number(value.replace(/[^\d.]/g, ""));
      setForm({ ...form, current_amount: isNaN(num) ? 0 : num });
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  const handleFilesUpload = async (files: FileList) => {
    setPendingImages(Array.from(files));
    setImagePreview(URL.createObjectURL(files[0]));
    setForm({ ...form, image_url: "" });
  };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFilesUpload(e.target.files);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    let error = null;
    let uploadedUrls: string[] = [];
    if (pendingImages.length > 0) {
      setUploading(true);
      setUploadProgress({ done: 0, total: pendingImages.length });
      for (let i = 0; i < pendingImages.length; i++) {
        const url = await uploadImage(pendingImages[i]);
        uploadedUrls.push(url);
        setUploadProgress((prev) => ({ ...prev, done: prev.done + 1 }));
      }
      setUploading(false);
      setUploadProgress({ done: 0, total: 0 });
    }
    let finalImageUrls = uploadedUrls;
    if (isEditMode && form.image_url && form.image_url.length > 0) {
      finalImageUrls = [form.image_url, ...uploadedUrls];
    }
    if (isEditMode && editingId) {
      const res = await supabase
        .from(process.env.NEXT_PUBLIC_DONATIONS as string)
        .update({
          title: form.title,
          description: form.description,
          target_amount: parseFloat(form.target_amount.toString()),
          current_amount: parseInt(form.current_amount.toString()),
          image_url: finalImageUrls[0],
          status: form.status,
          deadline: form.deadline,
          message_template: form.message_template,
        })
        .eq("id", editingId);
      error = res.error;
      if (!error) {
        toast.success("Produk berhasil diupdate!");
      } else {
        toast.error("Gagal mengupdate produk!");
      }
    } else {
      const res = await supabase
        .from(process.env.NEXT_PUBLIC_DONATIONS as string)
        .insert({
          title: form.title,
          description: form.description,
          target_amount: parseFloat(form.target_amount.toString()),
          current_amount: parseInt(form.current_amount.toString()),
          image_url: finalImageUrls[0],
          status: form.status,
          deadline: form.deadline,
          message_template: form.message_template,
        });
      error = res.error;
      if (!error) {
        toast.success("Produk berhasil dibuat!");
      } else {
        toast.error("Gagal membuat produk!");
      }
    }
    setCreating(false);
    setPendingImages([]);
    if (!error) {
      closeModal();
      const { data } = await supabase
        .from(process.env.NEXT_PUBLIC_DONATIONS as string)
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setDonasi(data as Donasi[]);
    }
  };
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFilesUpload(e.dataTransfer.files);
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
        fileName: `donasi-${Date.now()}`,
        folder: "/donasis",
      });
      if (!result || !result.url) {
        throw new Error("Failed to upload image");
      }
      return result.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };
  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from(process.env.NEXT_PUBLIC_DONATIONS as string)
      .delete()
      .eq("id", id);
    if (!error) {
      setDonasi(donasi.filter((p) => p.id !== id));
      toast.success("Produk berhasil dihapus!");
    } else {
      toast.error("Gagal menghapus produk!");
    }
  };
  const handleImageDragStart = (idx: number) => {
    setDraggedImageIdx(idx);
    setIsDraggingImage(true);
  };
  const handleImageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingImage(true);
  };
  const handleImageDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetIdx: number
  ) => {
    e.preventDefault();
    setIsDraggingImage(false);
    if (draggedImageIdx === null || draggedImageIdx === targetIdx) return;
    const newPreviews = [...(imagePreview ? [imagePreview] : [])];
    const [removed] = newPreviews.splice(draggedImageIdx, 1);
    newPreviews.splice(targetIdx, 0, removed);
    setImagePreview(newPreviews[0]);
    if (pendingImages.length > 0) {
      const newPending = [...pendingImages];
      const [removedFile] = newPending.splice(draggedImageIdx, 1);
      newPending.splice(targetIdx, 0, removedFile);
      setPendingImages(newPending);
    } else {
      setForm({ ...form, image_url: newPreviews[0] });
    }
    setDraggedImageIdx(null);
  };
  const handleImageDragEnd = () => {
    setIsDraggingImage(false);
    setDraggedImageIdx(null);
  };
  const openViewModal = (product: Donasi) => {
    setViewingProduct(product);
    setViewModalOpen(true);
  };
  const closeViewModal = () => {
    setViewingProduct(null);
    setViewModalOpen(false);
  };

  return {
    donasi,
    setDonasi,
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
    uploading,
    setUploading,
    imagePreview,
    setImagePreview,
    dragActive,
    setDragActive,
    inputRef,
    uploadProgress,
    setUploadProgress,
    pendingImages,
    setPendingImages,
    draggedImageIdx,
    setDraggedImageIdx,
    isDraggingImage,
    setIsDraggingImage,
    deleteModalOpen,
    setDeleteModalOpen,
    deletingId,
    setDeletingId,
    viewModalOpen,
    setViewModalOpen,
    viewingProduct,
    setViewingProduct,
    openCreateModal,
    openEditModal,
    closeModal,
    handleChange,
    handleFilesUpload,
    handleImageChange,
    handleSubmit,
    handleDrag,
    handleDrop,
    uploadImage,
    handleDelete,
    handleImageDragStart,
    handleImageDragOver,
    handleImageDrop,
    handleImageDragEnd,
    openViewModal,
    closeViewModal,
  };
}
