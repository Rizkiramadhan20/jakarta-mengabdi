import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/utils/supabase/supabase";

export function useManagamentOnlineStore() {
  const [onlineStore, setOnlineStore] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", url: "" });
  const [creating, setCreating] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOnlineStore = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("online_store")
        .select("id, name, url, created_at")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Supabase error:", error);
      }
      if (!error && data) setOnlineStore(data);
      setLoading(false);
    };
    fetchOnlineStore();
  }, [creating]);

  const openCreateModal = () => {
    setForm({ name: "", url: "" });
    setIsEditMode(false);
    setEditingId(null);
    setModalOpen(true);
  };
  const openEditModal = (item: any) => {
    setForm({ name: item.name || "", url: item.url });
    setIsEditMode(true);
    setEditingId(item.id);
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
        .from("online_store")
        .update({ name: form.name, url: form.url })
        .eq("id", editingId);
      error = res.error;
      if (!error) {
        toast.success("Online Store berhasil diupdate!");
      } else {
        toast.error("Gagal mengupdate Online Store!");
      }
    } else {
      const res = await supabase
        .from("online_store")
        .insert({ name: form.name, url: form.url });
      error = res.error;
      if (!error) {
        toast.success("Online Store berhasil dibuat!");
      } else {
        toast.error("Gagal membuat Online Store!");
      }
    }
    setCreating(false);
    if (!error) {
      closeModal();
      const { data, error } = await supabase
        .from("online_store")
        .select("id, name, url, created_at")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Supabase error:", error);
      }
      if (data) setOnlineStore(data);
    }
  };
  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("online_store").delete().eq("id", id);
    if (!error) {
      setOnlineStore(onlineStore.filter((c) => c.id !== id));
      toast.success("Online Store berhasil dihapus!");
    } else {
      toast.error("Gagal menghapus Online Store!");
    }
  };

  return {
    onlineStore,
    setOnlineStore,
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
