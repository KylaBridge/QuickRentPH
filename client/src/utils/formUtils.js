/**
 * FORM UTILS - Business Logic for Form Operations
 *
 * This file contains all the business logic related to form validation,
 * data transformation, and form processing for the AddItem component.
 */
export const validateForm = (formData, paymentMethods, images) => {
  const errors = [];

  if (!formData.name.trim()) errors.push("Product Name is required");
  if (!formData.category) errors.push("Category is required");
  if (!formData.price || parseFloat(formData.price) <= 0)
    errors.push("Price must be greater than 0");
  if (!formData.dealOption) errors.push("Deal Option is required");
  if (!formData.location.trim()) errors.push("Location is required");
  if (!formData.size.trim()) errors.push("Size/Dimensions is required");
  if (!formData.color.trim()) errors.push("Color is required");
  if (!formData.description.trim()) errors.push("Description is required");
  if (!formData.downpayment || isNaN(parseFloat(formData.downpayment)))
    errors.push("Downpayment is required");
  if (!formData.pickupLocation.trim())
    errors.push("Pickup Location is required");
  if (!formData.deliveryOption) errors.push("Delivery Option is required");

  const selectedPayments = Object.entries(paymentMethods)
    .filter(([, v]) => v)
    .map(([k]) => k);
  if (selectedPayments.length === 0)
    errors.push("At least one payment method is required");

  if (images.length === 0) errors.push("At least one image is required");

  return errors;
};

export const buildItemData = (formData, paymentMethods, images, isEditMode) => {
  const selectedPayments = Object.entries(paymentMethods)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join(",");

  const itemData = {
    name: formData.name.trim(),
    category: formData.category,
    price: parseFloat(formData.price),
    dealOption: formData.dealOption,
    location: formData.location.trim(),
    size: formData.size.trim(),
    color: formData.color.trim(),
    description: formData.description.trim(),
    ...(formData.includedAccessories.trim() && {
      includedAccessories: formData.includedAccessories.trim(),
    }),
    downpayment: parseFloat(formData.downpayment),
    pickupLocation: formData.pickupLocation.trim(),
    paymentMethod: selectedPayments,
    deliveryOption: formData.deliveryOption,
    ...(formData.customTerms.trim() && {
      customTerms: formData.customTerms.trim(),
    }),
  };

  // Handle images for both create and edit modes
  if (images.length > 0) {
    if (isEditMode) {
      const existingImages = images
        .filter((img) => img.isExisting)
        .map((img) => {
          if (img.url.includes(`${import.meta.env.VITE_API_URL}/`)) {
            return img.url.replace(`${import.meta.env.VITE_API_URL}/`, "");
          }
          return img.url;
        });
      const newImages = images
        .filter((img) => !img.isExisting && img.file)
        .map((img) => img.file);

      itemData.existingImages = existingImages;
      if (newImages.length > 0) {
        itemData.images = newImages;
      }
    } else {
      itemData.images = images.slice(0, 5).map(({ file }) => file);
    }
  }

  return itemData;
};

//Handles downpayment input with real-time validation and formatting
export const handleDownpaymentChange = (e, price, setFormData) => {
  let value = e.target.value;

  // Remove any non-numeric characters except decimal point
  value = value.replace(/[^0-9.]/g, "");

  // Ensure only one decimal point
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
  }

  // Limit to 2 decimal places
  if (parts[1] && parts[1].length > 2) {
    value = parts[0] + "." + parts[1].substring(0, 2);
  }

  const numericValue = parseFloat(value) || 0;
  const priceValue = parseFloat(price) || 0;

  // If the value is greater than the price, set it to 100% of price
  if (numericValue > priceValue && priceValue > 0) {
    value = priceValue.toFixed(2);
  }

  setFormData((prev) => ({ ...prev, downpayment: value }));
};

//Calculates downpayment as percentage of total price
export const calculateDownpaymentPercentage = (downpayment, price) => {
  const down = parseFloat(downpayment) || 0;
  const priceValue = parseFloat(price) || 0;

  if (priceValue === 0) return 0;
  return Math.round((down / priceValue) * 100);
};
