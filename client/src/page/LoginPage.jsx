import React, { useContext, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Swal from 'sweetalert2';
import { AuthContext } from "../provider/AuthProvider";

// ✅ Your correct Google OAuth Client ID
const GOOGLE_CLIENT_ID = "185874875197-ap6gf3b6p03tjns8h1riq34moi8g58j8.apps.googleusercontent.com";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState({});

  const { logIn, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || location.state?.returnUrl || "/";
  const loginMessage = location.state?.message;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await logIn('email', { 
        email: formData.email, 
        password: formData.password 
      });
      
      // Success notification
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Login successful!",
        text: "Welcome back!",
        showConfirmButton: false,
        timer: 1500,
      });

      // Reset form
      setFormData({
        email: "",
        password: "",
        rememberMe: false
      });

      // Navigate after a brief delay
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMessage,
        confirmButtonText: 'Try Again'
      });
    }
  };

  // ✅ Google login success handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log('Google credential response:', credentialResponse);
      
      // ✅ Google token from response
      const googleToken = credentialResponse.credential;
      
      if (!googleToken) {
        throw new Error('No token received from Google');
      }

      // ✅ Send Google token to your backend
      await logIn('google', { token: googleToken });
      
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Google Login successful!",
        text: "Welcome back!",
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);

    } catch (error) {
      console.error('Google login failed:', error);
      
      let errorMessage = 'Unable to sign in with Google. Please try again.';
      
      // ✅ Enhanced error handling
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: errorMessage,
        confirmButtonText: 'Try Again'
      });
    }
  };

  // Handle Google login error
  const handleGoogleError = (error) => {
    console.error("Google Login Failed:", error);
    Swal.fire({
      icon: 'error',
      title: 'Google Login Failed',
      text: 'Google authentication failed. Please try again.',
      confirmButtonText: 'Try Again'
    });
  };

  return (
    
      <div className="min-h-screen flex flex-col md:flex-row justify-center items-center bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 p-4 md:p-0">
        <div className="w-full md:w-1/2 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:shadow-3xl">
            <div className="text-center mb-8">
              <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Lock className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Enter your credentials to access your account
              </p>
              
              {/* Show login message if redirected from package/order */}
              {loginMessage && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">{loginMessage}</p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 focus:ring-green-500 focus:border-green-500 block w-full px-3 py-3 border rounded-lg shadow-sm text-gray-900 transition-all duration-200 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 focus:ring-green-500 focus:border-green-500 block w-full px-3 py-3 border rounded-lg shadow-sm text-gray-900 transition-all duration-200 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password - Fixed styling */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label 
                    htmlFor="rememberMe" 
                    className="text-sm text-gray-700 cursor-pointer select-none"
                  >
                    Remember me
                  </label>
                </div>
                
                <div>
                  <Link 
                    to="/forget-password"
                    className="text-sm font-medium text-green-600 hover:text-green-500 transition-colors duration-200"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-indigo-600 hover:from-green-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-150 hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            {/* Social Login */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Social Login */}
<div className="mt-8">
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-gray-300"></div>
    </div>
   
  </div>

  <div className="mt-6">
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        logo_alignment="center"
        width="100%"
        useOneTap={false}  // FIXED
        auto_select={false}  // FIXED
      />
    </div>
  </div>
</div>

            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="font-medium text-green-600 hover:text-green-500 focus:outline-none transition-colors duration-200"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    
  );
}