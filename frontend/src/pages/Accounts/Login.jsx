import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/auth/api";
import { validateLogin } from "@/auth/validate";
import { useLoginForm } from "@/auth/useForm";
import { toast } from "sonner";

export default function Login() {
  const [formData, handleChange, setFormData] = useLoginForm({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLogin(formData);
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const response = await loginUser(formData);
        setLoading(false);

        if (response) {
          toast.success("Logged in successfully.");
          navigate("/");
        } else {
          toast.error("Failed to login. Please check your credentials.");
        }
      } catch (error) {
        console.error("Login error:", error.message);
        setLoading(false);
        toast.error("Error: " + error.message);
        setErrors({
          apiError:
            error.response?.data?.detail ||
            "An error occurred. Please try again later.",
        });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="flex flex-col mt-5">
      <h1 className="text-4xl text-center uppercase font-bold mb-5">
        Login 🚀
      </h1>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="flex flex-col border shadow-lg border-black px-10 py-8 rounded-lg"
      >
        <div className="mb-3">
          <Input
            id="email"
            className="min-w-[280px]"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 font-thin">{errors.email}</p>
          )}
        </div>
        <div className="mb-3">
          <Input
            id="password"
            className="min-w-[280px]"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="text-red-500 font-thin">{errors.password}</p>
          )}
          {errors.apiError && (
            <p className="text-red-500 font-thin">{errors.apiError}</p>
          )}
        </div>
        <div className="mb-3">
          <Button type="submit" className="min-w-[280px]" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </form>
    </div>
  );
}
