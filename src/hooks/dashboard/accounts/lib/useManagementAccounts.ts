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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(process.env.NEXT_PUBLIC_PROFILES as string)
        .select("*")
        .eq("role", "user")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error("Error:", error);
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
  };
};
