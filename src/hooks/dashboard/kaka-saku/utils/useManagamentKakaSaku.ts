import { useState, useRef, useEffect } from "react";

import toast from "react-hot-toast";

import { supabase } from "@/utils/supabase/supabase";

import imagekitInstance from "@/utils/imagekit/imagekit";

import type { KakaSaku, Timeline } from "@/interface/kakaSaku";

import { slugify } from "@/base/helper/slugify";

export function useManagamentKakaSaku() {
  const [kakasaku, setKakasaku] = useState<KakaSaku[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    kakaksaku: 0,
    share: 0,
    target_amount: 0,
    current_amount: 0,
    status: "open",
    deadline: "",
    image_url: "",
    message_template: "",
    timeline: [] as Timeline[],
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<KakaSaku | null>(null);

  // Timeline states
  const [timelineModalOpen, setTimelineModalOpen] = useState(false);
  const [timelineForm, setTimelineForm] = useState({
    type: "",
    image_url: "",
  });
  const [isTimelineEditMode, setIsTimelineEditMode] = useState(false);
  const [editingTimelineId, setEditingTimelineId] = useState<string | null>(
    null
  );
  const [timelineImagePreview, setTimelineImagePreview] = useState<
    string | null
  >(null);
  const [timelinePendingImages, setTimelinePendingImages] = useState<File[]>(
    []
  );
  const [timelineUploading, setTimelineUploading] = useState(false);
  const timelineInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchKakaSaku = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from(process.env.NEXT_PUBLIC_KAKA_SAKU as string)
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setKakasaku(data as KakaSaku[]);
      setLoading(false);
    };
    fetchKakaSaku();
  }, [creating]);

  const openCreateModal = () => {
    setForm({
      title: "",
      slug: "",
      description: "",
      kakaksaku: 0,
      share: 0,
      target_amount: 0,
      current_amount: 0,
      status: "open",
      deadline: "",
      image_url: "",
      message_template: "",
      timeline: [],
    });
    setImagePreview(null);
    setIsEditMode(false);
    setEditingId(null);
    setModalOpen(true);
  };
  const openEditModal = (kakaSaku: KakaSaku) => {
    setForm({
      title: kakaSaku.title,
      slug: kakaSaku.slug,
      description: kakaSaku.description || "",
      kakaksaku: kakaSaku.kakaksaku,
      share: kakaSaku.share,
      target_amount: kakaSaku.target_amount,
      current_amount: kakaSaku.current_amount,
      status: kakaSaku.status,
      deadline: kakaSaku.deadline || "",
      image_url: kakaSaku.image_url || "",
      message_template: kakaSaku.message_template || "",
      timeline: kakaSaku.timeline || [],
    });
    setImagePreview(kakaSaku.image_url || null);
    setIsEditMode(true);
    setEditingId(kakaSaku.id);
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
    } else if (name === "title") {
      setForm({ ...form, title: value, slug: slugify(value) });
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
        .from(process.env.NEXT_PUBLIC_KAKA_SAKU as string)
        .update({
          title: form.title,
          slug: form.slug,
          description: form.description,
          kakaksaku: form.kakaksaku,
          share: form.share,
          target_amount: parseFloat(form.target_amount.toString()),
          current_amount: parseInt(form.current_amount.toString()),
          image_url: finalImageUrls[0],
          status: form.status,
          deadline: form.deadline,
          message_template: form.message_template,
          timeline: form.timeline,
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
        .from(process.env.NEXT_PUBLIC_KAKA_SAKU as string)
        .insert({
          title: form.title,
          slug: form.slug,
          description: form.description,
          kakaksaku: form.kakaksaku,
          share: form.share,
          target_amount: parseFloat(form.target_amount.toString()),
          current_amount: parseInt(form.current_amount.toString()),
          image_url: finalImageUrls[0],
          status: form.status,
          deadline: form.deadline,
          message_template: form.message_template,
          timeline: form.timeline,
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
        .from(process.env.NEXT_PUBLIC_KAKA_SAKU as string)
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setKakasaku(data as KakaSaku[]);
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
        fileName: `kaka-saku-${Date.now()}`,
        folder: "/kaka-saku",
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
      .from(process.env.NEXT_PUBLIC_KAKA_SAKU as string)
      .delete()
      .eq("id", id);
    if (!error) {
      setKakasaku(kakasaku.filter((p) => p.id !== id));
      toast.success("Produk berhasil dihapus!");
    } else {
      toast.error("Gagal menghapus produk!");
    }
  };
  const openViewModal = (product: KakaSaku) => {
    setViewingProduct(product);
    setViewModalOpen(true);
  };
  const closeViewModal = () => {
    setViewingProduct(null);
    setViewModalOpen(false);
  };

  // Timeline management functions
  const openTimelineModal = () => {
    setTimelineForm({
      type: "",
      image_url: "",
    });
    setTimelineImagePreview(null);
    setIsTimelineEditMode(false);
    setEditingTimelineId(null);
    setTimelineModalOpen(true);
  };

  const openEditTimelineModal = (timelineItem: Timeline) => {
    setTimelineForm({
      type: timelineItem.type,
      image_url: timelineItem.image_url || "",
    });
    setTimelineImagePreview(timelineItem.image_url || null);
    setIsTimelineEditMode(true);
    setEditingTimelineId(timelineItem.id);
    setTimelineModalOpen(true);
  };

  const closeTimelineModal = () => {
    setTimelineModalOpen(false);
    setIsTimelineEditMode(false);
    setEditingTimelineId(null);
    setTimelineImagePreview(null);
    setTimelinePendingImages([]);
  };

  const handleTimelineChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTimelineForm({ ...timelineForm, [name]: value });
  };

  const handleTimelineFilesUpload = async (files: FileList) => {
    setTimelinePendingImages(Array.from(files));
    setTimelineImagePreview(URL.createObjectURL(files[0]));
    setTimelineForm({ ...timelineForm, image_url: "" });
  };

  const handleTimelineImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleTimelineFilesUpload(e.target.files);
    }
  };

  const uploadTimelineImage = async (file: File): Promise<string> => {
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
        fileName: `timeline-${Date.now()}`,
        folder: "/timeline",
      });
      if (!result || !result.url) {
        throw new Error("Failed to upload image");
      }
      return result.url;
    } catch (error) {
      console.error("Error uploading timeline image:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleTimelineSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTimelineUploading(true);
    let error = null;
    let uploadedUrl = "";

    if (timelinePendingImages.length > 0) {
      uploadedUrl = await uploadTimelineImage(timelinePendingImages[0]);
    }

    const finalImageUrl = uploadedUrl || timelineForm.image_url;
    const newTimelineItem: Timeline = {
      id:
        isTimelineEditMode && editingTimelineId
          ? editingTimelineId
          : `timeline-${Date.now()}`,
      type: timelineForm.type,
      image_url: finalImageUrl,
    };

    let updatedTimeline: Timeline[];
    if (isTimelineEditMode && editingTimelineId) {
      // Edit existing timeline item
      updatedTimeline = form.timeline.map((item) =>
        item.id === editingTimelineId ? newTimelineItem : item
      );
    } else {
      // Add new timeline item
      updatedTimeline = [...form.timeline, newTimelineItem];
    }

    setForm({ ...form, timeline: updatedTimeline });
    setTimelineUploading(false);
    setTimelinePendingImages([]);
    closeTimelineModal();
    toast.success(
      isTimelineEditMode
        ? "Timeline berhasil diupdate!"
        : "Timeline berhasil ditambahkan!"
    );
  };

  const deleteTimelineItem = (timelineId: string) => {
    const updatedTimeline = form.timeline.filter(
      (item) => item.id !== timelineId
    );
    setForm({ ...form, timeline: updatedTimeline });
    toast.success("Timeline berhasil dihapus!");
  };

  return {
    kakasaku,
    setKakasaku,
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
    openViewModal,
    closeViewModal,
    timelineModalOpen,
    setTimelineModalOpen,
    timelineForm,
    setTimelineForm,
    isTimelineEditMode,
    setIsTimelineEditMode,
    editingTimelineId,
    setEditingTimelineId,
    timelineImagePreview,
    setTimelineImagePreview,
    timelinePendingImages,
    setTimelinePendingImages,
    timelineUploading,
    setTimelineUploading,
    timelineInputRef,
    openTimelineModal,
    openEditTimelineModal,
    closeTimelineModal,
    handleTimelineChange,
    handleTimelineFilesUpload,
    handleTimelineImageChange,
    handleTimelineSubmit,
    uploadTimelineImage,
    deleteTimelineItem,
  };
}
