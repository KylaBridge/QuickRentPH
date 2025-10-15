import { useState } from "react";
import {
  IoClose,
  IoCloudUpload,
  IoCheckmark,
  IoWarning,
  IoDocument,
  IoCamera,
} from "react-icons/io5";

const ID_TYPES = [
  { value: "national_id", label: "National ID" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "passport", label: "Passport" },
  { value: "umid", label: "UMID" },
  { value: "postal_id", label: "Postal ID" },
  { value: "voters_id", label: "Voter's ID" },
];

const AccountVerificationModal = ({
  isOpen,
  onClose,
  onComplete,
  isLoading,
  user = null,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    idType: "",
    idFrontImage: null,
    idBackImage: null,
    selfieImage: null,
    phoneNumber: user?.mobileNumber || user?.phone || "", // Pre-filled from user profile
    phoneOtp: "",
    emailVerified: false,
  });

  const [uploadProgress, setUploadProgress] = useState({
    idFront: 0,
    idBack: 0,
    selfie: 0,
  });

  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  if (!isOpen) return null;

  const handleImageUpload = (type, file) => {
    if (!file) return;

    // Simulate upload progress
    setUploadProgress((prev) => ({ ...prev, [type]: 0 }));

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev[type] + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setFormData((prevData) => ({
            ...prevData,
            [`${type}Image`]: file,
          }));
          return { ...prev, [type]: 100 };
        }
        return { ...prev, [type]: newProgress };
      });
    }, 100);
  };

  const handleSendOtp = async () => {
    setOtpSent(true);
    // Simulate OTP sending
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleSendEmailVerification = async () => {
    setEmailVerificationSent(true);
    // Simulate email verification sending
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.idType) newErrors.idType = "Please select an ID type";
        break;
      case 2:
        if (!formData.idFrontImage)
          newErrors.idFront = "Please upload front of ID";
        if (formData.idType !== "passport" && !formData.idBackImage) {
          newErrors.idBack = "Please upload back of ID";
        }
        break;
      case 3:
        // Selfie is optional but recommended
        break;
      case 4:
        if (!formData.phoneOtp || formData.phoneOtp.length !== 6) {
          newErrors.phoneOtp = "Please enter valid 6-digit OTP";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleComplete = () => {
    const verificationData = {
      ...formData,
      completedAt: new Date().toISOString(),
    };
    onComplete(verificationData);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step < currentStep
                ? "bg-green-500 text-white"
                : step === currentStep
                ? "bg-[#6C4BF4] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step < currentStep ? <IoCheckmark className="w-4 h-4" /> : step}
          </div>
          {step < 5 && (
            <div
              className={`w-8 h-0.5 mx-2 ${
                step < currentStep ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderImageUpload = (type, label, required = true) => {
    const imageKey = `${type}Image`;
    const progress = uploadProgress[type];
    const hasImage = formData[imageKey];
    const error = errors[type];

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            error
              ? "border-red-300 bg-red-50"
              : hasImage
              ? "border-green-300 bg-green-50"
              : "border-gray-300 hover:border-[#6C4BF4] hover:bg-gray-50"
          }`}
          onClick={() => document.getElementById(`upload-${type}`).click()}
        >
          <input
            id={`upload-${type}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageUpload(type, e.target.files[0])}
          />

          {progress > 0 && progress < 100 ? (
            <div className="space-y-2">
              <IoCloudUpload className="w-8 h-8 mx-auto text-[#6C4BF4]" />
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#6C4BF4] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">Uploading... {progress}%</p>
            </div>
          ) : hasImage ? (
            <div className="space-y-2">
              <IoCheckmark className="w-8 h-8 mx-auto text-green-500" />
              <p className="text-sm text-green-600 font-medium">
                Image uploaded successfully
              </p>
              <p className="text-xs text-gray-500">{hasImage.name}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <IoCloudUpload className="w-8 h-8 mx-auto text-gray-400" />
              <p className="text-sm text-gray-600">Click to upload image</p>
              <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
            </div>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <IoWarning className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <IoDocument className="w-12 h-12 mx-auto text-[#6C4BF4] mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select ID Type
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Choose the type of government-issued ID you want to upload
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                ID Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.idType}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, idType: e.target.value }))
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] ${
                  errors.idType ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Select an ID type</option>
                {ID_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.idType && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <IoWarning className="w-3 h-3" />
                  {errors.idType}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <IoCamera className="w-12 h-12 mx-auto text-[#6C4BF4] mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload ID Images
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Please upload clear photos of your{" "}
                {ID_TYPES.find((t) => t.value === formData.idType)?.label}
              </p>
            </div>

            {renderImageUpload("idFront", "Front of ID")}
            {formData.idType !== "passport" &&
              renderImageUpload("idBack", "Back of ID")}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <IoCamera className="w-12 h-12 mx-auto text-[#6C4BF4] mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Take a Selfie (Optional)
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Take a selfie while holding your ID to verify your identity
              </p>
            </div>

            {renderImageUpload("selfie", "Selfie with ID", false)}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Phone Verification
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                We'll send a verification code to your phone number
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Verification Code <span className="text-red-500">*</span>
                  </label>
                  {!otpSent ? (
                    <button
                      onClick={handleSendOtp}
                      className="text-[#6C4BF4] text-sm font-medium hover:underline"
                    >
                      Send OTP
                    </button>
                  ) : (
                    <span className="text-green-600 text-sm">OTP Sent ✓</span>
                  )}
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.phoneOtp}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phoneOtp: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  placeholder="Enter 6-digit code"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] ${
                    errors.phoneOtp ? "border-red-300" : "border-gray-300"
                  }`}
                  disabled={!otpSent}
                />
                {errors.phoneOtp && (
                  <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                    <IoWarning className="w-3 h-3" />
                    {errors.phoneOtp}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email Verification
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                We'll send a verification link to your email address
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    user@example.com
                  </p>
                  <p className="text-xs text-blue-700">
                    {emailVerificationSent
                      ? "Verification email sent!"
                      : "Click to send verification email"}
                  </p>
                </div>
                {!emailVerificationSent ? (
                  <button
                    onClick={handleSendEmailVerification}
                    className="bg-[#6C4BF4] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#7857FD]"
                  >
                    Send Email
                  </button>
                ) : (
                  <IoCheckmark className="w-6 h-6 text-green-500" />
                )}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-900 mb-2">
                Verification Summary
              </h4>
              <div className="space-y-1 text-sm text-green-700">
                <div className="flex items-center gap-2">
                  <IoCheckmark className="w-4 h-4" />
                  ID Type:{" "}
                  {ID_TYPES.find((t) => t.value === formData.idType)?.label}
                </div>
                <div className="flex items-center gap-2">
                  <IoCheckmark className="w-4 h-4" />
                  ID Images: Uploaded
                </div>
                {formData.selfieImage && (
                  <div className="flex items-center gap-2">
                    <IoCheckmark className="w-4 h-4" />
                    Selfie: Uploaded
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <IoCheckmark className="w-4 h-4" />
                  Phone: Verified
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Account Verification
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderStepIndicator()}
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={() =>
              currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()
            }
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            disabled={isLoading}
          >
            {currentStep > 1 ? "Back" : "Cancel"}
          </button>

          <button
            onClick={handleNext}
            disabled={isLoading}
            className="bg-[#6C4BF4] text-white px-6 py-2 rounded-md font-medium hover:bg-[#7857FD] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : currentStep === 5 ? (
              "Complete Verification"
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountVerificationModal;
