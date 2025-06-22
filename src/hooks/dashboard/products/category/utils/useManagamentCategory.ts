import { useState, useEffect } from "react";

import toast from "react-hot-toast";

import { supabase } from "@/utils/supabase/supabase";

import { Category } from "@/interface/products";

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
    setIsEditMode(false);
    setEditingId(null);
    setModalOpen(true);
  };
  const openEditModal = (category: Category) => {
    setForm({
      name: category.name,
      thumbnail: category.thumbnail || "",
    });
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
    const { name, value } = e.target;
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
  };
}
