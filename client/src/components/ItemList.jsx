import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoStarSharp } from "react-icons/io5";
import { UserContext } from "../context/userContext";
import { filterAndSortItems, searchItems } from "../utils/itemUtils";

const ItemList = ({
  items,
  title = "Featured Items",
  showSeeMore = true,
  maxItems = 6,
  showActions = false,
  onView,
  onRent,
  compact = false,
  onCardClick,
  filters = {},
  searchTerm = "",
}) => {
  const navigate = useNavigate();
  const { getAllItems } = useContext(UserContext);

  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all items from database
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        setLoading(true);
        const fetchedItems = await getAllItems();
        setAllItems(fetchedItems);
        setError(null);
      } catch (err) {
        setError(err);
        setAllItems([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if items are not provided as props
    if (!items) {
      fetchAllItems();
    }
  }, [getAllItems, items]);

  // Transform database items to display format
  const transformItem = (dbItem) => {
    // Debug logging
    console.log("Debug - Item images:", dbItem.images);

    // Handle owner display logic
    let ownerDisplay = "Available";

    if (dbItem.owner) {
      if (typeof dbItem.owner === "object" && dbItem.owner !== null) {
        // Owner is populated with user details
        if (dbItem.owner.username) {
          ownerDisplay = dbItem.owner.username;
        } else if (dbItem.owner.firstName && dbItem.owner.lastName) {
          ownerDisplay = `${dbItem.owner.firstName} ${dbItem.owner.lastName}`;
        } else if (dbItem.owner.firstName) {
          ownerDisplay = dbItem.owner.firstName;
        }
      } else {
        // Owner is just an ObjectId string
        ownerDisplay = "Owner";
      }
    }

    return {
      id: dbItem._id,
      renter: ownerDisplay,
      location: dbItem.location,
      title: dbItem.name,
      price: `₱ ${parseFloat(dbItem.price).toFixed(0)}`,
      period: "day",
      rating: 5, // Default rating, you can add rating field to your schema
      image:
        dbItem.images && dbItem.images.length > 0
          ? `http://localhost:3000/user_rentals/${dbItem.images[0].replace(
              /^user_rentals[\/\\]/,
              ""
            )}`
          : "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", // fallback
      timeAgo: "Available now",
      category: dbItem.category,
      ...dbItem, // Include all original properties
    };
  }; // Use provided items or fetched items
  const sourceItems = items || allItems.map(transformItem);

  // Apply search, filters, and sorting using utility functions
  let processedItems = sourceItems;

  // Apply search first
  if (searchTerm && searchTerm.trim()) {
    processedItems = searchItems(processedItems, searchTerm);
  }

  // Apply filters and sorting
  processedItems = filterAndSortItems(processedItems, filters);

  const displayItems = processedItems.slice(0, maxItems);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <IoStarSharp
        key={index}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const gridClasses = compact
    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3"
    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6";

  const cardClasses = compact
    ? "bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer h-[360px] flex flex-col min-w-[160px] w-full"
    : "bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-[400px] flex flex-col min-w-[200px] w-full";

  const imageWrapper = compact
    ? "flex-shrink-0 h-32 p-2"
    : "flex-shrink-0 h-40 p-2 sm:p-3";
  const titleClasses = compact
    ? "text-xs font-semibold"
    : "text-sm sm:text-base font-semibold";
  const priceClasses = compact
    ? "text-sm font-bold"
    : "text-sm sm:text-base font-bold";
  const actionPadding = compact
    ? "px-2 py-1 text-xs"
    : "px-3 py-2 text-xs sm:text-sm";

  // Loading state
  if (loading && !items) {
    return (
      <section className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C4BF4]"></div>
            <span className="ml-3 text-gray-600">Loading items...</span>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error && !items) {
    return (
      <section className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="text-red-600 mb-2">Failed to load items</div>
              <div className="text-sm text-gray-500">{error}</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Header */}
        {title !== "" && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-poppins">
              {title}
            </h2>
            {showSeeMore && (
              <button
                onClick={() => navigate("/login")}
                className="text-[#6C4BF4] hover:text-purple-700 font-medium font-poppins"
              >
                See More
              </button>
            )}
          </div>
        )}

        {/* Empty state when no items match filters */}
        {displayItems.length === 0 && !loading && !error ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="text-gray-600 mb-2">No items found</div>
              <div className="text-sm text-gray-500">
                {Object.values(filters).some((f) => f && f.trim()) || searchTerm
                  ? "Try adjusting your filters or search terms"
                  : "No items are currently available"}
              </div>
            </div>
          </div>
        ) : (
          /* Items Grid */
          <div className={gridClasses}>
            {displayItems.map((item) => (
              <div
                key={item.id}
                className={cardClasses}
                onClick={() => onCardClick && onCardClick(item)}
              >
                {/* Renter and Location - Fixed height */}
                <div className="px-2 sm:px-3 py-2 border-b border-gray-100 flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-900 font-poppins truncate max-w-[60%]">
                      {item.renter}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500 font-poppins truncate max-w-[35%]">
                      {item.location}
                    </span>
                  </div>
                </div>

                {/* Item Image - Fixed height */}
                <div
                  className={`${imageWrapper} bg-gray-100 flex items-center justify-center flex-shrink-0`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                {/* Item Details - Flexible content */}
                <div className="px-2 sm:px-3 py-2 flex-1 flex flex-col justify-between min-h-0">
                  <div className="flex-1">
                    {/* Title */}
                    <h3
                      className={`${titleClasses} text-gray-900 mb-2 font-poppins line-clamp-2`}
                    >
                      {item.title}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`${priceClasses} text-[#6C4BF4] font-poppins`}
                      >
                        {item.price} / {item.period}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex items-center space-x-0.5 sm:space-x-1">
                        {renderStars(item.rating)}
                      </div>
                    </div>

                    {/* Bottom section with time and heart */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] sm:text-xs text-gray-500 font-poppins truncate">
                        {item.timeAgo}
                      </span>
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Action buttons - Fixed at the bottom */}
                  {showActions && (
                    <div className="mt-auto pt-2 flex-shrink-0">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onView ? onView(item) : null;
                          }}
                          className={`bg-white border border-gray-300 rounded ${actionPadding} font-medium hover:bg-gray-50`}
                        >
                          VIEW
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRent ? onRent(item) : null;
                          }}
                          className={`bg-[#6C4BF4] text-white rounded ${actionPadding} font-medium hover:bg-[#7857FD]`}
                        >
                          RENT
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ItemList;
