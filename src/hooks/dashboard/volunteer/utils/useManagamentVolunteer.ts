import { useState, useRef, useEffect } from "react";

import toast from "react-hot-toast";

import { supabase } from "@/utils/supabase/supabase";

import imagekitInstance from "@/utils/imagekit/imagekit";

import type { Volunteer } from "@/types/volunteer";

export function useManagamentVolunteer() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<
    Volunteer | Omit<Volunteer, "id" | "created_at" | "updated_at">
  >({
    img_url: "",
    title: "",
    detail: "",
    goals: [],
    category: "pilar cerdas",
    quota_available: 0,
    time: "",
    location: "",
    tasks: "",
    criteria: "",
    file_document: "",
    price: 0,
  });
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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
  const [viewingVolunteer, setViewingVolunteer] = useState<Volunteer | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchVolunteers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from(process.env.NEXT_PUBLIC_VOLUNTEERS as string)
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setVolunteers(data as Volunteer[]);
      setLoading(false);
    };
    fetchVolunteers();
  }, [creating]);

  const openCreateModal = () => {
    setForm({
      img_url: "",
      title: "",
      detail: "",
      goals: [],
      category: "pilar cerdas",
      quota_available: 0,
      time: "",
      location: "",
      tasks: "",
      criteria: "",
      file_document: "",
      price: 0,
    });
    setImagePreviews([]);
    setIsEditMode(false);
    setEditingId(null);
    setModalOpen(true);
  };
  const openEditModal = (volunteer: Volunteer) => {
    setForm({
      img_url: volunteer.img_url,
      title: volunteer.title,
      detail: volunteer.detail,
      goals: volunteer.goals,
      category: volunteer.category,
      quota_available: volunteer.quota_available,
      time: volunteer.time,
      location: volunteer.location,
      tasks: volunteer.tasks,
      criteria: volunteer.criteria,
      file_document: volunteer.file_document,
      price: volunteer.price,
    });
    setImagePreviews(volunteer.img_url ? [volunteer.img_url] : []);
    setIsEditMode(true);
    setEditingId(volunteer.id);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setIsEditMode(false);
    setEditingId(null);
    setImagePreviews([]);
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleFilesUpload = async (files: FileList) => {
    setPendingImages(Array.from(files));
    setImagePreviews(
      Array.from(files).map((file) => URL.createObjectURL(file))
    );
    setForm({ ...form, img_url: "" });
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
    let uploadedUrl = "";
    if (pendingImages.length > 0) {
      setUploading(true);
      setUploadProgress({ done: 0, total: pendingImages.length });
      // Only one image for img_url
      uploadedUrl = await uploadImage(pendingImages[0]);
      setUploadProgress((prev) => ({ ...prev, done: prev.done + 1 }));
      setUploading(false);
      setUploadProgress({ done: 0, total: 0 });
    }
    let finalImgUrl = uploadedUrl;
    if (isEditMode && form.img_url && form.img_url.length > 0) {
      finalImgUrl = form.img_url;
    }
    let fileDocumentUrl = "";
    if (form.file_document && typeof form.file_document === "object") {
      const file = form.file_document as File;
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload-volunteer-doc", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.url) {
          fileDocumentUrl = data.url;
        } else {
          toast.error("Gagal upload dokumen!");
          setCreating(false);
          return;
        }
      } catch (err) {
        toast.error("Gagal upload dokumen!");
        setCreating(false);
        return;
      }
    } else if (typeof form.file_document === "string") {
      fileDocumentUrl = form.file_document;
    }
    if (isEditMode && editingId) {
      const res = await supabase
        .from(process.env.NEXT_PUBLIC_VOLUNTEERS as string)
        .update({
          img_url: finalImgUrl,
          title: form.title,
          detail: form.detail,
          goals: form.goals,
          category: form.category,
          quota_available: form.quota_available,
          time: form.time,
          location: form.location,
          tasks: form.tasks,
          criteria: form.criteria,
          file_document: fileDocumentUrl,
          price: form.price,
        })
        .eq("id", editingId);
      error = res.error;
      if (!error) {
        toast.success("Volunteer berhasil diupdate!");
      } else {
        toast.error("Gagal mengupdate volunteer!");
      }
    } else {
      const res = await supabase
        .from(process.env.NEXT_PUBLIC_VOLUNTEERS as string)
        .insert({
          img_url: finalImgUrl,
          title: form.title,
          detail: form.detail,
          goals: form.goals,
          category: form.category,
          quota_available: form.quota_available,
          time: form.time,
          location: form.location,
          tasks: form.tasks,
          criteria: form.criteria,
          file_document: fileDocumentUrl,
          price: form.price,
        });
      error = res.error;
      if (!error) {
        toast.success("Volunteer berhasil dibuat!");
      } else {
        toast.error("Gagal membuat volunteer!");
      }
    }
    setCreating(false);
    setPendingImages([]);
    if (!error) {
      closeModal();
      const { data } = await supabase
        .from(process.env.NEXT_PUBLIC_VOLUNTEERS as string)
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setVolunteers(data as Volunteer[]);
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
        fileName: `volunteer-${Date.now()}`,
        folder: "/volunteers",
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
    setDeleting(true);
    // Ambil volunteer yang akan dihapus
    const { data: volunteer } = await supabase
      .from(process.env.NEXT_PUBLIC_VOLUNTEERS as string)
      .select("file_document")
      .eq("id", id)
      .single();
    // Hapus file dokumen jika ada
    if (volunteer && volunteer.file_document) {
      await handleDeleteFileDocument(volunteer.file_document);
    }
    // Hapus data volunteer
    const { error } = await supabase
      .from(process.env.NEXT_PUBLIC_VOLUNTEERS as string)
      .delete()
      .eq("id", id);
    if (!error) {
      setVolunteers(volunteers.filter((v) => v.id !== id));
      toast.success("Volunteer berhasil dihapus!");
    } else {
      toast.error("Gagal menghapus volunteer!");
    }
    setDeleting(false);
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
    const newPreviews = [...imagePreviews];
    const [removed] = newPreviews.splice(draggedImageIdx, 1);
    newPreviews.splice(targetIdx, 0, removed);
    setImagePreviews(newPreviews);
    if (pendingImages.length > 0) {
      const newPending = [...pendingImages];
      const [removedFile] = newPending.splice(draggedImageIdx, 1);
      newPending.splice(targetIdx, 0, removedFile);
      setPendingImages(newPending);
    } else {
      setForm({ ...form, img_url: newPreviews[0] });
    }
    setDraggedImageIdx(null);
  };
  const handleImageDragEnd = () => {
    setIsDraggingImage(false);
    setDraggedImageIdx(null);
  };
  const openViewModal = (volunteer: Volunteer) => {
    setViewingVolunteer(volunteer);
    setViewModalOpen(true);
  };
  const closeViewModal = () => {
    setViewingVolunteer(null);
    setViewModalOpen(false);
  };
  const handleDeleteFileDocument = async (fileUrl: string) => {
    if (typeof fileUrl === "string" && fileUrl) {
      try {
        const urlParts = fileUrl.split("/");
        const fileName = urlParts[urlParts.length - 1];
        if (fileName) {
          await fetch(
            `/api/upload-volunteer-doc?name=${encodeURIComponent(fileName)}`,
            {
              method: "DELETE",
            }
          );
        }
      } catch (err) {
        // Optional: tampilkan error toast
      }
    }
  };

  return {
    volunteers,
    setVolunteers,
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
    imagePreviews,
    setImagePreviews,
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
    viewingVolunteer,
    setViewingVolunteer,
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
    handleDeleteFileDocument,
    deleting,
    setDeleting,
  };
}
