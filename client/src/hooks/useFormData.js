import { useState, useEffect } from "react";

/**
 * FORM DATA HOOK - Manages Form State and Change Detection
 * This custom hook handles all form-related state management for the AddItem component.
 * It provides form data, change detection for edit mode, and field update handlers.
 */

export const useFormData = (editingItem = null) => {
  const isEditMode = !!editingItem;

  // Default form structure to ensure all fields are always defined
  const defaultFormData = {
    name: "",
    category: "",
    price: "0.00",
    dealOption: "",
    location: "",
    size: "",
    color: "",
    description: "",
    includedAccessories: "",
    downpayment: "",
    downpaymentPercentage: "", // For storing percentage display value
    pickupLocation: "",
    deliveryOption: "",
    customTerms: "",
  };

  const [formData, setFormData] = useState(defaultFormData);

  const [originalData, setOriginalData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data when editing an item
  useEffect(() => {
    if (editingItem) {
      // Calculate percentage from existing downpayment and price
      const existingDownpayment = parseFloat(editingItem.downpayment) || 0;
      const existingPrice = parseFloat(editingItem.price) || 0;
      const percentage = existingPrice > 0 ? Math.round((existingDownpayment / existingPrice) * 100) : 0;
      
      const formDataObj = {
        ...defaultFormData, // Start with defaults
        name: editingItem.name || "",
        category: editingItem.category || "",
        price: (editingItem.price?.toString() || "0.00"),
        dealOption: editingItem.dealOption || "",
        location: editingItem.location || "",
        size: editingItem.size || "",
        color: editingItem.color || "",
        description: editingItem.description || "",
        includedAccessories: editingItem.includedAccessories || "",
        downpayment: (editingItem.downpayment?.toString() || ""),
        downpaymentPercentage: percentage.toString(),
        pickupLocation: editingItem.pickupLocation || "",
        deliveryOption: editingItem.deliveryOption || "",
        customTerms: editingItem.customTerms || "",
      };

      setFormData(formDataObj);
      setOriginalData(formDataObj);
      setHasChanges(false);
    } else {
      // Reset form for new item creation - use default structure
      setFormData({ ...defaultFormData });
      setOriginalData(null);
      setHasChanges(false);
    }
  }, [editingItem]);

  // Detect changes in form data
  useEffect(() => {
    if (!isEditMode || !originalData) {
      setHasChanges(false);
      return;
    }

    const formDataChanged = Object.keys(originalData).some(
      (key) => originalData[key] !== formData[key]
    );

    setHasChanges(formDataChanged);
  }, [formData, originalData, isEditMode]);

  // Generic form field handler with safety check
  const handleFieldChange = (field, value) => {
    // Ensure value is never undefined - convert to empty string if needed
    const safeValue = value === undefined || value === null ? "" : value;
    setFormData((prev) => ({ ...prev, [field]: safeValue }));
  };

  // Validate price input formatting
  const validatePriceInput = () => {
    const price = parseFloat(formData.price);
    if (!isNaN(price)) {
      setFormData((prev) => ({ ...prev, price: price.toFixed(2) }));
    }
  };

  const handlePriceChange = (e) => {
    handleFieldChange("price", e.target.value);
  };

  // Expose setFormData for complex updates (like downpayment calculation)
  const updateFormData = (updater) => {
    setFormData(updater);
  };

  return {
    formData,
    originalData,
    hasChanges,
    isEditMode,
    handleFieldChange,
    handlePriceChange,
    validatePriceInput,
    updateFormData,
  };
};
