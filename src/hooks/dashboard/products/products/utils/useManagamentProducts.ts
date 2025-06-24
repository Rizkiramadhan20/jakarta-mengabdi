import { useState, useRef, useEffect } from "react";

import toast from "react-hot-toast";

import { supabase } from "@/utils/supabase/supabase";

import imagekitInstance from "@/utils/imagekit/imagekit";

import type { Product } from "@/interface/products";

import { slugify } from "@/base/helper/slugify";

export function useManagamentProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    content: "",
    price: 0,
    stock: 0,
    image_urls: [] as string[],
    status: "tersedia",
    category: "",
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
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from(process.env.NEXT_PUBLIC_PRODUCTS as string)
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setProducts(data as Product[]);
      setLoading(false);
    };
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("productscategory")
        .select("name");
      if (!error && data) {
        setCategories(data as { name: string }[]);
      }
    };
    fetchProducts();
    fetchCategories();
  }, [creating]);

  const openCreateModal = () => {
    setForm({
      name: "",
      slug: "",
      content: "",
      price: 0,
      stock: 0,
      image_urls: [],
      status: "tersedia",
      category: "",
    });
    setImagePreviews([]);
    setIsEditMode(false);
    setEditingId(null);
    setModalOpen(true);
  };
  const openEditModal = (product: Product) => {
    setForm({
      name: product.name,
      slug: product.slug,
      content: product.content || "",
      price: product.price,
      stock: product.stock,
      image_urls: product.image_urls || [],
      status: product.status || "tersedia",
      category: product.category || "",
    });
    setImagePreviews(product.image_urls || []);
    setIsEditMode(true);
    setEditingId(product.id);
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
    if (name === "price") {
      const num = value === "" ? 0 : Number(value.replace(/[^\d.]/g, ""));
      setForm({ ...form, price: isNaN(num) ? 0 : num });
    } else if (name === "stock") {
      const num = value === "" ? 0 : Number(value.replace(/\D/g, ""));
      setForm({ ...form, stock: isNaN(num) ? 0 : num });
    } else if (name === "name") {
      setForm({ ...form, name: value, slug: slugify(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  const handleFilesUpload = async (files: FileList) => {
    setPendingImages(Array.from(files));
    setImagePreviews(
      Array.from(files).map((file) => URL.createObjectURL(file))
    );
    setForm({ ...form, image_urls: [] });
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
    if (isEditMode && form.image_urls && form.image_urls.length > 0) {
      finalImageUrls = [...form.image_urls, ...uploadedUrls];
    }
    if (isEditMode && editingId) {
      const res = await supabase
        .from(process.env.NEXT_PUBLIC_PRODUCTS as string)
        .update({
          name: form.name,
          slug: form.slug,
          content: form.content,
          price: parseFloat(form.price.toString()),
          stock: parseInt(form.stock.toString()),
          image_urls: finalImageUrls,
          status: form.status,
          category: form.category,
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
        .from(process.env.NEXT_PUBLIC_PRODUCTS as string)
        .insert({
          name: form.name,
          slug: form.slug,
          content: form.content,
          price: parseFloat(form.price.toString()),
          stock: parseInt(form.stock.toString()),
          image_urls: finalImageUrls,
          status: form.status,
          category: form.category,
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
        .from(process.env.NEXT_PUBLIC_PRODUCTS as string)
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setProducts(data as Product[]);
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
        fileName: `product-${Date.now()}`,
        folder: "/products",
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
      .from(process.env.NEXT_PUBLIC_PRODUCTS as string)
      .delete()
      .eq("id", id);
    if (!error) {
      setProducts(products.filter((p) => p.id !== id));
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
      setForm({ ...form, image_urls: newPreviews });
    }
    setDraggedImageIdx(null);
  };
  const handleImageDragEnd = () => {
    setIsDraggingImage(false);
    setDraggedImageIdx(null);
  };
  const openViewModal = (product: Product) => {
    setViewingProduct(product);
    setViewModalOpen(true);
  };
  const closeViewModal = () => {
    setViewingProduct(null);
    setViewModalOpen(false);
  };

  return {
    products,
    setProducts,
    categories,
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
