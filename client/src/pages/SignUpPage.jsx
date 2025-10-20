import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff, IoCheckmark, IoClose } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
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

const steps = ["email", "password", "verify", "profile"];

const SignUpPage = () => {
  const navigate = useNavigate();
  const { registerEmail, registerPassword, registerUser, signInWithGoogle, verifyCode, resendVerificationCode } =
    useContext(AuthContext);
  const [tempToken, setTempToken] = useState();
  const [newTempToken, setNewTempToken] = useState();
  const [token, setToken] = useState();
  const [step, setStep] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    if (steps[step] === "email") {
      if (!validateEmail(formData.email)) {
        setError("Please enter a valid email address.");
        setLoading(false);
        return;
      }
      try {
        const res = await registerEmail(formData.email);
        setTempToken(res);
        setEmailChecked(true);
        setStep(step + 1);
      } catch (error) {
        setError(error);
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    if (steps[step] === "password") {
      if (!validatePassword(formData.password)) {
        setError(
          "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, and a number."
        );
        setLoading(false);
        return;
      }
      try {
        const res = await registerPassword(formData.password, tempToken);
        setNewTempToken(res);
        setStep(step + 1);
        setResendTimer(60); // 60 seconds before resend
      } catch (error) {
        setError(error);
        setStep(step - 1);
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    if (steps[step] === "verify") {
      if (!/^[0-9]{6}$/.test(verificationCode)) {
        setError("Please enter the 6-digit code sent to your email.");
        setLoading(false);
        return;
      }
      try {
        const res = await verifyCode({ code: verificationCode, newTempToken });
        // Use the verifiedTempToken for the next step
        setNewTempToken(res.verifiedTempToken);
        setStep(step + 1);
      } catch (error) {
        setError(error);
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    if (steps[step] === "profile") {
      if (!formData.firstName.trim()) {
        setError("Please enter your first name.");
        setLoading(false);
        return;
      }
      if (!formData.lastName.trim()) {
        setError("Please enter your last name.");
        setLoading(false);
        return;
      }
      if (!formData.birthDate) {
        setError("Please enter your date of birth.");
        setLoading(false);
        return;
      }
      if (!formData.gender) {
        setError("Please select your gender.");
        setLoading(false);
        return;
      }
      if (!formData.agreeToTerms) {
        setError("You must agree to the Terms and Conditions to continue.");
        setLoading(false);
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
        setLoading(false);
        return;
      }
      setLoading(false);
    }
  };
  // Timer for resend code
  useState(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);
  const handleResendCode = async () => {
    try {
      await resendVerificationCode({ newTempToken });
      setResendTimer(60);
      setError("");
    } catch (error) {
      setError(error);
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
                    disabled={loading}
                  />
                  {error && (
                    <div className="text-red-500 text-sm mt-1">{error}</div>
                  )}
                  <button
                    type="submit"
                    className={`w-full bg-[#6C4BF4] text-white py-4 px-4 rounded-md font-semibold transition-colors font-poppins text-lg mb-2 ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-purple-700'}`}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Next'}
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
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={signInWithGoogle}
                      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={loading}
                    >
                      <FcGoogle className="w-5 h-5 mr-2" />
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
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      tabIndex={-1}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      disabled={loading}
                    >
                      {showPassword ? (
                        <IoEyeOff className="h-5 w-5" />
                      ) : (
                        <IoEye className="h-5 w-5" />
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
                            {passed ? (
                              <IoCheckmark className="w-5 h-5 mr-2 text-green-500" />
                            ) : (
                              <IoClose className="w-5 h-5 mr-2 text-gray-400" />
                            )}
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
                      disabled={loading}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className={`bg-[#6C4BF4] text-white py-3 px-6 rounded-md font-semibold transition-colors font-poppins ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-purple-700'}`}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Next'}
                    </button>
                  </div>
                </>
              )}
              {/* Step 3: Verification Code */}
              {step === 2 && (
                <>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Enter the 6-digit code sent to your email
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] focus:border-transparent font-poppins text-lg tracking-widest text-center"
                    placeholder="------"
                    disabled={loading}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-[#6C4BF4] font-medium"
                      disabled={loading}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className={`bg-[#6C4BF4] text-white py-3 px-6 rounded-md font-semibold transition-colors font-poppins ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-purple-700'}`}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Verify'}
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                      Didn't receive the code?
                    </span>
                    <button
                      type="button"
                      className="text-[#6C4BF4] font-medium disabled:text-gray-400"
                      onClick={handleResendCode}
                      disabled={resendTimer > 0 || loading}
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                    </button>
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm mt-2">{error}</div>
                  )}
                </>
              )}

              {/* Step 4: First Name, Last Name, Date of Birth, Gender, Terms (Combined) */}
              {step === 3 && (
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
                      disabled={loading}
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
                      disabled={loading}
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
                    disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className={`bg-[#6C4BF4] text-white py-3 px-6 rounded-md font-semibold transition-colors font-poppins ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-purple-700'}`}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Sign Up'}
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
