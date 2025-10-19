import { useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
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
  isLoading: externalLoading = false,
  user = null,
}) => {
  const { verifyAccount } = useContext(UserContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    idType: "",
    idFrontImage: null,
    idBackImage: null,
    selfieImage: null,
  });

  const [uploadProgress, setUploadProgress] = useState({
    idFront: 0,
    idBack: 0,
    selfie: 0,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const verificationData = {
        ...formData,
        completedAt: new Date().toISOString(),
      };
      const user = await verifyAccount(verificationData);
      if (onComplete) onComplete(user);
      onClose();
    } catch (err) {
      setErrors({ submit: err.toString() });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3, 4].map((step) => (
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
          {step < 4 && (
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
            onChange={(e) => handleImageUpload(type, e.target.files[0])}
            className="hidden"
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
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-green-900 mb-2">
                          Verification Summary
                        </h4>
                        <div className="space-y-1 text-sm text-green-700">
                          <div className="flex items-center gap-2">
                            <IoCheckmark className="w-4 h-4" />
                            ID Type: {ID_TYPES.find((t) => t.value === formData.idType)?.label}
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
                        </div>
                      </div>
                    </div>
                  );

      default:
        return null;
    }
  };
  // ...existing code...

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
            disabled={isLoading || externalLoading}
            className="bg-[#6C4BF4] text-white px-6 py-2 rounded-md font-medium hover:bg-[#7857FD] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {(isLoading || externalLoading) ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : currentStep === 4 ? (
              "Complete Verification"
            ) : (
              "Next"
            )}
          </button>
        </div>
        {errors.submit && (
          <div className="text-red-500 text-sm mt-2 text-center">{errors.submit}</div>
        )}
      </div>
    </div>
  );
};

export default AccountVerificationModal;
