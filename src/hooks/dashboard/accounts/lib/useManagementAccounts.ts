import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { Profile } from "@/interface/profile";
import toast from "react-hot-toast";

export const useManagementAccounts = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
        .eq("role", "user")
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

  const filteredUsers = users.filter(
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

  return {
    users,
    loading,
    searchTerm,
    setSearchTerm,
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
  };
};
