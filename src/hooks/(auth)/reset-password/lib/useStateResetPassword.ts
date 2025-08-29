"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/utils/context/AuthContext";

import { supabase } from "@/utils/supabase/supabase";

import toast from "react-hot-toast";

export function useStateResetPassword() {
  const router = useRouter();
  const { changePassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const checkTokenAndSetSession = async () => {
      try {
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error) {
            setIsValidToken(true);
            window.history.replaceState({}, document.title, "/reset-password");
          } else {
            toast.error("Link reset password tidak valid atau sudah expired");
            setTimeout(() => router.push("/forgot-password"), 3000);
          }
        } else {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session) {
            setIsValidToken(true);
          } else {
            toast.error("Link reset password tidak valid atau sudah expired");
            setTimeout(() => router.push("/forgot-password"), 3000);
          }
        }
      } catch (_error) {
        toast.error("Terjadi kesalahan, silakan coba lagi");
        setTimeout(() => router.push("/forgot-password"), 3000);
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkTokenAndSetSession();
  }, [router]);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password dan konfirmasi password tidak sama");
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    setIsLoading(true);
    try {
      const success = await changePassword(password);
      if (success) {
        setIsSuccess(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // state
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    isLoading,
    isValidToken,
    isCheckingToken,
    isSuccess,
    // setters
    setPassword,
    setConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    setIsLoading,
    setIsSuccess,
    // handlers
    toggleShowPassword,
    toggleShowConfirmPassword,
    handleSubmit,
  };
}

export default useStateResetPassword;
