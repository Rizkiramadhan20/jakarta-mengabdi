import { useState, useEffect } from "react";

import { supabase } from "@/utils/supabase/supabase";

import { Profile } from "@/interface/profile";

import toast from "react-hot-toast";

export const useManagementAccounts = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Edit dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<Profile | null>(null);
  const [editType, setEditType] = useState<"status" | "password">("status");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Create admin dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    photo_url: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset password fields when edit dialog opens
  useEffect(() => {
    if (editDialogOpen && editType === "password") {
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [editDialogOpen, editType]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(process.env.NEXT_PUBLIC_PROFILES as string)
        .select("*")
        .eq("role", "admin")
        .order("created_at", { ascending: false });

      if (error) {
        return;
      }

      setUsers(data || []);
    } catch (error) {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users
    .filter((user) => {
      if (statusFilter === "active") return user.is_active === true;
      if (statusFilter === "inactive") return user.is_active === false;
      return true;
    })
    .filter(
      (user) =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    );

  const handleDeleteClick = (user: Profile) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      setDeleting(true);

      const requestBody = {
        userId: userToDelete.id,
        apiSecret: process.env.NEXT_PUBLIC_API_SECRET,
      };

      const response = await fetch("/api/profile/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to delete user");
      }

      // Remove user from local state
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userToDelete.id)
      );

      // Close dialog and reset state
      setDeleteDialogOpen(false);
      setUserToDelete(null);

      // Show success message
      toast.success("Pengguna berhasil dihapus!");

      // Refresh data from server to ensure consistency
      setTimeout(() => {
        fetchUsers();
      }, 1000);
    } catch (error) {
      toast.error(
        `Gagal menghapus pengguna: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  // Edit functionality
  const handleEditClick = (user: Profile, type: "status" | "password") => {
    // Reset all edit states first
    setNewPassword("");
    setConfirmPassword("");
    setUserToEdit(null);
    setEditType(type);

    // Then set the new values
    setUserToEdit(user);
    setEditDialogOpen(true);
  };

  const handleEditConfirm = async () => {
    if (!userToEdit) return;

    try {
      setUpdating(true);

      if (editType === "password") {
        if (newPassword !== confirmPassword) {
          toast.error("Password tidak cocok!");
          return;
        }
        if (newPassword.length < 6) {
          toast.error("Password minimal 6 karakter!");
          return;
        }
      }

      const requestBody = {
        userId: userToEdit.id,
        editType: editType,
        newPassword: editType === "password" ? newPassword : undefined,
        isActive: editType === "status" ? !userToEdit.is_active : undefined,
        apiSecret: process.env.NEXT_PUBLIC_API_SECRET,
      };

      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update user");
      }

      // Update user in local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userToEdit.id
            ? {
                ...user,
                is_active:
                  editType === "status" ? !user.is_active : user.is_active,
              }
            : user
        )
      );

      // Close dialog and reset state
      setEditDialogOpen(false);
      setUserToEdit(null);
      setNewPassword("");
      setConfirmPassword("");

      // Show success message
      const successMessage =
        editType === "status"
          ? `Status pengguna berhasil ${
              userToEdit.is_active ? "dinonaktifkan" : "diaktifkan"
            }!`
          : "Password pengguna berhasil diubah!";
      toast.success(successMessage);

      // Refresh data from server to ensure consistency
      setTimeout(() => {
        fetchUsers();
      }, 1000);
    } catch (error) {
      toast.error(
        `Gagal mengubah pengguna: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setUserToEdit(null);
    setNewPassword("");
    setConfirmPassword("");
  };

  // Reset edit states when dialog closes
  const handleEditDialogChange = (open: boolean) => {
    if (!open) {
      setNewPassword("");
      setConfirmPassword("");
      setUserToEdit(null);
    }
    setEditDialogOpen(open);
  };

  // Create admin functionality
  const handleCreateClick = () => {
    setCreateFormData({
      full_name: "",
      email: "",
      phone: "",
      photo_url: "",
      password: "",
      confirmPassword: "",
    });
    setCreateDialogOpen(true);
  };

  const handleCreateConfirm = async () => {
    try {
      setCreating(true);

      // Validate required fields
      if (
        !createFormData.full_name ||
        !createFormData.email ||
        !createFormData.phone ||
        !createFormData.password ||
        !createFormData.confirmPassword
      ) {
        toast.error("Semua field wajib diisi!");
        return;
      }

      // Validate password
      if (createFormData.password !== createFormData.confirmPassword) {
        toast.error("Password tidak cocok!");
        return;
      }

      if (createFormData.password.length < 6) {
        toast.error("Password minimal 6 karakter!");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(createFormData.email)) {
        toast.error("Format email tidak valid!");
        return;
      }

      const requestBody = {
        full_name: createFormData.full_name,
        email: createFormData.email,
        role: "admin",
        phone: createFormData.phone,
        photo_url: createFormData.photo_url || undefined,
        password: createFormData.password,
        apiSecret: process.env.NEXT_PUBLIC_API_SECRET,
      };

      const response = await fetch("/api/profile/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to create admin");
      }

      // Close dialog and reset form
      setCreateDialogOpen(false);
      setCreateFormData({
        full_name: "",
        email: "",
        phone: "",
        photo_url: "",
        password: "",
        confirmPassword: "",
      });

      // Show success message
      toast.success("Admin berhasil dibuat!");

      // Refresh data from server
      setTimeout(() => {
        fetchUsers();
      }, 1000);
    } catch (error) {
      toast.error(
        `Gagal membuat admin: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setCreating(false);
    }
  };

  const handleCreateCancel = () => {
    setCreateDialogOpen(false);
    setCreateFormData({
      full_name: "",
      email: "",
      phone: "",
      photo_url: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleCreateFormChange = (field: string, value: string) => {
    setCreateFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    deleteDialogOpen,
    setDeleteDialogOpen,
    userToDelete,
    deleting,
    filteredUsers,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    // Edit functionality
    editDialogOpen,
    setEditDialogOpen,
    userToEdit,
    editType,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    updating,
    handleEditClick,
    handleEditConfirm,
    handleEditCancel,
    handleEditDialogChange,
    // Create admin functionality
    createDialogOpen,
    setCreateDialogOpen,
    creating,
    createFormData,
    handleCreateClick,
    handleCreateConfirm,
    handleCreateCancel,
    handleCreateFormChange,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  };
};
