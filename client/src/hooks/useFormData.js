import { useState, useEffect } from "react";

/**
 * FORM DATA HOOK - Manages Form State and Change Detection
 * This custom hook handles all form-related state management for the AddItem component.
 * It provides form data, change detection for edit mode, and field update handlers.
 */

export const useFormData = (editingItem = null) => {
  const isEditMode = !!editingItem;

  const [formData, setFormData] = useState({
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
    pickupLocation: "",
    deliveryOption: "",
    customTerms: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data when editing an item
  useEffect(() => {
    if (editingItem) {
      const formDataObj = {
        name: editingItem.name || "",
        category: editingItem.category || "",
        price: editingItem.price?.toString() || "0.00",
        dealOption: editingItem.dealOption || "",
        location: editingItem.location || "",
        size: editingItem.size || "",
        color: editingItem.color || "",
        description: editingItem.description || "",
        includedAccessories: editingItem.includedAccessories || "",
        downpayment: editingItem.downpayment?.toString() || "",
        pickupLocation: editingItem.pickupLocation || "",
        deliveryOption: editingItem.deliveryOption || "",
        customTerms: editingItem.customTerms || "",
      };

      setFormData(formDataObj);
      setOriginalData(formDataObj);
      setHasChanges(false);
    } else {
      // Reset form for new item creation
      const resetData = {
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
        pickupLocation: "",
        deliveryOption: "",
        customTerms: "",
      };
      setFormData(resetData);
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

  // Generic form field handler
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  return {
    formData,
    originalData,
    hasChanges,
    isEditMode,
    handleFieldChange,
    handlePriceChange,
    validatePriceInput,
  };
};
