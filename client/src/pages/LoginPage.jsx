import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../context/authContext";
import landingHeroImg from "../assets/landingHeroImg.png";
import Footer from "../components/Footer";

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginUser, signInWithGoogle } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = React.useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await loginUser(formData.email, formData.password);

      // Check if user is admin and redirect accordingly
      if (
        result.user &&
        (result.user.role === "admin" || result.user.isAdmin === true)
      ) {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      // Directly map backend error strings to display messages
      switch (err) {
        case "Invalid Credentials":
          setError("Email or password is invalid");
          break;
        case "Email is not registered":
          setError("Email is not registered");
          break;
        case "This email is already tied to an existing QuickRent account.":
          setError("Email is already registered");
          break;
        default:
          setError(
            typeof err === "string" ? err : "Login failed. Please try again."
          );
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header Section */}
      <header className="w-full bg-[#6C4BF4] px-5 sm:px-6 lg:px-8 py-4 sticky top-0 z-50">
        <div className="w-full flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src="/quickRentLogo.svg"
              alt="Quick Rent Logo"
              className="w-8 h-8"
            />
            <span className="text-white text-xl font-semibold font-poppins">
              Quick Rent
            </span>
          </div>

          {/* Back to Home */}
          <button
            onClick={() => navigate("/landing")}
            className="text-white hover:text-gray-200 transition-colors font-medium"
          >
            Back to Home
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full min-h-screen flex">
        {/* Left Side - Image and Title */}
        <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center p-12">
          <div className="text-center">
            <h1 className="text-4xl xl:text-5xl font-bold text-[#6C4BF4] leading-tight font-poppins mb-8">
              Welcome Back
            </h1>
            <div className="w-full max-w-md">
              <img
                src={landingHeroImg}
                alt="Welcome to QuickRent"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 font-poppins mb-2">
                Log In
              </h2>
              <p className="text-gray-600 font-poppins">
                Welcome back to QuickRent
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-red-500 text-sm mb-2 text-center font-poppins">
                  {error}
                </div>
              )}
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2 font-poppins"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] focus:border-transparent font-poppins"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2 font-poppins"
                  htmlFor="toggle-password-label"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    ref={passwordInputRef}
                    id="toggle-password-label"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] focus:border-transparent font-poppins pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 block cursor-pointer"
                    aria-label="password toggle"
                  >
                    {showPassword ? (
                      <IoEyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <IoEye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#6C4BF4] focus:ring-[#6C4BF4] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm text-gray-600 font-poppins"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/reset-password")}
                  className="text-sm text-[#6C4BF4] hover:underline font-poppins bg-transparent border-none cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#6C4BF4] text-white py-3 px-4 rounded-md font-semibold hover:bg-purple-700 transition-colors font-poppins"
              >
                Sign In
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-poppins">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FcGoogle className="w-5 h-5 mr-2" />
                  Google
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-gray-600 font-poppins">
                  Don't have an account?{" "}
                  <button
                    onClick={() => navigate("/signup")}
                    className="text-[#6C4BF4] hover:underline font-medium bg-transparent border-none cursor-pointer"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LoginPage;
