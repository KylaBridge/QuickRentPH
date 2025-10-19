import React, { useState } from "react";

const ProductViewModal = ({ item, onClose, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");
  if (!item) return null;

  const handleDeleteClick = () => {
    setShowConfirm(true);
    setError("");
    setAdminPassword("");
  };

  const handleConfirmDelete = () => {
    if (!adminPassword) {
      setError("Please enter your admin password.");
      return;
    }
    // TODO: Validate password (API call or context)
    if (onDelete) onDelete(item, adminPassword);
    setShowConfirm(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          style={{ fontSize: "2rem", lineHeight: "1" }}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Product Image Section */}
        <div className="mb-4 flex justify-center">
          <img
            src={item.image || "/api/placeholder/200/200"}
            alt={item.name}
            className="w-56 h-56 object-cover rounded-lg border bg-gray-100"
          />
        </div>
        <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
        <div className="mb-2 text-gray-700">
          <span className="font-semibold">Owner:</span> {item.owner}
        </div>
        <div className="mb-2 text-gray-700">{item.description}</div>
        <div className="mb-2 text-gray-700">
          <span className="font-semibold">Specs:</span> {item.specs || "N/A"}
        </div>
        <div className="mb-2 text-gray-700">
          <span className="font-semibold">Category:</span> {item.category}
        </div>
        <div className="mb-2 text-gray-700">
          <span className="font-semibold">Location:</span> {item.location}
        </div>
        <div className="mb-2 text-gray-700">
          <span className="font-semibold">Price:</span> ₱{item.price}/day
        </div>
        <div className="mb-2 text-gray-700">
          <span className="font-semibold">Status:</span> {item.status}
        </div>
        <div className="mb-2 text-gray-700">
          <span className="font-semibold">Rented Count:</span>{" "}
          {item.rentedCount || 0}
        </div>
        {!showConfirm ? (
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={handleDeleteClick}
            >
              Delete
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <div className="mb-2 text-sm text-gray-700 font-medium">
              Confirm deletion: Enter admin password
            </div>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleConfirmDelete}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductViewModal;
