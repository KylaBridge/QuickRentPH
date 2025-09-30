import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import ResetPasswordHeader from "../components/ResetPasswordHeader";
import { AuthContext } from "../context/authContext";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { loginUser } = useContext(AuthContext);
  const [step, setStep] = useState(1); // 1: email, 2: otp
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const timerRef = useRef(null);

  // Email format validation
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Use loginUser to check if email exists (simulate by passing wrong password)
  const checkEmailExists = async (email) => {
    try {
      await loginUser(email, "wrongpassword");
      // If loginUser does not throw 'Email is not registered', email exists
      return true;
    } catch (err) {
      if (err === "Email is not registered") {
        return false;
      }
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    const exists = await checkEmailExists(email);
    setLoading(false);
    if (!exists) {
      setError("Email is not registered.");
      return;
    }
    // Simulate sending OTP
    setStep(2);
    setResendCooldown(45);
    timerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = () => {
    setResendCooldown(45);
    // Simulate resend OTP
    timerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOtp = () => {
    // Simulate OTP verification and redirect
    navigate("/reset-password/new");
  };

  // OTP input as 6 separate boxes
  const [otpArr, setOtpArr] = useState(["", "", "", "", "", ""]);
  const otpInputs = useRef([]);
  const handleOtpChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newArr = [...otpArr];
    newArr[idx] = val;
    setOtpArr(newArr);
    if (val && idx < 5) {
      otpInputs.current[idx + 1].focus();
    }
  };
  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otpArr[idx] && idx > 0) {
      otpInputs.current[idx - 1].focus();
    }
  };

  // Header and title for each step
  const headerTitle = step === 2 ? "Enter Verification Code" : "Reset Password";
  const cardTitle = step === 2 ? "Enter Verification Code" : "Reset Password";

  return (
    <div className="min-h-screen bg-gray-50">
      <ResetPasswordHeader title={headerTitle} />
      <div
        className="flex items-center justify-center w-full h-full px-4"
        style={{ minHeight: "calc(100vh - 72px)" }}
      >
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
          <button
            type="button"
            onClick={() => (step === 1 ? navigate(-1) : setStep(1))}
            className="mb-4 text-[#6C4BF4] text-2xl focus:outline-none"
            aria-label="Go back"
          >
            <IoChevronBack className="h-6 w-6" />
          </button>
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
            {cardTitle}
          </h2>
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] focus:border-transparent"
              />
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <button
                type="submit"
                className="w-full bg-[#6C4BF4] text-white py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors"
                disabled={loading}
              >
                {loading ? "Checking..." : "NEXT"}
              </button>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="text-center text-gray-700 mb-2">
                Your verification code is sent via Email to
                <br />
                <span className="font-bold text-lg text-gray-900">{email}</span>
              </div>
              <div className="flex justify-center gap-3 mb-4">
                {otpArr.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-10 h-12 text-center text-xl border-b-2 border-gray-300 focus:border-[#6C4BF4] focus:outline-none"
                  />
                ))}
              </div>
              <div className="text-center text-gray-400 mb-4 text-sm">
                {resendCooldown > 0 ? (
                  `Please wait ${resendCooldown} seconds to resend.`
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-[#6C4BF4] font-medium"
                  >
                    Resend
                  </button>
                )}
              </div>
              <button
                type="button"
                className="w-full bg-[#6C4BF4] text-white py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors"
                onClick={handleVerifyOtp}
              >
                NEXT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
