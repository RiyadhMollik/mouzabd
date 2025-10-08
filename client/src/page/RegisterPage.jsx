import { useState, useContext } from "react";
import { Eye, EyeOff, User, Mail, MapPin } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../provider/AuthProvider";

export default function RegisterPage() {
  const { register, loading } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    roles: 42659, // default role
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const formErrors = validateForm();
    setApiError("");
    setErrors({});

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      // একীভূত রেজিস্টার (AuthProvider.register)
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        roles: formData.roles,
      };

      await register("email", payload); // /users/ → টোকেন পেলে সেট, না পেলে AuthProvider auto-login ট্রাই করবে
      window.location.href = "/";
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response?.data) {
        const errorData = error.response.data;

        if (errorData.error && typeof errorData.error === "object") {
          const apiErrors = {};
          Object.keys(errorData.error).forEach((field) => {
            if (Array.isArray(errorData.error[field])) {
              apiErrors[field] = errorData.error[field][0];
            } else if (typeof errorData.error[field] === "string") {
              apiErrors[field] = errorData.error[field];
            }
          });
          setErrors(apiErrors);
          setApiError(
            errorData.message || "Please correct the validation errors below."
          );
        } else if (errorData.detail) {
          setApiError(errorData.detail);
        } else if (errorData.message) {
          setApiError(errorData.message);
        } else {
          setApiError(
            "Registration failed. Please check your inputs and try again."
          );
        }
      } else {
        setApiError(error.message || "Registration failed. Please try again.");
      }
    }
  };

  const handleGoogleSuccess = async ({ credential }) => {
    try {
      if (!credential) throw new Error("No token received from Google");
      await register("google", { token: credential }); // calls /google-signup/
      window.location.href = "/";
    } catch (e) {
      console.error(e);
      setApiError("Google signup failed. Please try again.");
    }
  };

  const handleGoogleError = (error) => {
    console.error("Google Signup Failed:", error);
    setApiError("Google signup failed. Please try again.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Create an Account
        </h2>

        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {apiError}
          </div>
        )}

        {/* Google Sign-Up */}
        <div className="mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            text="signup_with"
            shape="rectangular"
            useOneTap={false}
            auto_select={false}
          />
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-gray-400 text-xs">
                OR sign up with email
              </span>
            </div>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <User size={18} />
              </span>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-2 rounded-md border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-2 rounded-md border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="address">
              Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <MapPin size={18} />
              </span>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-2 rounded-md border ${
                  errors.address ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="Enter your address"
              />
            </div>
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
            } text-white font-semibold py-2 px-4 rounded-md transition duration-200 flex justify-center items-center`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-green-600 hover:text-green-800 font-medium">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
