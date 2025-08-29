import { useState, useRef, useEffect } from "react";

import toast from "react-hot-toast";

import { supabase } from "@/utils/supabase/supabase";

import imagekitInstance from "@/utils/imagekit/imagekit";

import type { Donasi, DonasiFormData } from "@/interface/donasi";

export function useManagamentDonasi() {
  const [donasi, setDonasi] = useState<Donasi[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<DonasiFormData>({
    title: "",
    slug: "",
    description: "",
    content: "",
    donations: 0,
    share: 0,
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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    done: number;
    total: number;
  }>({ done: 0, total: 0 });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Donasi | null>(null);

  useEffect(() => {
    const fetchDonasi = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from(process.env.NEXT_PUBLIC_DONATIONS as string)
        .select(
          "id,title,description,image_url,donations,share,target_amount,current_amount,status,deadline,created_at,message_template"
        )
        .order("created_at", { ascending: false });
      if (!error && data) {
        const now = new Date();
        const toClose = data.filter((d: any) => {
          if (d.status === "open" && d.deadline) {
            const deadlineDate = new Date(d.deadline);
            return deadlineDate < now;
          }
          return false;
        });
        if (toClose.length > 0) {
          await Promise.all(
            toClose.map((d: any) =>
              supabase
                .from(process.env.NEXT_PUBLIC_DONATIONS as string)
                .update({ status: "closed" })
                .eq("id", d.id)
            )
          );
          // Fetch ulang data setelah update
          const { data: updatedData } = await supabase
            .from(process.env.NEXT_PUBLIC_DONATIONS as string)
            .select("*")
            .order("created_at", { ascending: false });
          setDonasi(updatedData as Donasi[]);
        } else {
          setDonasi(data as Donasi[]);
        }
      }
      setLoading(false);
    };
    fetchDonasi();
  }, [creating]);

  const openCreateModal = () => {
    setForm({
      title: "",
      slug: "",
      description: "",
      content: "",
      donations: 0,
      share: 0,
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
      slug: donasi.slug,
      description: donasi.description || "",
      content: donasi.content || "",
      donations: donasi.donations || 0,
      share: donasi.share || 0,
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
    const file = files[0];
    setImagePreview(URL.createObjectURL(file));
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
    let uploadedUrl = "";
    if (imagePreview && form.image_url === "") {
      setUploading(true);
      setUploadProgress({ done: 0, total: 1 });
      uploadedUrl = await uploadImage(
        (await fetch(imagePreview).then((r) => r.blob())) as any
      );
      setUploadProgress({ done: 1, total: 1 });
      setUploading(false);
      setUploadProgress({ done: 0, total: 0 });
    }
    let finalImageUrl = uploadedUrl || form.image_url;
    if (isEditMode && editingId) {
      const res = await supabase
        .from(process.env.NEXT_PUBLIC_DONATIONS as string)
        .update({
          title: form.title,
          slug: form.slug,
          description: form.description,
          content: form.content,
          donations: form.donations,
          share: form.share,
          target_amount: parseFloat(form.target_amount.toString()),
          current_amount: parseInt(form.current_amount.toString()),
          image_url: finalImageUrl,
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
          slug: form.slug,
          description: form.description,
          content: form.content,
          donations: form.donations,
          share: form.share,
          target_amount: parseFloat(form.target_amount.toString()),
          current_amount: parseInt(form.current_amount.toString()),
          image_url: finalImageUrl,
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
    setImagePreview(null);
    if (!error) {
      closeModal();
      const { data } = await supabase
        .from(process.env.NEXT_PUBLIC_DONATIONS as string)
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setDonasi(data as Donasi[]);
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
    inputRef,
    uploadProgress,
    setUploadProgress,
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
    uploadImage,
    handleDelete,
    openViewModal,
    closeViewModal,
  };
}
