"use client";

import { useState } from "react";

import { useAuth } from "@/utils/context/AuthContext";

export type SigninFormData = {
  email: string;
  password: string;
  remember: boolean;
};

export function useStateSignin() {
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SigninFormData>({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      remember: checked,
    }));
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(formData.email, formData.password);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    showPassword,
    isLoading,
    formData,
    handleChange,
    handleCheckboxChange,
    toggleShowPassword,
    handleSubmit,
    setShowPassword,
    setIsLoading,
    setFormData,
  };
}

export default useStateSignin;
