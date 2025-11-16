"use client";

import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useLogout = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/api/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();

      // Clear localStorage including auth token
      if (typeof window !== "undefined") {
        localStorage.clear();
      }

      toast.success("Logout berhasil!");

      // Force full page reload to clear all state
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    },
    onError: () => {
      return toast.error("Logout gagal!");
    },
  });

  const handleLogout = () => {
    mutate();
  };

  return {
    handleLogout,
    isPending,
  };
};

export default useLogout;
