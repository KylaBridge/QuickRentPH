import React, { useRef, useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import { CATEGORIES, DEAL_OPTIONS } from "../../constants/categories";
import { useFormData } from "../../hooks/useFormData";
import { useImageManagement } from "../../hooks/useImageManagement";
import { usePaymentMethods } from "../../hooks/usePaymentMethods";
import {
  validateForm,
  buildItemData,
  handleDownpaymentChange,
  calculateDownpaymentPercentage,
} from "../../utils/formUtils";
import {
  getSizePlaceholder,
  DEFAULT_TERMS,
} from "../../utils/placeholderUtils";
import gcashLogo from "../../assets/GCash-Logo.png";
import paymayaLogo from "../../assets/paymaya-logo.png";

const MIN_BOX_WIDTH = 160; // px
const BOX_GAP = 16; // px (gap-4)
const UPLOAD_BOX_WIDTH = 160; // px

const AddItem = ({ onClose, onSuccess, editingItem = null }) => {
  const { addItem, updateItem } = useContext(UserContext);

  // Use custom hooks for state management
  const {
    formData,
    hasChanges: hasFormChanges,
    isEditMode,
    handleFieldChange,
    handlePriceChange,
    validatePriceInput,
  } = useFormData(editingItem);

  const imageManagement = useImageManagement(editingItem);
  const {
    containerRef,
    fileInputRef,
    images,
    hasImageChanges,
    fileErrors,
    page,
    maxVisible,
    visibleImages,
    placeholders,
    totalPages,
    canNext,
    canPrev,
    startIdx,
    hoverIdx,
    handleFiles,
    handleDrop,
    handleDragOver,
    handleRemove,
    handleReplace,
    setPage,
    setHoverIdx,
    replaceInputRefs,
  } = imageManagement;

  const {
    paymentMethods,
    hasPaymentChanges,
    togglePaymentMethod,
    getSelectedPaymentMethods,
  } = usePaymentMethods(editingItem);

  // Local state for UI
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Calculate total changes
  const hasChanges = hasFormChanges || hasImageChanges || hasPaymentChanges;

  // Helper function for downpayment input using utility
  const handleDownpaymentInputChange = (e) => {
    handleDownpaymentChange(e, formData.price, (updatedFormData) => {
      handleFieldChange("downpayment", updatedFormData.downpayment);
    });
  };

  // Calculate derived values
  const downpaymentPercentage = calculateDownpaymentPercentage(
    formData.downpayment,
    formData.price
  );
  const sizePlaceholder = getSizePlaceholder(formData.category);

  // Form submission handler
  const handleCreate = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMsg("");

    const validationErrors = validateForm(formData, paymentMethods, images);
    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const itemData = buildItemData(
        formData,
        paymentMethods,
        images,
        isEditMode
      );

      if (isEditMode) {
        await updateItem(editingItem._id, itemData);
        setSuccessMsg("Item updated successfully.");
      } else {
        await addItem(itemData);
        setSuccessMsg("Item created successfully.");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const msg =
        typeof err === "string"
          ? err
          : `Failed to ${isEditMode ? "update" : "create"} item`;
      setErrors([msg]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleCreate}
      noValidate
      className="w-full mx-auto relative px-2 sm:px-4 flex-1 min-h-0"
    >
      {/* Feedback Messages */}
      {errors.length > 0 && (
        <div className="mb-2 bg-red-50 border border-red-200 text-red-700 rounded p-2 text-xs">
          <ul className="list-disc pl-4 space-y-0.5">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      {fileErrors.length > 0 && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-500 mt-0.5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-red-800 font-medium text-sm">Upload Failed:</p>
              <ul className="text-red-700 text-xs mt-1 space-y-1">
                {fileErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {successMsg && (
        <div className="mb-2 bg-green-50 border border-green-200 text-green-700 rounded p-2 text-xs">
          {successMsg}
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-center mb-2">
        {/* Cancel Button */}
        <button
          type="button"
          className="text-[#6C4BF4] hover:underline text-base font-semibold"
          onClick={onClose}
        >
          &lt; Cancel
        </button>

        {/* Save/Create Button */}
        <div className="flex items-center gap-6">
          <button
            type="submit"
            disabled={isSubmitting || (isEditMode && !hasChanges)}
            className={`bg-[#6C4BF4] hover:bg-[#7857FD] text-white font-bold rounded-lg px-7 py-2 text-m shadow disabled:opacity-60 disabled:cursor-not-allowed ${
              isEditMode && !hasChanges ? "hover:bg-[#6C4BF4]" : ""
            }`}
            title={isEditMode && !hasChanges ? "No changes to save" : ""}
          >
            {isSubmitting
              ? isEditMode
                ? "Saving..."
                : "Creating..."
              : isEditMode && !hasChanges
              ? "No Changes"
              : isEditMode
              ? "Save"
              : "Create"}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Side: Product Media and Details */}
        <div className="flex flex-col gap-4 flex-[1.3] min-w-0">
          {/* Product Media (responsive card) */}
          <div className="bg-white rounded-xl shadow p-4 min-h-[180px]">
            {/* Product Media */}
            <label className="font-semibold mb-2 block text-sm">
              Product Media
            </label>
            <div
              className="flex gap-4 items-center"
              ref={containerRef}
              style={{ minWidth: 0 }}
            >
              {/* Upload Box */}
              <div
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg"
                style={{
                  width: MIN_BOX_WIDTH,
                  height: MIN_BOX_WIDTH,
                  minWidth: MIN_BOX_WIDTH,
                }}
                onClick={() => fileInputRef.current.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files) handleFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
                <svg
                  className="w-10 h-10 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-5 4h.01"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 16v4m0 0H8m4 0h4"
                  />
                </svg>
                <span className="text-xs text-center">
                  <span className="text-[#6C4BF4] font-semibold cursor-pointer">
                    Click to Upload
                  </span>{" "}
                  or drag and drop <span className="text-[#ff0000]">*</span>
                  <br />
                  <span className="text-gray-500 text-xs">
                    Max 2MB per image
                  </span>
                </span>
              </div>

              {/* Images/Placeholders */}
              <div className="flex gap-3 items-center min-h-[160px]">
                {/* Previous Arrow */}
                {canPrev && (
                  <button
                    type="button"
                    className="mr-1 text-2xl text-gray-400 hover:text-[#6C4BF4] px-1"
                    onClick={() => setPage(page - 1)}
                  >
                    &lt;
                  </button>
                )}
                {/* Images */}
                {visibleImages.map((img, idx) => (
                  <div
                    key={startIdx + idx}
                    className="relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center transition-all duration-200"
                    style={{
                      width: MIN_BOX_WIDTH,
                      height: MIN_BOX_WIDTH,
                      minWidth: MIN_BOX_WIDTH,
                    }}
                    onMouseEnter={() => setHoverIdx(startIdx + idx)}
                    onMouseLeave={() => setHoverIdx(null)}
                  >
                    <img
                      src={img.url}
                      alt="preview"
                      className="object-cover w-full h-full"
                    />
                    {/* Overlay on hover */}
                    {hoverIdx === startIdx + idx && (
                      <div className="absolute inset-0 bg-gray-900/40 flex flex-col items-center justify-center gap-2 transition">
                        <button
                          type="button"
                          className="bg-white text-gray-800 px-3 py-1 rounded font-semibold mb-1 text-xs shadow"
                          onClick={() => replaceInputRefs.current[idx].click()}
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          className="bg-white text-red-600 px-3 py-1 rounded font-semibold text-xs shadow"
                          onClick={() => handleRemove(startIdx + idx)}
                        >
                          Remove
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={(el) => (replaceInputRefs.current[idx] = el)}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleReplace(startIdx + idx, file);
                            e.target.value = "";
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
                {/* Placeholders if no images */}
                {images.length === 0 &&
                  placeholders.map((_, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg bg-gray-100 border border-gray-200"
                      style={{
                        width: MIN_BOX_WIDTH,
                        height: MIN_BOX_WIDTH,
                        minWidth: MIN_BOX_WIDTH,
                      }}
                    ></div>
                  ))}
                {/* Placeholders if some images */}
                {images.length > 0 &&
                  placeholders.map((_, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg bg-gray-100 border border-gray-200"
                      style={{
                        width: MIN_BOX_WIDTH,
                        height: MIN_BOX_WIDTH,
                        minWidth: MIN_BOX_WIDTH,
                      }}
                    ></div>
                  ))}
                {/* Next Arrow */}
                {canNext && (
                  <button
                    type="button"
                    className="ml-1 text-2xl text-gray-400 hover:text-[#6C4BF4] px-1"
                    onClick={() => setPage(page + 1)}
                  >
                    &gt;
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Product Specification & Included Accessories*/}
          <div className="flex gap-4">
            <div className="bg-white rounded-xl shadow p-4 flex-1 min-h-[110px]">
              <label className="font-semibold mb-2 text-sm block">
                Product Specification
              </label>

              <label className="block text-xs font-medium mb-1">
                Size/Dimensions <span className="text-red-600">*</span>
              </label>
              <input
                className="mb-1 border border-gray-200 rounded px-3 py-1 text-xs w-full"
                placeholder={sizePlaceholder}
                value={formData.size}
                onChange={(e) => handleFieldChange("size", e.target.value)}
              />
              <label className="block text-xs font-medium mb-1">
                Color <span className="text-red-600">*</span>
              </label>
              <input
                className="mb-1 border border-gray-200 rounded px-3 py-1 text-xs w-full"
                placeholder="e.g. Black"
                value={formData.color}
                onChange={(e) => handleFieldChange("color", e.target.value)}
              />
              <label className="block text-xs font-medium mb-1">
                General Description <span className="text-red-600">*</span>
              </label>
              <textarea
                className="border border-gray-200 rounded px-3 py-1 text-xs w-full"
                rows={4}
                placeholder="Include important details such as material, features, and any special conditions."
                value={formData.description}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
              />
            </div>
            <div className="bg-white rounded-xl shadow p-4 flex-1 min-h-[110px]">
              <label className="font-semibold mb-2 block text-sm">
                Included Accessories
              </label>
              <textarea
                className="border border-gray-200 rounded px-3 py-1 text-xs w-full"
                rows={12}
                placeholder="List down item accessories included if applicable."
                value={formData.includedAccessories}
                onChange={(e) =>
                  handleFieldChange("includedAccessories", e.target.value)
                }
              />
            </div>
          </div>

          {/* Booking Details (full width under the two cards above) */}
          <div className="bg-white rounded-xl shadow p-4 min-h-[90px]">
            <label className="font-semibold mb-2 block text-sm">
              Booking Details
            </label>
            {/* Row 1 */}
            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">
                  Downpayment required (%){" "}
                  <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.]?[0-9]*"
                    className="w-full border border-gray-200 rounded pl-3 pr-7 py-1 text-xs placeholder-gray-400"
                    placeholder="e.g. 50"
                    value={formData.downpayment}
                    onChange={handleDownpaymentInputChange}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-gray-500">
                    %
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">
                  Pickup Location <span className="text-red-600">*</span>
                </label>
                <input
                  className="w-full border border-gray-200 rounded px-3 py-1 text-xs"
                  placeholder="e.g. Sampaloc, Metro Manila"
                  value={formData.pickupLocation}
                  onChange={(e) =>
                    handleFieldChange("pickupLocation", e.target.value)
                  }
                />
              </div>
            </div>
            {/* Row 2 */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">
                  Payment Methods <span className="text-red-600">*</span>
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* GCash */}
                  <label className="inline-flex items-center gap-2 px-2 py-1 bg-white rounded-md border border-gray-300 shadow-sm cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={paymentMethods.gcash}
                      onChange={() => togglePaymentMethod("gcash")}
                    />
                    <span
                      className={`w-3 h-3 rounded-sm border ${
                        paymentMethods.gcash
                          ? "bg-[#6C4BF4] border-[#6C4BF4]"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    <img src={gcashLogo} alt="GCash" className="h-5" />
                  </label>

                  {/* PayMaya */}
                  <label className="inline-flex items-center gap-2 px-2 py-1 bg-white rounded-md border border-gray-300 shadow-sm cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={paymentMethods.paymaya}
                      onChange={() => togglePaymentMethod("paymaya")}
                    />
                    <span
                      className={`w-3 h-3 rounded-sm border ${
                        paymentMethods.paymaya
                          ? "bg-[#6C4BF4] border-[#6C4BF4]"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    <img src={paymayaLogo} alt="PayMaya" className="h-5" />
                  </label>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">
                  Delivery Options <span className="text-red-600">*</span>
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs bg-white focus:border-black focus:ring-1 focus:ring-black"
                  value={formData.deliveryOption}
                  onChange={(e) =>
                    handleFieldChange("deliveryOption", e.target.value)
                  }
                >
                  <option value="" disabled>
                    Select delivery option
                  </option>
                  {DEAL_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Basic Info and Terms */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          {/* Basic Information (shorter card) */}
          <div className="bg-white rounded-2xl shadow p-4">
            {/* Section Title */}
            <h2 className="text-sm font-semibold mb-1">Basic Information</h2>

            {/* Product Name */}
            <label className="block text-xs font-medium mb-1">
              Product Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. iPhone 14 Pro Max"
              className="mb-2 w-full rounded-md border border-gray-300 px-3 py-1 text-xs focus:border-black focus:ring-1 focus:ring-black"
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
            />

            {/* Item Category */}
            <label className="block text-xs font-medium mb-1">
              Item Category <span className="text-red-600">*</span>
            </label>
            <select
              className="mb-2 w-full rounded-md border border-gray-300 px-3 py-1 text-xs bg-white focus:border-black focus:ring-1 focus:ring-black"
              value={formData.category}
              onChange={(e) => handleFieldChange("category", e.target.value)}
            >
              <option value="" disabled>
                Select a category
              </option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Item Price & Deal Option */}
            <div className="flex gap-4 mb-2">
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">
                  Item Price <span className="text-red-600">*</span>
                </label>
                <div className="flex items-center rounded-md border border-gray-300 px-2">
                  <span className="text-gray-500">₱</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.price}
                    placeholder="0.00"
                    className="w-full border-0 px-2 py-1 text-xs focus:ring-0 focus:outline-none"
                    onChange={handlePriceChange}
                    onBlur={validatePriceInput}
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">
                  Deal Option <span className="text-red-600">*</span>
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-1 text-xs bg-white focus:border-black focus:ring-1 focus:ring-black"
                  value={formData.dealOption}
                  onChange={(e) =>
                    handleFieldChange("dealOption", e.target.value)
                  }
                >
                  <option value="" disabled>
                    Select deal option
                  </option>
                  {DEAL_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <label className="block text-sm font-medium mb-1">
              Location <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Quezon City, Metro Manila"
              className="w-full rounded-md border border-gray-300 px-3 py-1 text-xs focus:border-black focus:ring-1 focus:ring-black"
              value={formData.location}
              onChange={(e) => handleFieldChange("location", e.target.value)}
            />
          </div>

          {/* Terms and Conditions */}
          <div className="bg-white rounded-xl shadow p-4">
            <label className="font-semibold mb-2 block text-sm">
              Terms and Conditions
            </label>
            <div className="text-xs text-gray-700 mb-2">
              <div className="font-semibold">
                Default Rules (system-generated)
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {DEFAULT_TERMS.map((term, index) => (
                  <li key={index}>
                    {term.label ? (
                      <>
                        <span className="font-bold">{term.label}:</span>{" "}
                        {term.value}
                      </>
                    ) : (
                      term
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <textarea
              className="border border-gray-200 rounded px-3 py-2 text-xs w-full"
              rows={6}
              placeholder="Custom Rules"
              value={formData.customTerms}
              onChange={(e) => handleFieldChange("customTerms", e.target.value)}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddItem;
