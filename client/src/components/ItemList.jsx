import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoStarSharp, IoHeart, IoHeartOutline } from "react-icons/io5";
import { UserContext } from "../context/userContext";
import { AuthContext } from "../context/authContext";
import { useWishlist } from "../context/wishlistContext";
import { filterAndSortItems, searchItems } from "../utils/itemUtils";
import { getImageUrl } from "../utils/imageUtils";
import Toast from "./Toast";

const ItemList = ({
  items,
  title = "Featured Items",
  showSeeMore = true,
  maxItems = 6,
  showActions = false,
  onView,
  onRent,
  onRentClick,
  onGoToProfile,
  compact = false,
  onCardClick,
  filters = {},
  searchTerm = "",
}) => {
  const navigate = useNavigate();
  const { getAllItems } = useContext(UserContext);
  const { user } = useContext(AuthContext);
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

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
    // Normalize id whether it's provided as `id` or `_id` from DB
    const normalizedId =
      dbItem.id || dbItem._id || (dbItem._id && String(dbItem._id));
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
        ownerDisplay = "Owner";
      }
    }

    return {
      // ensure id exists for list keys
      id: normalizedId,
      renter: ownerDisplay,
      location: dbItem.location,
      title: dbItem.title || dbItem.name,
      price: dbItem.price
        ? `₱ ${parseFloat(dbItem.price).toFixed(0)}`
        : dbItem.price,
      originalPrice: dbItem.originalPrice || dbItem.price, // Keep original numeric price for filtering
      period: dbItem.period || "day",
      rating: dbItem.rating || 5,
      image:
        dbItem.image || getImageUrl((dbItem.images && dbItem.images[0]) || ""),
      category: dbItem.category,
      // Add payment methods - use existing or add sample ones
      paymentMethod: dbItem.paymentMethod || "GCash, PayMaya",
      ...dbItem, // Include all original properties
    };
  };

  // Use provided items or fetched items and normalize via transformItem so every item has `id`
  const sourceItems = (items || allItems).map(transformItem);

  // Apply search, filters, and sorting using utility functions
  let processedItems = sourceItems;

  // Apply search first
  if (searchTerm && searchTerm.trim()) {
    processedItems = searchItems(processedItems, searchTerm);
  }

  // Apply filters and sorting
  processedItems = filterAndSortItems(processedItems, filters);

  const displayItems = maxItems
    ? processedItems.slice(0, maxItems)
    : processedItems;

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
    ? "bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer h-[320px] flex flex-col min-w-[160px] w-full"
    : "bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-[360px] flex flex-col min-w-[200px] w-full";

  const imageWrapper = compact
    ? "flex-shrink-0 h-40 p-2"
    : "flex-shrink-0 h-48 p-2 sm:p-3";
  const titleClasses = compact
    ? "text-xs font-semibold"
    : "text-sm sm:text-base font-semibold";
  const priceClasses = compact
    ? "text-sm font-bold"
    : "text-sm sm:text-base font-bold";
  const actionPadding = compact
    ? "px-2 py-1 text-xs"
    : "px-3 py-2 text-xs sm:text-sm";

  // Handle rent action
  const handleRentItem = (item) => {
    if (onRent) {
      onRent(item);
    } else if (onRentClick) {
      // Delegate to parent modal handler
      onRentClick();
    } else {
      // Fallback: navigate to item detail view
      onCardClick && onCardClick(item);
    }
  };

  // Handle go to profile for verification - delegate to parent
  const handleGoToProfile = () => {
    if (onGoToProfile) {
      onGoToProfile();
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (e, item) => {
    e.stopPropagation();

    if (!user) {
      setToast({
        show: true,
        message: "Please log in to add items to wishlist",
        type: "error",
      });
      return;
    }

    const result = await toggleWishlist(item);
    setToast({
      show: true,
      message: result.message,
      type: result.success ? "wishlist" : "error",
    });
  };

  // Close toast
  const closeToast = () => {
    setToast({ show: false, message: "", type: "success" });
  };

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

                    {/* Bottom section with heart only */}
                    <div className="flex items-center justify-end mb-2">
                      <button
                        className={`transition-colors flex-shrink-0 ${
                          isInWishlist(item.id || item._id)
                            ? "text-red-500 hover:text-red-600"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                        onClick={(e) => handleWishlistToggle(e, item)}
                        title={
                          isInWishlist(item.id || item._id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        {isInWishlist(item.id || item._id) ? (
                          <IoHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        ) : (
                          <IoHeartOutline className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
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
                            handleRentItem(item);
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

      {/* Toast notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={closeToast}
      />
    </section>
  );
};

export default ItemList;
