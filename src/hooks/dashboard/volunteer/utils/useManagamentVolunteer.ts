import { useState, useRef, useEffect } from "react";

import toast from "react-hot-toast";

import { supabase } from "@/utils/supabase/supabase";

import imagekitInstance from "@/utils/imagekit/imagekit";

import { Volunteer } from "@/interface/volunteer";

import { slugify } from "@/base/helper/slugify";

const defaultForm: Omit<Volunteer, "id" | "created_at" | "updated_at"> = {
  img_url: [],
  title: "",
  slug: "",
  description: "",
  detail: [],
  devisi: [],
  timeline: [],
  content: "",
  category: "pilar cerdas",
  session_type: "onsite",
  form_link: "",
  payment_type: "gratis",
  price: 0,
  date: "",
  start_time: "",
  last_time: "",
  last_registration: "",
  location: "",
  file_document: "",
};

export function useManagamentVolunteer() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    editMode: false,
    editingId: null as number | null,
  });
  const [form, setForm] = useState({ ...defaultForm });
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingVolunteer, setViewingVolunteer] = useState<Volunteer | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);
  const [draggedImageIdx, setDraggedImageIdx] = useState<number | null>(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "title") {
      setForm({ ...form, title: value, slug: slugify(value) });
    } else if (name === "session_type") {
      setForm({ ...form, session_type: value as "onsite" | "online" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const openCreateModal = () => {
    setForm({ ...defaultForm });
    setImagePreviews([]);
    setPendingImages([]);
    setModal({ open: true, editMode: false, editingId: null });
  };

  const openEditModal = (volunteer: Volunteer) => {
    setForm({ ...volunteer });
    setImagePreviews(volunteer.img_url || []);
    setPendingImages([]);
    setModal({ open: true, editMode: true, editingId: volunteer.id });
  };

  const closeModal = () => {
    setModal({ open: false, editMode: false, editingId: null });
    setForm({ ...defaultForm });
    setImagePreviews([]);
    setPendingImages([]);
  };

  const handleFilesUpload = async (files: FileList) => {
    const newFiles = Array.from(files);
    setPendingImages(newFiles);
    setImagePreviews(newFiles.map((file) => URL.createObjectURL(file)));
    setForm({ ...form, img_url: [] });
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
      // Upload all images
      for (let i = 0; i < pendingImages.length; i++) {
        const uploadedUrl = await uploadImage(pendingImages[i]);
        uploadedUrls.push(uploadedUrl);
        setUploadProgress((prev) => ({ ...prev, done: prev.done + 1 }));
      }
      setUploading(false);
      setUploadProgress({ done: 0, total: 0 });
    }
    let finalImgUrls = uploadedUrls;
    if (modal.editMode && form.img_url && form.img_url.length > 0) {
      finalImgUrls = [...form.img_url, ...uploadedUrls];
    } else if (!modal.editMode) {
      finalImgUrls = uploadedUrls;
    }
    let fileDocumentUrl = "";
    if (form.file_document && typeof form.file_document === "object") {
      const file = form.file_document as File;
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
          fileName: `volunteer-doc-${Date.now()}-${file.name}`,
          folder: "/volunteer-docs",
        });
        if (!result || !result.url) {
          throw new Error("Failed to upload document");
        }
        fileDocumentUrl = result.url;
      } catch (error) {
        console.error("ImageKit upload error:", error);
        toast.error("Gagal upload dokumen!");
        setCreating(false);
        return;
      }
    } else if (typeof form.file_document === "string") {
      fileDocumentUrl = form.file_document;
    }
    if (modal.editMode && modal.editingId) {
      const res = await supabase
        .from(process.env.NEXT_PUBLIC_VOLUNTEERS as string)
        .update({
          img_url: finalImgUrls,
          title: form.title,
          slug: form.slug,
          description: form.description,
          detail: form.detail,
          devisi: form.devisi,
          timeline: form.timeline,
          content: form.content,
          category: form.category,
          session_type: form.session_type,
          form_link: form.form_link,
          payment_type: form.payment_type,
          price: form.price,
          date: form.date,
          start_time: form.start_time,
          last_time: form.last_time,
          last_registration: form.last_registration,
          location: form.location,
          file_document: fileDocumentUrl,
        })
        .eq("id", modal.editingId);
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
          img_url: finalImgUrls,
          title: form.title,
          slug: form.slug,
          description: form.description,
          detail: form.detail,
          devisi: form.devisi,
          timeline: form.timeline,
          content: form.content,
          category: form.category,
          session_type: form.session_type,
          form_link: form.form_link,
          payment_type: form.payment_type,
          price: form.price,
          date: form.date,
          start_time: form.start_time,
          last_time: form.last_time,
          last_registration: form.last_registration,
          location: form.location,
          file_document: fileDocumentUrl,
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

  const handleImageDragStart = (idx: number) => {
    setDraggedImageIdx(idx);
    setIsDraggingImage(true);
  };

  const handleImageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    if (draggedImageIdx === null) return;

    const newImagePreviews = [...imagePreviews];
    const newPendingImages = [...pendingImages];
    const newImgUrls = [...form.img_url];

    // Swap images
    if (pendingImages.length > 0) {
      [newPendingImages[draggedImageIdx], newPendingImages[idx]] = [
        newPendingImages[idx],
        newPendingImages[draggedImageIdx],
      ];
      [newImagePreviews[draggedImageIdx], newImagePreviews[idx]] = [
        newImagePreviews[idx],
        newImagePreviews[draggedImageIdx],
      ];
    } else {
      [newImgUrls[draggedImageIdx], newImgUrls[idx]] = [
        newImgUrls[idx],
        newImgUrls[draggedImageIdx],
      ];
      [newImagePreviews[draggedImageIdx], newImagePreviews[idx]] = [
        newImagePreviews[idx],
        newImagePreviews[draggedImageIdx],
      ];
    }

    setPendingImages(newPendingImages);
    setImagePreviews(newImagePreviews);
    setForm({ ...form, img_url: newImgUrls });
    setDraggedImageIdx(null);
    setIsDraggingImage(false);
  };

  const handleImageDragEnd = () => {
    setDraggedImageIdx(null);
    setIsDraggingImage(false);
  };

  return {
    volunteers,
    setVolunteers,
    loading,
    setLoading,
    modal,
    setModal,
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
    openViewModal,
    closeViewModal,
    handleDeleteFileDocument,
    deleting,
    setDeleting,
    draggedImageIdx,
    isDraggingImage,
    handleImageDragStart,
    handleImageDragOver,
    handleImageDrop,
    handleImageDragEnd,
  };
}
