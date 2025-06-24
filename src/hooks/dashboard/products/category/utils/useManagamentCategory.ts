import { useState, useEffect, useRef } from "react";

import toast from "react-hot-toast";

import { supabase } from "@/utils/supabase/supabase";

import { Category } from "@/interface/products";
import imagekitInstance from "@/utils/imagekit/imagekit";

export function useManagamentProductsCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    thumbnail: "",
  });
  const [creating, setCreating] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    form.thumbnail ? [form.thumbnail] : []
  );
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from(process.env.NEXT_PUBLIC_PRODUCTS_CATEGORY as string)
        .select("id, name, thumbnail, created_at")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Supabase error:", error);
      }
      console.log("Fetched categories:", data);
      if (!error && data) setCategories(data as Category[]);
      setLoading(false);
    };
    fetchCategories();
  }, [creating]);

  const openCreateModal = () => {
    setForm({
      name: "",
      thumbnail: "",
    });
    setImagePreviews([]);
    setIsEditMode(false);
    setEditingId(null);
    setModalOpen(true);
  };
  const openEditModal = (category: Category) => {
    setForm({
      name: category.name,
      thumbnail: category.thumbnail || "",
    });
    setImagePreviews(category.thumbnail ? [category.thumbnail] : []);
    setIsEditMode(true);
    setEditingId(category.id);
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
        .from(process.env.NEXT_PUBLIC_PRODUCTS_CATEGORY as string)
        .update({
          name: form.name,
          thumbnail: form.thumbnail,
        })
        .eq("id", editingId);
      error = res.error;
      if (!error) {
        toast.success("Kategori berhasil diupdate!");
      } else {
        toast.error("Gagal mengupdate kategori!");
      }
    } else {
      const res = await supabase
        .from(process.env.NEXT_PUBLIC_PRODUCTS_CATEGORY as string)
        .insert({
          name: form.name,
          thumbnail: form.thumbnail,
        });
      error = res.error;
      if (!error) {
        toast.success("Kategori berhasil dibuat!");
      } else {
        toast.error("Gagal membuat kategori!");
      }
    }
    setCreating(false);
    if (!error) {
      closeModal();
      const { data, error } = await supabase
        .from(process.env.NEXT_PUBLIC_PRODUCTS_CATEGORY as string)
        .select("id, name, thumbnail, created_at")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Supabase error:", error);
      }
      console.log("Fetched categories after submit:", data);
      if (data) setCategories(data as Category[]);
    }
  };
  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from(process.env.NEXT_PUBLIC_PRODUCTS_CATEGORY as string)
      .delete()
      .eq("id", id);
    if (!error) {
      setCategories(categories.filter((c) => c.id !== id));
      toast.success("Kategori berhasil dihapus!");
    } else {
      toast.error("Gagal menghapus kategori!");
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
        fileName: `category-${Date.now()}`,
        folder: "/categories",
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
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress({ done: 0, total: 1 });
    try {
      const url = await uploadImage(file);
      setImagePreviews([url]);
      setForm({ ...form, thumbnail: url });
      setUploadProgress({ done: 1, total: 1 });
    } catch (error) {
      setUploadProgress({ done: 0, total: 0 });
    }
    setUploading(false);
  };

  return {
    categories,
    setCategories,
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
  };
}
