import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { registerUser } from "@/auth/api";
import { validateReg } from "@/auth/validate";
import { toast } from "sonner";
import { useRegisterForm } from "@/auth/useForm"; // Assuming this hook handles form state

export default function Register() {
  const [formData, handleChange] = useRegisterForm({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    isGuide: false,
    isEventManager: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateReg(formData);
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const response = await registerUser(formData);
        setLoading(false);
        if (response) {
          toast.success("Account created successfully. Click on the login tab to login.");
          navigate("/account");
        } else {
          toast.error("Failed to create account.");
        }
      } catch (error) {
        setLoading(false);
        toast.error(`Error: ${error.message}`);
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
        Create account 🚀
      </h1>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data" // Remove this line if not using multipart
        className="flex flex-col border shadow-lg border-black px-10 py-8 rounded-lg"
      >
        <div className="mb-3">
          <Input
            id="firstName"
            className="min-w-[280px]"
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <p className="text-red-500 font-thin">{errors.firstName}</p>
          )}
        </div>
        <div className="mb-3">
          <Input
            id="lastName"
            className="min-w-[280px]"
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <p className="text-red-500 font-thin">{errors.lastName}</p>
          )}
        </div>
        <div className="mb-3">
          <Input
            id="username"
            className="min-w-[280px]"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && (
            <p className="text-red-500 font-thin">{errors.username}</p>
          )}
        </div>
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
        <TooltipProvider className="mb-3">
          <Tooltip>
            <TooltipTrigger>
              <Button
                type="submit"
                className="min-w-[280px]"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign up"}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-wrap mt-3 text-slate-700">
                Click on "Sign up" button to agree to the <br />
                <Link
                  to="privacy-policy"
                  className="underline hover:text-blue-800"
                >
                  terms and conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="privacy-policy"
                  className="underline hover:text-blue-800"
                >
                  privacy policy
                </Link>
                .
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </form>
    </div>
  );
}
