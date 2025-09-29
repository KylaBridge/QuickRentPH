import React from "react";

const ItemsTab = ({
  currentItems,
  CustomDropdown,
  openDropdown,
  handleDropdownToggle,
  handleCategorySelect,
  handleAvailabilitySelect,
  paginate,
  pageNumbers,
  currentPage,
  totalPages,
  onRemoveItem,
  onAddItem,
  loading,
  error,
}) => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Filters + Add Button */}
      <div className="-mt-4 -mb-1 pr-4 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
        <div className="flex text-sm flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <CustomDropdown
            label="Categories"
            options={[
              "Electronics and Gadgets",
              "Home and Appliances",
              "Events and Parties",
              "Outdoor and Travel",
              "Media and Hobbies",
              "Clothing and Fashion",
              "Vehicles and Transport",
              "Equipment and Tools",
              "Sports Essentials",
              "Seasonal Item",
            ]}
            onSelect={handleCategorySelect}
            isOpen={openDropdown === "Categories"}
            onToggle={() => handleDropdownToggle("Categories")}
            width="md:w-48"
          />
          <CustomDropdown
            label="Availability"
            options={["Available", "Rented Out"]}
            onSelect={handleAvailabilitySelect}
            isOpen={openDropdown === "Availability"}
            onToggle={() => handleDropdownToggle("Availability")}
            width="md:w-40"
          />
        </div>

        {/* Add an Item button */}
        <button
          onClick={onAddItem}
          className="bg-[#6C4BF4] text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-[#3300FFFF] active:bg-[#5f46c6] transition-colors duration-200 w-full md:w-auto flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
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
            const firstImage =
              item.images && item.images.length > 0 ? item.images[0] : null;

            return (
              <div
                key={item._id}
                className="grid grid-cols-6 gap-4 items-center pl-2 pr-4 pt-2 pb-2 bg-white rounded-lg hover:bg-gray-100 transition-colors duration-150"
              >
                <div className="flex justify-center">
                  {firstImage ? (
                    <img
                      src={`${
                        import.meta.env.VITE_API_URL?.replace("/api", "") ||
                        "http://localhost:8000"
                      }/${firstImage}`}
                      alt={item.name}
                      className="w-8.5 h-8.5 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-8.5 h-8.5 rounded-lg bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">No Image</span>
                    </div>
                  )}
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
                    onClick={() => canModify && console.log("Edit", item._id)}
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
                    <svg
                      className="w-4.5 h-4.5 mb-0.5"
                      fill="none"
                      stroke="#6C4BF4"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    disabled={!canModify}
                    onClick={() => canModify && onRemoveItem(item._id)}
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
                    <svg
                      className="w-4.5 h-4.5 mb-0.5"
                      fill="none"
                      stroke="#6C4BF4"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
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
    </div>
  );
};

export default ItemsTab;
