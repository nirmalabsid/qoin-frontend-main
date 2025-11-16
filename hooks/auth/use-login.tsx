import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { schema } from "./use-signup";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

interface LoginValues {
  email: string;
  password: string;
}

const useLogin = () => {
  const queryClient = useQueryClient();

  const handleLogin = async (values: LoginValues) => {
    const response = await axiosInstance.post("/api/auth/signin", values);

    // Save token to localStorage if backend sends it
    if (response.data?.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    return response.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: LoginValues) => handleLogin(values),
    onSuccess: (data) => {
      console.log("Login success, response:", data);
      console.log("Cookies after login:", document.cookie);

      // Clear old cache first
      if (typeof window !== "undefined") {
        localStorage.removeItem("__qoin_user_cache__");
      }

      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Login berhasil!");

      // Redirect to home page with full reload to ensure fresh state
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }, 500);
    },
    onError: (error) => {
      console.error("Login error:", error);
      return toast.error("Gagal melakukan login");
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    onSubmit: async (values: LoginValues) => {
      mutate(values);
    },
    validationSchema: schema,
  });

  return { formik, isSubmitting: isPending };
};

export default useLogin;
