import React, { useRef } from "react";

const AddItem = ({ onClose }) => {
  const fileInputRef = useRef();

  return (
    <div className="w-full max-w-7xl mx-auto relative">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-3">
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
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A2 2 0 0020 6.382V6a2 2 0 00-2-2H6a2 2 0 00-2 2v.382a2 2 0 00.447 1.342L9 10m6 0v4m0 0l-6 4m6-4l-6-4"
              />
            </svg>
          </div>
          <button className="bg-[#6C4BF4] hover:bg-[#7857FD] text-white font-bold rounded-full px-5 py-3 text-m shadow">
            CREATE
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Product Media */}
          <div className="bg-white rounded-xl shadow p-4">
            <label className="font-semibold mb-2 block">Product Media</label>
            <div className="flex gap-4">
              {/* Upload Box */}
              <div
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg w-40 h-40 cursor-pointer hover:border-[#6C4BF4] transition"
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  type="file"
                  multiple
                  className="hidden"
                  ref={fileInputRef}
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
                <span className="text-xs text-gray-500 text-center">
                  Click to Upload <br />{" "}
                  <span className="text-[#6C4BF4]">or drag and drop</span>
                </span>
              </div>
              {/* Thumbnails */}
              <div className="flex gap-2 items-center">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src="https://placehold.co/80x80"
                    alt="preview"
                    className="object-cover w-full h-full"
                  />
                  <button className="absolute inset-0 bg-black bg-opacity-40 text-white text-xs font-semibold flex items-center justify-center opacity-0 hover:opacity-100 transition">
                    Replace
                  </button>
                  <button className="absolute top-1 right-1 bg-white rounded-full p-1 shadow text-xs text-gray-500 hover:text-red-500">
                    Remove
                  </button>
                </div>
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src="https://placehold.co/48x48"
                    alt="preview"
                    className="object-cover w-full h-full"
                  />
                </div>
                <button className="ml-2 text-2xl text-gray-400 hover:text-[#6C4BF4]">
                  &gt;
                </button>
              </div>
            </div>
          </div>

          {/* Product Specification */}
          <div className="bg-white rounded-xl shadow p-4">
            <label className="font-semibold mb-2 block">
              Product Specification
            </label>
            <input
              className="mb-2 border border-gray-200 rounded px-3 py-2 text-sm w-full"
              placeholder="Size/Dimensions *"
            />
            <input
              className="mb-2 border border-gray-200 rounded px-3 py-2 text-sm w-full"
              placeholder="Color *"
            />
            <textarea
              className="border border-gray-200 rounded px-3 py-2 text-sm w-full"
              rows={2}
              placeholder="General Description *"
            />
          </div>

          {/* Booking Details & Included Accessories */}
          <div className="flex gap-6">
            {/* Booking Details */}
            <div className="bg-white rounded-xl shadow p-4 flex-1">
              <label className="font-semibold mb-2 block">Booking Details</label>
              <input
                className="mb-2 border border-gray-200 rounded px-3 py-2 text-sm w-full"
                placeholder="Downpayment required (%) *"
              />
              <input
                className="mb-2 border border-gray-200 rounded px-3 py-2 text-sm w-full"
                placeholder="Pickup Location *"
              />
              <input
                className="mb-2 border border-gray-200 rounded px-3 py-2 text-sm w-full"
                placeholder="Payment Methods *"
              />
              <input
                className="border border-gray-200 rounded px-3 py-2 text-sm w-full"
                placeholder="Delivery Options *"
              />
            </div>

            {/* Included Accessories */}
            <div className="bg-white rounded-xl shadow p-4 flex-1">
              <label className="font-semibold mb-2 block">
                Included Accessories
              </label>
              <textarea
                className="border border-gray-200 rounded px-3 py-2 text-sm w-full"
                rows={7}
                placeholder="List down item accessories included if applicable."
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow p-4">
            <label className="font-semibold mb-2 block">Basic Information</label>
            <input
              className="mb-2 border border-gray-200 rounded px-3 py-2 text-sm w-full"
              placeholder="Product Name *"
            />
            <input
              className="mb-2 border border-gray-200 rounded px-3 py-2 text-sm w-full"
              placeholder="Item Category *"
            />
            <div className="flex gap-2 mb-2">
              <input
                className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm"
                placeholder="Item Price *"
              />
              <input
                className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm"
                placeholder="Deal Option *"
              />
            </div>
            <input
              className="border border-gray-200 rounded px-3 py-2 text-sm w-full"
              placeholder="Location *"
            />
          </div>

          {/* Terms and Conditions */}
          <div className="bg-white rounded-xl shadow p-4">
            <label className="font-semibold mb-2 block">
              Terms and Conditions
            </label>
            <div className="text-xs text-gray-700 mb-2">
              <div className="font-semibold">Default Rules (system-generated)</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <span className="font-bold">Minimum rental period:</span> 3
                  days
                </li>
                <li>
                  <span className="font-bold">Late fee:</span> ₱300/day
                </li>
                <li>No international travel with the item</li>
                <li>
                  Handle with care; any damages will be deducted from deposit
                </li>
                <li>Renter must present a valid government ID upon pickup</li>
              </ul>
            </div>
            <textarea
              className="border border-gray-200 rounded px-3 py-2 text-sm w-full"
              rows={3}
              placeholder="Custom Rules"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
