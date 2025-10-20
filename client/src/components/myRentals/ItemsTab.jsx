import React, { useState, useContext } from "react";
import { IoAdd, IoPencil, IoTrash } from "react-icons/io5";
import SearchFilterSection from "../SearchFilterSection";
import ConfirmationModal from "../modals/ConfirmationModal";
import { getImageUrl } from "../../utils/imageUtils";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination";
import {
  quickRateCalculation,
  formatCurrency,
} from "../../utils/rentalCalculations";

const ItemsTab = ({
  currentItems,
  paginate,
  pageNumbers,
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onRemoveItem,
  onAddItem,
  onEditItem,
  loading,
  error,
  onFilterChange,
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    item: null,
  });

  const handleFilterChange = (filters) => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  const handleDeleteClick = (item) => {
    setDeleteConfirm({ show: true, item });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm.item && onRemoveItem) {
      onRemoveItem(deleteConfirm.item._id);
    }
    setDeleteConfirm({ show: false, item: null });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, item: null });
  };

  const handleEditClick = (item) => {
    if (onEditItem) {
      onEditItem(item);
    }
  };
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Modal state to prompt for profile or verification
  const [promptModal, setPromptModal] = useState({ show: false, type: "verify" });

  const handleAddClick = () => {
    if (!user || !user.gender || !user.birthDate) {
      setPromptModal({ show: true, type: "profile" });
      return;
    }
    if (!user.isVerified) {
      setPromptModal({ show: true, type: "verify" });
      return;
    }
    if (onAddItem) onAddItem();
  };
  return (
    <div className="flex-1 flex flex-col">
      {/* Filters + Add Button */}
      <div className="-mt-4 -mb-1 pr-4 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
        <div className="flex-1">
          <SearchFilterSection
            onFilterChange={handleFilterChange}
            showFilters={["categories", "availability"]}
            layout="horizontal"
          />
        </div>

        {/* Add an Item button */}
        <button
          onClick={handleAddClick}
          className="bg-[#6C4BF4] text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-[#3300FFFF] active:bg-[#5f46c6] transition-colors duration-200 w-full md:w-auto flex items-center gap-2 ml-4"
        >
          <IoAdd className="w-5 h-5" />
          <span>Add an Item</span>
        </button>

        {/* Prompt modal for profile or verification before adding */}
        <ConfirmationModal
          isOpen={promptModal.show}
          onClose={() => setPromptModal({ show: false, type: "verify" })}
          onConfirm={() => {
            setPromptModal({ show: false, type: "verify" });
            navigate("/profile");
          }}
          title={promptModal.type === "profile" ? "Complete your profile" : "Verify your account"}
          message={
            promptModal.type === "profile"
              ? "You need to complete your profile (username, gender, and birthdate) before adding items."
              : "You need to verify your account before adding items."
          }
          confirmText={promptModal.type === "profile" ? "Go to Profile" : "Go to Verification"}
          cancelText="Cancel"
          type="info"
        />
      </div>

      {/* Items Table */}
      <div className="mt-4 overflow-x-auto overflow-y-auto pr-4">
        <div className="grid grid-cols-6 text-sm gap-4 pt-4 pb-4 pl-2 pr-6 font-semibold text-white bg-[#6C4BF4] rounded-lg shadow-sm">
          <div className="text-center">Item</div>
          <div className="text-center">Name</div>
          <div className="text-center">Category</div>
          <div className="text-center">Price / Day</div>
          <div className="text-center">Availability</div>
          <div className="text-center">Actions</div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C4BF4]"></div>
            <span className="ml-3 text-gray-600">Loading your items...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="text-red-600 mb-2">Failed to load items</div>
              <div className="text-sm text-gray-500">{error}</div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && currentItems.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="text-gray-600 mb-2">No items found</div>
              <div className="text-sm text-gray-500">
                Start by adding your first item for rent
              </div>
            </div>
          </div>
        )}

        {!loading &&
          !error &&
          currentItems.map((item) => {
            const availability = item.availability || "Available";
            const isRentedOut = availability === "Rented Out";
            const canModify = availability === "Available";

            // Get the first image URL
            const getItemImageUrl = () => {
              if (item.images && item.images.length > 0) {
                const firstImage = item.images[0];
                // Handle both new format (object) and legacy format (string)
                if (
                  typeof firstImage === "string" &&
                  firstImage.startsWith("http")
                ) {
                  return firstImage;
                } else {
                  return getImageUrl(firstImage);
                }
              } else if (item.image) {
                // Fallback to legacy single image field
                return typeof item.image === "string" &&
                  item.image.startsWith("http")
                  ? item.image
                  : getImageUrl(item.image);
              }
              return null;
            };

            const imageUrl = getItemImageUrl();

            // Category-based placeholder colors
            const getCategoryColor = (category) => {
              const colors = {
                "Electronics and Gadgets": "bg-blue-100 text-blue-600",
                "Home and Appliances": "bg-green-100 text-green-600",
                "Events and Parties": "bg-pink-100 text-pink-600",
                "Outdoor and Travel": "bg-yellow-100 text-yellow-600",
                "Media and Hobbies": "bg-purple-100 text-purple-600",
                "Clothing and Fashion": "bg-red-100 text-red-600",
                "Vehicles and Transport": "bg-gray-100 text-gray-600",
                "Equipment and Tools": "bg-orange-100 text-orange-600",
                "Sports Essentials": "bg-teal-100 text-teal-600",
                "Seasonal Item": "bg-indigo-100 text-indigo-600",
                Books: "bg-amber-100 text-amber-600",
                Vehicles: "bg-slate-100 text-slate-600",
              };
              return colors[category] || "bg-gray-100 text-gray-600";
            };

            return (
              <div
                key={item._id}
                className="grid grid-cols-6 gap-4 items-center pl-2 pr-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors duration-150"
              >
                <div className="flex justify-center">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden ${getCategoryColor(
                      item.category
                    )}`}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                    ) : null}
                    <span
                      className={`text-xs font-semibold ${
                        imageUrl ? "hidden" : "block"
                      }`}
                      style={{ display: imageUrl ? "none" : "block" }}
                    >
                      {item.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="text-center text-black">
                  <p className="font-regular text-sm text-black">{item.name}</p>
                </div>
                <div className="text-sm text-center text-black">
                  {item.category}
                </div>
                <div className="text-sm text-center text-black">
                  {(() => {
                    const basePrice = parseFloat(item.price) || 0;
                    const finalPrice =
                      quickRateCalculation(basePrice).finalRate;
                    return formatCurrency(finalPrice, true);
                  })()}
                </div>
                <div className="text-sm text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                      availability === "Available"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {availability}
                  </span>
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    disabled={!canModify}
                    onClick={() => canModify && handleEditClick(item)}
                    className={`flex flex-col items-center group ${
                      !canModify ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                    style={{ minWidth: "48px" }}
                    title={
                      canModify
                        ? "Edit item"
                        : isRentedOut
                        ? "Cannot edit while rented out"
                        : "Cannot edit while unavailable"
                    }
                  >
                    <IoPencil className="w-4.5 h-4.5 mb-0.5 text-[#6C4BF4]" />
                  </button>
                  <button
                    disabled={!canModify}
                    onClick={() => canModify && handleDeleteClick(item)}
                    className={`flex flex-col items-center group ${
                      !canModify ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                    style={{ minWidth: "48px" }}
                    title={
                      canModify
                        ? "Delete item"
                        : "Cannot delete while rented out"
                    }
                  >
                    <IoTrash className="w-4.5 h-4.5 mb-0.5 text-[#6C4BF4]" />
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={paginate}
        itemName="items"
        maxVisiblePages={5}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirm.show}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Item"
        message="Are you sure you want to remove"
        itemName={deleteConfirm.item?.name}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default ItemsTab;
