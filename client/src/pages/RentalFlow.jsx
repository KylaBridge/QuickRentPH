import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  IoArrowBack,
  IoLocationOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoDocumentTextOutline,
  IoCloudUploadOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { AuthContext } from "../context/authContext";
import { useRental } from "../context/rentalContext";
import { getImageUrl } from "../utils/imageUtils";

const RentalFlow = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { createRental } = useRental();

  // Get item from navigation state or set to null if not provided
  const [item, setItem] = useState(location.state?.item || null);
  const [loading, setLoading] = useState(!location.state?.item);
  const [currentStep, setCurrentStep] = useState(1);

  // Form states
  const [formData, setFormData] = useState({
    // Personal Information
    name: user?.firstName + " " + user?.lastName || "",
    phone: user?.mobileNumber || "",
    email: user?.email || "",
    completeAddress: "",
    addressLine1: "",
    city: "",
    stateProvince: "",
    confirmEmail: user?.email || "",

    // Rental Details
    durationOfRent: "1", // Default to 1 day minimum
    preferredStartDate: "",
    reasonForRenting: "",

    // ID Collection Agreement
    idCollectionAgreed: false,

    // File Uploads
    validId: null,
    selfieWithId: null,
    proofOfBilling: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle case where no item data was passed
  useEffect(() => {
    if (!item && !loading) {
      // If no item data was passed through navigation state, redirect back
      console.error("No item data provided");
      navigate("/items-for-rent");
    } else if (item) {
      setLoading(false);
    }
  }, [item, loading, navigate]);

  // Calculate rental cost when dates change
  const calculateCost = () => {
    if (formData.preferredStartDate && formData.durationOfRent && item?.price) {
      const days = parseInt(formData.durationOfRent);
      if (days > 0) {
        const rentalCost = days * parseFloat(item.price);
        const serviceFee = rentalCost * 0.1; // 10% service fee
        const taxes = rentalCost * 0.12; // 12% tax
        const total = rentalCost + serviceFee + taxes;

        return {
          days,
          rentalCost,
          serviceFee,
          taxes,
          total,
        };
      }
    }
    return null;
  };

  const costBreakdown = calculateCost();

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === "durationOfRent") {
      // Ensure minimum value of 1 for duration
      const numValue = parseInt(value) || 1;
      setFormData((prev) => ({
        ...prev,
        [name]: Math.max(1, numValue).toString(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.confirmEmail.trim())
      newErrors.confirmEmail = "Please confirm your email";
    if (formData.email !== formData.confirmEmail)
      newErrors.confirmEmail = "Emails do not match";
    if (!formData.completeAddress.trim())
      newErrors.completeAddress = "Complete address is required";
    if (!formData.durationOfRent.trim())
      newErrors.durationOfRent = "Duration of rent is required";
    if (parseInt(formData.durationOfRent) < 1)
      newErrors.durationOfRent = "Minimum rental duration is 1 day";
    if (!formData.preferredStartDate)
      newErrors.preferredStartDate = "Preferred start date is required";
    if (!formData.reasonForRenting.trim())
      newErrors.reasonForRenting = "Reason for renting is required";

    // ID Collection Agreement
    if (!formData.idCollectionAgreed)
      newErrors.idCollectionAgreed = "You must agree to ID collection";

    // File uploads
    if (!formData.validId) newErrors.validId = "Valid ID is required";
    if (!formData.selfieWithId)
      newErrors.selfieWithId = "Selfie with valid ID is required";
    if (!formData.proofOfBilling)
      newErrors.proofOfBilling = "Proof of billing is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Build multipart form data
      const fd = new FormData();
      fd.append("item", item._id || itemId);
      fd.append("contactName", formData.name);
      fd.append("phone", formData.phone);
      fd.append("email", formData.email);
      fd.append("completeAddress", formData.completeAddress);
      fd.append("addressLine1", formData.addressLine1 || "");
      fd.append("city", formData.city || "");
      fd.append("stateProvince", formData.stateProvince || "");
      fd.append("preferredStartDate", formData.preferredStartDate);
      fd.append("durationOfRent", formData.durationOfRent);
      fd.append("reasonForRenting", formData.reasonForRenting);
      fd.append(
        "idCollectionAgreed",
        formData.idCollectionAgreed ? "true" : "false"
      );
      if (formData.validId) fd.append("validId", formData.validId);
      if (formData.selfieWithId)
        fd.append("selfieWithId", formData.selfieWithId);
      if (formData.proofOfBilling)
        fd.append("proofOfBilling", formData.proofOfBilling);

      const result = await createRental(fd);

      navigate("/my-requests", {
        state: {
          message:
            result?.message ||
            "Rental request submitted successfully! Wait for the owner's approval.",
        },
      });
    } catch (error) {
      console.error("Failed to submit rental request:", error);
      setErrors({
        submit: "Failed to submit rental request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#6C4BF4] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading item details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 text-red-500 mx-auto mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Item Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The item you're looking for could not be found.
            </p>
            <button
              onClick={() => navigate("/items-for-rent")}
              className="bg-[#6C4BF4] text-white px-4 py-2 rounded-md hover:bg-[#7857FD]"
            >
              Back to Items
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 text-[#6C4BF4] focus:outline-none"
          >
            <IoArrowBack className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Rental Request</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Item Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Rental Details
              </h3>

              {/* Item Image */}
              <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <img
                  src={getImageUrl(item.images?.[0] || item.image)}
                  alt={item.name || item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Item Info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">
                  {item.name || item.title}
                </h4>

                <div className="flex items-center text-sm text-gray-600">
                  <IoLocationOutline className="w-4 h-4 mr-2" />
                  {item.location}
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <IoPersonOutline className="w-4 h-4 mr-2" />
                  {item.renter || "Item Owner"}
                </div>

                <div className="text-lg font-bold text-[#6C4BF4]">
                  ₱{parseFloat(item.price).toFixed(2)} / day
                </div>

                {item.dealOption && (
                  <div className="text-sm text-gray-600">
                    <strong>Deal Option:</strong> {item.dealOption}
                  </div>
                )}

                {item.deliveryOption && (
                  <div className="text-sm text-gray-600">
                    <strong>Delivery:</strong> {item.deliveryOption}
                  </div>
                )}

                {item.paymentMethod && (
                  <div className="text-sm text-gray-600">
                    <strong>Payment Methods:</strong> {item.paymentMethod}
                  </div>
                )}
              </div>

              {/* Cost Breakdown */}
              {costBreakdown && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-3">
                    Cost Breakdown
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Rental ({costBreakdown.days} days)</span>
                      <span>₱{costBreakdown.rentalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Fee (10%)</span>
                      <span>₱{costBreakdown.serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes (12%)</span>
                      <span>₱{costBreakdown.taxes.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-[#6C4BF4] pt-2 border-t">
                      <span>Total</span>
                      <span>₱{costBreakdown.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Rental Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complete Address *
                    </label>
                    <input
                      type="text"
                      name="completeAddress"
                      value={formData.completeAddress}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] ${
                        errors.completeAddress
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.completeAddress && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.completeAddress}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State / Province / Region
                    </label>
                    <input
                      type="text"
                      name="stateProvince"
                      value={formData.stateProvince}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Email *
                    </label>
                    <input
                      type="email"
                      name="confirmEmail"
                      value={formData.confirmEmail}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] ${
                        errors.confirmEmail
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.confirmEmail && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.confirmEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Rental Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                  Rental Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration of Rent *
                    </label>
                    <input
                      type="number"
                      name="durationOfRent"
                      value={formData.durationOfRent}
                      onChange={handleInputChange}
                      placeholder="Minimum 1 day"
                      min="1"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] ${
                        errors.durationOfRent
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.durationOfRent && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.durationOfRent}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum rental period is 1 day
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Rental Start Date *
                    </label>
                    <input
                      type="date"
                      name="preferredStartDate"
                      value={formData.preferredStartDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] ${
                        errors.preferredStartDate
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.preferredStartDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.preferredStartDate}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Renting *
                    </label>
                    <textarea
                      name="reasonForRenting"
                      value={formData.reasonForRenting}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Please let us know what you'll be using the rental for (ex. school, work, event, online exam)"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] ${
                        errors.reasonForRenting
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.reasonForRenting && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.reasonForRenting}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ID Collection Agreement */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                  Security Deposit & ID Collection
                </h3>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Aside from the Security Deposit, we will also be collecting
                    your valid ID. We will hold onto your ID and return it at
                    the end of the rental period. Are you okay with this?
                  </p>

                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="idCollectionAgreed"
                        checked={formData.idCollectionAgreed === true}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            idCollectionAgreed: true,
                          }))
                        }
                        className="mr-2 text-[#6C4BF4] focus:ring-[#6C4BF4]"
                      />
                      <span className="text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="idCollectionAgreed"
                        checked={formData.idCollectionAgreed === false}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            idCollectionAgreed: false,
                          }))
                        }
                        className="mr-2 text-[#6C4BF4] focus:ring-[#6C4BF4]"
                      />
                      <span className="text-sm text-gray-700">No</span>
                    </label>
                  </div>

                  {errors.idCollectionAgreed && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.idCollectionAgreed}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mt-3">
                    For security purposes, we collect 1 valid ID and hold onto
                    it until the end of the rental period. Rest assured that we
                    keep information secure and all information are kept
                    private.
                  </p>
                </div>

                {/* File Uploads */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload 1 Valid ID *
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="validId"
                        onChange={handleInputChange}
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] text-xs file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-medium file:bg-[#6C4BF4] file:text-white hover:file:bg-[#5A3DE8] file:cursor-pointer"
                      />
                      {formData.validId && (
                        <p className="text-xs text-green-600 mt-1">
                          Selected: {formData.validId.name}
                        </p>
                      )}
                    </div>
                    {errors.validId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.validId}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Please upload 1 valid government-issued ID. This can be:
                      Passport, Driver's License, PRC, UMID, Senior Citizen ID,
                      Integrated Bar ID, ARC card for foreigners. (Images only)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload a selfie with your Valid ID *
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="selfieWithId"
                        onChange={handleInputChange}
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] text-xs file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-medium file:bg-[#6C4BF4] file:text-white hover:file:bg-[#5A3DE8] file:cursor-pointer"
                      />
                      {formData.selfieWithId && (
                        <p className="text-xs text-green-600 mt-1">
                          Selected: {formData.selfieWithId.name}
                        </p>
                      )}
                    </div>
                    {errors.selfieWithId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.selfieWithId}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Please take a selfie with your submitted valid ID. (Images
                      only)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload 1 Proof of Billing *
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="proofOfBilling"
                        onChange={handleInputChange}
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] text-xs file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-medium file:bg-[#6C4BF4] file:text-white hover:file:bg-[#5A3DE8] file:cursor-pointer"
                      />
                      {formData.proofOfBilling && (
                        <p className="text-xs text-green-600 mt-1">
                          Selected: {formData.proofOfBilling.name}
                        </p>
                      )}
                    </div>
                    {errors.proofOfBilling && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.proofOfBilling}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Please upload a picture of at least 1 proof of billing.
                      This can be a billing for: Meralco, MWSS/Maynilad, Credit
                      Card, Cable TV, PLDT, Mobile Postpaid Plan, Internet
                      Service Provider. (Images only)
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {errors.submit && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{errors.submit}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!formData.idCollectionAgreed || isSubmitting}
                  className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${
                    !formData.idCollectionAgreed || isSubmitting
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#6C4BF4] text-white hover:bg-[#7857FD]"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting Request...
                    </div>
                  ) : (
                    "Submit Rental Request"
                  )}
                </button>

                {!formData.idCollectionAgreed && (
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Please agree to ID collection to submit your rental request.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalFlow;
