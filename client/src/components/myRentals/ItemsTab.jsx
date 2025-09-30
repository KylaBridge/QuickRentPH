import React, { useState } from "react";
import { IoAdd, IoPencil, IoTrash } from "react-icons/io5";
import SearchFilterSection from "../SearchFilterSection";
import ConfirmationModal from "../ConfirmationModal";
import { getImageUrl } from "../../utils/imageUtils";

const ItemsTab = ({
  currentItems,
  paginate,
  pageNumbers,
  currentPage,
  totalPages,
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
          onClick={onAddItem}
          className="bg-[#6C4BF4] text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-[#3300FFFF] active:bg-[#5f46c6] transition-colors duration-200 w-full md:w-auto flex items-center gap-2 ml-4"
        >
          <IoAdd className="w-5 h-5" />
          <span>Add an Item</span>
        </button>
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
                if (typeof firstImage === 'string' && firstImage.startsWith('http')) {
                  return firstImage;
                } else {
                  return getImageUrl(firstImage);
                }
              } else if (item.image) {
                // Fallback to legacy single image field
                return typeof item.image === 'string' && item.image.startsWith('http') 
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
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden ${getCategoryColor(item.category)}`}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <span 
                      className={`text-xs font-semibold ${imageUrl ? 'hidden' : 'block'}`}
                      style={{ display: imageUrl ? 'none' : 'block' }}
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
                  ₱{parseFloat(item.price).toFixed(2)}
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
      <div
        className="sticky left-0 z-10 flex justify-center items-center space-x-2"
        style={{ marginTop: "auto", marginBottom: "-15px" }}
      >
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-xs text-gray-700 bg-gray-200 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors duration-200"
        >
          Previous
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-4 py-2 text-xs rounded-lg shadow-sm font-semibold transition-colors duration-200 ${
              currentPage === number
                ? "bg-[#6C4BF4] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-xs text-gray-700 bg-gray-200 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors duration-200"
        >
          Next
        </button>
      </div>

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
