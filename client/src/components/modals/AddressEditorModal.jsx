import { useState } from "react";
import {
  IoClose,
  IoLocationOutline,
  IoPersonOutline,
  IoCallOutline,
  IoWarning,
  IoCheckmark,
} from "react-icons/io5";

const AddressEditorModal = ({
  isOpen,
  onClose,
  onSave,
  addressForm,
  setAddressForm,
  isLoading,
}) => {
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!addressForm.label || addressForm.label.trim() === "") {
      newErrors.label = "Address label is required";
    }

    if (!addressForm.fullAddress || addressForm.fullAddress.trim() === "") {
      newErrors.fullAddress = "Full address is required";
    }

    if (!addressForm.recipientName || addressForm.recipientName.trim() === "") {
      newErrors.recipientName = "Recipient name is required";
    }

    if (
      !addressForm.recipientPhone ||
      addressForm.recipientPhone.trim() === ""
    ) {
      newErrors.recipientPhone = "Phone number is required";
    } else {
      // Basic phone validation for Philippine numbers
      const phoneRegex = /^(\+63|0)?9\d{9}$/;
      const cleanPhone = addressForm.recipientPhone.replace(/[\s-]/g, "");
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.recipientPhone =
          "Please enter a valid Philippine mobile number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const formattedPhone = formatPhoneNumber(addressForm.recipientPhone);
      onSave({
        ...addressForm,
        recipientPhone: formattedPhone,
      });
    }
  };

  const formatPhoneNumber = (phone) => {
    // Remove all non-digits
    const cleanPhone = phone.replace(/\D/g, "");

    // Format to +63XXXXXXXXXX
    if (cleanPhone.startsWith("63")) {
      return "+" + cleanPhone;
    } else if (cleanPhone.startsWith("09")) {
      return "+63" + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith("9") && cleanPhone.length === 10) {
      return "+63" + cleanPhone;
    }

    return phone; // Return original if can't format
  };

  const handlePhoneChange = (value) => {
    // Allow only numbers, spaces, dashes, and + symbol
    const cleanValue = value.replace(/[^\d\s+\-]/g, "");
    setAddressForm((prev) => ({ ...prev, recipientPhone: cleanValue }));
  };

  const LABEL_SUGGESTIONS = [
    "Home",
    "Work",
    "School",
    "Parent's House",
    "Office",
    "Apartment",
    "Dormitory",
  ];

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
            {addressForm.id ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Address Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={addressForm.label}
              onChange={(e) =>
                setAddressForm((prev) => ({ ...prev, label: e.target.value }))
              }
              placeholder="e.g., Home, Work, School"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] ${
                errors.label ? "border-red-300" : "border-gray-300"
              }`}
            />

            {/* Label Suggestions */}
            <div className="mt-2 flex flex-wrap gap-2">
              {LABEL_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() =>
                    setAddressForm((prev) => ({ ...prev, label: suggestion }))
                  }
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {errors.label && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <IoWarning className="w-3 h-3" />
                {errors.label}
              </p>
            )}
          </div>

          {/* Full Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <IoLocationOutline className="w-4 h-4 inline mr-1" />
              Full Address <span className="text-red-500">*</span>
            </label>
            <textarea
              value={addressForm.fullAddress}
              onChange={(e) =>
                setAddressForm((prev) => ({
                  ...prev,
                  fullAddress: e.target.value,
                }))
              }
              placeholder="Enter complete address including street, barangay, city, province, and postal code"
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] resize-none ${
                errors.fullAddress ? "border-red-300" : "border-gray-300"
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: 123 Main St, Barangay San Antonio, Quezon City, Metro
              Manila 1101
            </p>
            {errors.fullAddress && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <IoWarning className="w-3 h-3" />
                {errors.fullAddress}
              </p>
            )}
          </div>

          {/* Recipient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recipient Information
            </h3>

            {/* Recipient Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <IoPersonOutline className="w-4 h-4 inline mr-1" />
                Recipient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={addressForm.recipientName}
                onChange={(e) =>
                  setAddressForm((prev) => ({
                    ...prev,
                    recipientName: e.target.value,
                  }))
                }
                placeholder="Full name of person receiving the item"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] ${
                  errors.recipientName ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.recipientName && (
                <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                  <IoWarning className="w-3 h-3" />
                  {errors.recipientName}
                </p>
              )}
            </div>

            {/* Recipient Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <IoCallOutline className="w-4 h-4 inline mr-1" />
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={addressForm.recipientPhone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="+639XXXXXXXXX or 09XXXXXXXXX"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] ${
                  errors.recipientPhone ? "border-red-300" : "border-gray-300"
                }`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Philippine mobile number format
              </p>
              {errors.recipientPhone && (
                <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                  <IoWarning className="w-3 h-3" />
                  {errors.recipientPhone}
                </p>
              )}
            </div>
          </div>

          {/* Set as Default */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <button
              onClick={() =>
                setAddressForm((prev) => ({
                  ...prev,
                  isDefault: !prev.isDefault,
                }))
              }
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                addressForm.isDefault
                  ? "bg-[#6C4BF4] border-[#6C4BF4] text-white"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {addressForm.isDefault && <IoCheckmark className="w-3 h-3" />}
            </button>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Set as default address
              </p>
              <p className="text-xs text-gray-600">
                This address will be pre-selected for future deliveries
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            disabled={isLoading}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-[#6C4BF4] text-white px-6 py-2 rounded-md font-medium hover:bg-[#7857FD] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Address"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressEditorModal;
