import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import landingHeroImg from "../assets/landingHeroImg.png";
import Footer from "../components/Footer";

const validateEmail = (email) => {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password) => {
  // At least 1 letter, 1 number or special character, and at least 10 characters
  return (
    /[A-Za-z]/.test(password) &&
    /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) &&
    password.length >= 10
  );
};

const passwordChecks = [
  {
    label: "1 letter",
    test: (pw) => /[A-Za-z]/.test(pw),
  },
  {
    label: "1 number or special character (example: # ? ! &)",
    test: (pw) => /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw),
  },
  {
    label: "10 characters",
    test: (pw) => pw.length >= 10,
  },
];

const steps = ["email", "password", "profile"];

const SignUpPage = () => {
  const navigate = useNavigate();
  const { registerEmail, registerPassword, registerUser } =
    useContext(AuthContext);
  const [tempToken, setTempToken] = useState();
  const [newTempToken, setNewTempToken] = useState();
  const [token, setToken] = useState();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    agreeToTerms: false,
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setError("");
    if (steps[step] === "email") {
      if (!validateEmail(formData.email)) {
        setError("Please enter a valid email address.");
        return;
      }
      try {
        const res = await registerEmail(formData.email);
        setTempToken(res);
        setEmailChecked(true);
        setStep(step + 1);
      } catch (error) {
        setError(error);
        return;
      }
    }

    if (steps[step] === "password") {
      if (!validatePassword(formData.password)) {
        setError(
          "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, and a number."
        );
        return;
      }
      try {
        const res = await registerPassword(formData.password, tempToken);
        setNewTempToken(res);
        setStep(step + 1);
      } catch (error) {
        setError(error);
        setStep(step - 1);
      }
    }

    if (steps[step] === "profile") {
      if (!formData.firstName.trim()) {
        setError("Please enter your first name.");
        return;
      }
      if (!formData.lastName.trim()) {
        setError("Please enter your last name.");
        return;
      }
      if (!formData.birthDate) {
        setError("Please enter your date of birth.");
        return;
      }
      if (!formData.gender) {
        setError("Please select your gender.");
        return;
      }
      if (!formData.agreeToTerms) {
        setError("You must agree to the Terms and Conditions to continue.");
        return;
      }
      try {
        await registerUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate,
          gender: formData.gender,
          newTempToken,
        });
        alert("Sign up successful!");
        navigate("/dashboard");
      } catch (error) {
        setError(error);
        setStep(0);
      }
    }
  };

  const handleBack = () => {
    setError("");
    if (step > 0) setStep(step - 1);
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
              Join QuickRent
            </h1>
            <div className="w-full max-w-md">
              <img
                src={landingHeroImg}
                alt="Join QuickRent"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
        {/* Right Side - Multi-step Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 font-poppins mb-2">
                Sign Up
              </h2>
            </div>
            <form
              onSubmit={handleNext}
              className="space-y-6 min-h-[420px] flex flex-col justify-center"
            >
              {/* Step 1: Email */}
              {step === 0 && (
                <>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] focus:border-transparent font-poppins text-lg"
                    placeholder="Email"
                  />
                  {error && (
                    <div className="text-red-500 text-sm mt-1">{error}</div>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-[#6C4BF4] text-white py-4 px-4 rounded-md font-semibold hover:bg-purple-700 transition-colors font-poppins text-lg mb-2"
                  >
                    Next
                  </button>
                  {/* Social Login Buttons */}
                  <div className="relative mb-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500 font-poppins">
                        OR
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </button>
                  </div>
                </>
              )}
              {/* Step 2: Password */}
              {step === 1 && (
                <>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Create a password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] focus:border-transparent font-poppins text-lg pr-10"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M4.293 4.293a1 1 0 011.414 0l10 10a1 1 0 01-1.414 1.414l-1.32-1.32A8.001 8.001 0 012 10c1.73-3.14 5.06-5 8-5 1.13 0 2.22.19 3.22.54l-1.43 1.43A6.001 6.001 0 004 10c0 1.13.19 2.22.54 3.22l-1.43 1.43a1 1 0 010-1.414z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 3C6.13 3 2.73 5.86 1 10c1.73 4.14 5.13 7 9 7s7.27-2.86 9-7c-1.73-4.14-5.13-7-9-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="mt-4 mb-2">
                    <div className="font-semibold text-sm text-gray-900 mb-1">
                      Your password must contain at least
                    </div>
                    <ul className="space-y-1">
                      {passwordChecks.map((check, idx) => {
                        const passed = check.test(formData.password);
                        return (
                          <li key={idx} className="flex items-center text-sm">
                            <svg
                              className={`w-5 h-5 mr-2 ${
                                passed ? "text-green-500" : "text-gray-400"
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={
                                  passed
                                    ? "M5 13l4 4L19 7"
                                    : "M6 18L18 6M6 6l12 12"
                                }
                              />
                            </svg>
                            <span
                              className={
                                passed ? "text-gray-800" : "text-gray-500"
                              }
                            >
                              {check.label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm mt-1">{error}</div>
                  )}
                  <div className="flex justify-between mt-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-[#6C4BF4] font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-[#6C4BF4] text-white py-3 px-6 rounded-md font-semibold hover:bg-purple-700 transition-colors font-poppins"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
              {/* Step 3: First Name, Last Name, Date of Birth, Gender, Terms (Combined) */}
              {step === 2 && (
                <>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Profile Information
                  </label>
                  <div className="flex gap-3 mb-3">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-1/2 px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] focus:border-transparent font-poppins text-lg"
                      placeholder="First name"
                    />
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-1/2 px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] focus:border-transparent font-poppins text-lg"
                      placeholder="Last name"
                    />
                  </div>
                  <label
                    htmlFor="birthDate"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] focus:border-transparent font-poppins text-lg mb-3"
                  />
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Gender
                  </label>
                  <div className="flex gap-4 mb-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleInputChange}
                        className="accent-[#6C4BF4]"
                      />
                      <span>Male</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleInputChange}
                        className="accent-[#6C4BF4]"
                      />
                      <span>Female</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={formData.gender === "other"}
                        onChange={handleInputChange}
                        className="accent-[#6C4BF4]"
                      />
                      <span>Other</span>
                    </label>
                  </div>
                  {/* Terms and Conditions Checkbox */}
                  <div className="flex items-center mb-2 mt-6">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="accent-[#6C4BF4] mr-2"
                    />
                    <label
                      htmlFor="agreeToTerms"
                      className="text-sm text-gray-700"
                    >
                      I agree to QuickRent's{" "}
                      <a href="#" className="text-[#6C4BF4] hover:underline">
                        Terms of Service
                      </a>{" "}
                      &{" "}
                      <a href="#" className="text-[#6C4BF4] hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm mt-1">{error}</div>
                  )}
                  <div className="flex justify-between mt-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-[#6C4BF4] font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-[#6C4BF4] text-white py-3 px-6 rounded-md font-semibold hover:bg-purple-700 transition-colors font-poppins"
                    >
                      Sign Up
                    </button>
                  </div>
                </>
              )}
            </form>
            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600 font-poppins">
                Have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-[#6C4BF4] hover:underline font-medium bg-transparent border-none cursor-pointer"
                >
                  Log In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SignUpPage;
