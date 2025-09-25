import React, { useRef, useState, useEffect } from "react";
import gcashLogo from "../../assets/GCash-Logo.png";
import paymayaLogo from "../../assets/paymaya-logo.png";
import mastercardLogo from "../../assets/Mastercard-logo.svg.png";

const MIN_BOX_WIDTH = 160; // px
const BOX_GAP = 16; // px (gap-4)
const UPLOAD_BOX_WIDTH = 160; // px

const CATEGORIES = [
  "Electronics",
  "Sports",
  "Music",
  "Tools",
  "Books",
  "Clothing",
  "Furniture",
  "Vehicles",
];
const DEAL_OPTIONS = [
  "Standard Delivery",
  "Express / Same-day Delivery",
  "Scheduled Delivery",
  "Drop-off Point / Locker Delivery",
  "Return via Courier Pickup",
];
const DEFAULT_TERMS = [
  { label: "Minimum rental period", value: "3 days" },
  { label: "Late fee", value: "₱300/day" },
  { label: "No international travel with the item" },
  { label: "Handle with care; any damages will be deducted from deposit" },
  { label: "Renter must present a valid government ID upon pickup" },
];

const AddItem = ({ onClose }) => {
  const fileInputRef = useRef();
  const containerRef = useRef();
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(0);
  const [maxVisible, setMaxVisible] = useState(2);
  const [paymentMethods, setPaymentMethods] = useState({
    gcash: false,
    paymaya: false,
    card: false,
    bank: false,
  });
  const [deliveryOption, setDeliveryOption] = useState("");
  const [category, setCategory] = useState("");
  const [downpayment, setDownpayment] = useState("");

  // Dynamically calculate how many boxes fit in the image container
  useEffect(() => {
    if (!containerRef.current) return;

    const calcBoxes = () => {
      const width = containerRef.current.offsetWidth;
      let calculatedMax = 2;

      if (width >= 600) {
        const available = width - UPLOAD_BOX_WIDTH - BOX_GAP;
        calculatedMax = Math.max(
          1,
          Math.floor((available + BOX_GAP) / (MIN_BOX_WIDTH + BOX_GAP))
        );
      }

      setMaxVisible(calculatedMax);
    };

    // Run once on mount
    calcBoxes();

    // Use ResizeObserver instead of window resize
    const resizeObserver = new ResizeObserver(calcBoxes);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Handle file input (click or drag)
  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    const newImages = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    // Add new images to the front so most recent is first
    setImages((prev) => [...newImages, ...prev]);
    setPage(0);
  };

  // Drag & drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  const handleDragOver = (e) => e.preventDefault();

  // Remove image
  const handleRemove = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    if (page > 0 && page * maxVisible >= images.length - 1) {
      setPage(page - 1);
    }
  };

  // Replace image
  const handleReplace = (idx, file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setImages((prev) =>
      prev.map((img, i) => (i === idx ? { url, file } : img))
    );
  };

  // Validate price input
  const validatePriceInput = (e) => {
    const value = parseFloat(e.target.value);

    if (isNaN(value) || value <= 0) {
      e.target.value = "0.00";
    } else {
      e.target.value = value.toFixed(2); // format to 2 decimals
    }
  };

  // Size/Dimensions dynamic placeholders per category
  const DIM_PLACEHOLDERS = {
    Electronics: "e.g., 6.1 in x 2.9 in x 0.3 in",
    Sports: "e.g., Ball diameter: 22 cm, Racket length: 68 cm",
    Music: "e.g., Guitar: 40 in length, 15 in width",
    Tools: "e.g., 12 in x 5 in x 3 in",
    Books: "e.g., 8.5 in x 11 in",
    Clothing: "e.g., S, M, L, XL",
    Furniture: "e.g., 180 cm x 90 cm x 40 cm",
    Vehicles: "e.g., 4.5 m x 1.8 m x 1.6 m",
  };
  const DEFAULT_DIM_PLACEHOLDER =
    "Enter product size/dimensions (e.g., Length x Width x Height)";
  const sizePlaceholder = category
    ? DIM_PLACEHOLDERS[category] || DEFAULT_DIM_PLACEHOLDER
    : DEFAULT_DIM_PLACEHOLDER;

  const handleDownpaymentChange = (e) => {
    const raw = e.target.value;
    // keep only digits and one decimal point
    let sanitized = raw.replace(/[^0-9.]/g, "");
    const parts = sanitized.split(".");
    if (parts.length > 2) {
      sanitized = parts[0] + "." + parts.slice(1).join("");
    }

    // allow empty while typing
    if (sanitized === "" || sanitized === ".") {
      setDownpayment("");
      return;
    }

    let num = parseFloat(sanitized);
    if (isNaN(num)) {
      setDownpayment("");
      return;
    }

    if (num > 100) {
      setDownpayment("100");
      return;
    }
    if (num < 0) {
      setDownpayment("0");
      return;
    }

    // keep user's decimal typing (e.g., 50.)
    setDownpayment(sanitized);
  };

  // Paging
  const totalPages = Math.ceil(images.length / maxVisible) || 1;
  const canNext = page < totalPages - 1;
  const canPrev = page > 0;
  const startIdx = page * maxVisible;
  const visibleImages = images.slice(startIdx, startIdx + maxVisible);

  // Placeholders if no images
  const placeholders = Array.from({
    length: Math.max(0, maxVisible - visibleImages.length),
  });

  // Overlay state for hover
  const [hoverIdx, setHoverIdx] = useState(null);

  // Replace input ref for each image
  const replaceInputRefs = useRef([]);

  return (
    <div className="w-full mx-auto relative px-2 sm:px-4 flex-1 min-h-0">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-2">
        {/* Cancel Button */}
        <button
          className="text-[#6C4BF4] hover:underline text-base font-semibold"
          onClick={onClose}
        >
          &lt; Cancel
        </button>

        {/* Product Preview + Create */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-400 font-semibold">
            Product Preview
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1.5 12s3.75-7.5 10.5-7.5S22.5 12 22.5 12s-3.75 7.5-10.5 7.5S1.5 12 1.5 12z"
              />
              <circle cx="12" cy="12" r="3" strokeWidth={2} />
            </svg>
          </div>
          <button className="bg-[#6C4BF4] hover:bg-[#7857FD] text-white font-bold rounded-lg px-7 py-2 text-m shadow">
            Create
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
                    handleFiles(e.target.files);
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
                </span>
              </div>
              {/* Images/Placeholders */}
              <div className="flex gap-3 items-center min-h-[160px]">
                {/* Previous Arrow */}
                {canPrev && (
                  <button
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
                          className="bg-white text-gray-800 px-3 py-1 rounded font-semibold mb-1 text-xs shadow"
                          onClick={() => replaceInputRefs.current[idx].click()}
                        >
                          Replace
                        </button>
                        <button
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
                            handleReplace(startIdx + idx, e.target.files[0]);
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
              />
              <label className="block text-xs font-medium mb-1">
                Color <span className="text-red-600">*</span>
              </label>
              <input
                className="mb-1 border border-gray-200 rounded px-3 py-1 text-sm w-full"
                placeholder=""
              />
              <label className="block text-xs font-medium mb-1">
                General Description <span className="text-red-600">*</span>
              </label>
              <textarea
                className="border border-gray-200 rounded px-3 py-1 text-xs w-full"
                rows={4}
                placeholder="Include important details such as material, features, and any special conditions."
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
                    className="w-full border border-gray-200 rounded pl-3 pr-7 py-1 text-sm placeholder-gray-400"
                    placeholder="e.g. 50"
                    value={downpayment}
                    onChange={handleDownpaymentChange}
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
                  className="w-full border border-gray-200 rounded px-3 py-1 text-sm"
                  placeholder="e.g. Sampaloc, Metro Manila"
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
                      onChange={() =>
                        setPaymentMethods((p) => ({ ...p, gcash: !p.gcash }))
                      }
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
                      onChange={() =>
                        setPaymentMethods((p) => ({
                          ...p,
                          paymaya: !p.paymaya,
                        }))
                      }
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

                  {/* Card (Mastercard) */}
                  {/* <label className="inline-flex items-center gap-2 px-2 py-1 bg-white rounded-md border border-gray-300 shadow-sm cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={paymentMethods.card}
                      onChange={() =>
                        setPaymentMethods((p) => ({ ...p, card: !p.card }))
                      }
                    />
                    <span
                      className={`w-3 h-3 rounded-sm border ${
                        paymentMethods.card
                          ? "bg-[#6C4BF4] border-[#6C4BF4]"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    <img src={mastercardLogo} alt="Card" className="h-5" />
                  </label> */}

                  {/* Bank Transfer (text badge) */}
                  {/* <label className="inline-flex items-center gap-2 px-2 py-1 bg-white rounded-md border border-gray-300 shadow-sm cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={paymentMethods.bank}
                      onChange={() =>
                        setPaymentMethods((p) => ({ ...p, bank: !p.bank }))
                      }
                    />
                    <span
                      className={`w-3 h-3 rounded-sm border ${
                        paymentMethods.bank
                          ? "bg-[#6C4BF4] border-[#6C4BF4]"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    <span className="text-[10px] font-semibold border rounded px-2 py-0.5 text-gray-700">
                      BANK TRANSFER
                    </span>
                  </label> */}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">
                  Delivery Options <span className="text-red-600">*</span>
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs bg-white focus:border-black focus:ring-1 focus:ring-black"
                  value={deliveryOption}
                  onChange={(e) => setDeliveryOption(e.target.value)}
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
            />

            {/* Item Category */}
            <label className="block text-xs font-medium mb-1">
              Item Category <span className="text-red-600">*</span>
            </label>
            <select
              className="mb-2 w-full rounded-md border border-gray-300 px-3 py-1 text-xs bg-white focus:border-black focus:ring-1 focus:ring-black"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
                    defaultValue="0.00"
                    placeholder="0.00"
                    className="w-full border-0 px-2 py-1 text-xs focus:ring-0 focus:outline-none"
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
                  defaultValue=""
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
