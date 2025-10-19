import { useImageCarousel } from "../hooks/useImageCarousel";
import { usePagination } from "../hooks/usePagination";
import { getPostedDate } from "../utils/dateUtils";
import { DEFAULT_TERMS } from "../utils/placeholderUtils";
import {
  quickRateCalculation,
  formatCurrency,
} from "../utils/rentalCalculations";
import {
  IoChevronBack,
  IoLocationOutline,
  IoCalendarOutline,
  IoChatbubbleOutline,
  IoChevronForward,
  IoChevronDown,
  IoStarSharp,
  IoStarOutline,
} from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { getImageUrl } from "../utils/imageUtils";
import { useMemo, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import ConfirmationModal from "./modals/ConfirmationModal";
import { useRental } from "../context/rentalContext";

const REVIEWS_PER_PAGE = 3;

const ItemDetailView = ({ item, onBack, onRentClick, onGoToProfile }) => {
  if (!item) return null;

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);


  // Check if current user owns this item
  const isOwnItem =
    user && (item.owner === user._id || item.owner?._id === user._id);

  // Check if user already requested this item for rent
  // Prefer server-checked flag (in case item.rentals isn't populated client-side)
  const [hasRequestedServer, setHasRequestedServer] = useState(false);
  const [checkingRequested, setCheckingRequested] = useState(true);


  // Only consider rentals with active statuses
  const ACTIVE_RENTAL_STATUSES = [
    "pending",
    "approved",
    "paid",
    "shipped",
    "received",
    "shipping_for_return"
  ];
  const hasRequestedLocal =
    user && Array.isArray(item.rentals)
      ? item.rentals.some(
          (r) =>
            (r.renter === user._id || r.renter?._id === user._id) &&
            ACTIVE_RENTAL_STATUSES.includes(r.status)
        )
      : false;

  // Combined result used by UI
  const hasRequested = hasRequestedLocal || hasRequestedServer;

  const { getUserRentals } = useRental();

  useEffect(() => {
    let mounted = true;
    // If no user or local flag already true, skip server check
    if (!user || hasRequestedLocal) {
      setCheckingRequested(false);
      return () => {
        mounted = false;
      };
    }

    const fetchUserRentals = async () => {
      try {
        setCheckingRequested(true);
        const res = await getUserRentals();
        const rentals = res?.rentals || [];
        const found = rentals.some((r) => {
          const itemId = r.item?._id || r.item;
          const renterId = r.renter?._id || r.renter;
          return (
            itemId &&
            (itemId === item._id || itemId.toString() === item._id) &&
            renterId &&
            (renterId === user._id || renterId.toString() === user._id) &&
            ACTIVE_RENTAL_STATUSES.includes(r.status)
          );
        });
        if (mounted) setHasRequestedServer(found);
      } catch (e) {
        // ignore errors, default to false
      } finally {
        if (mounted) setCheckingRequested(false);
      }
    };

    fetchUserRentals();

    return () => {
      mounted = false;
    };
  }, [user, item._id, hasRequestedLocal]);

  // Form states
  const [rentalDetails, setRentalDetails] = useState({
    startDate: "",
    endDate: "",
    addressId: "",
    recipientName: "",
    recipientPhone: "",
    deliveryType: "pickup",
    notes: "",
  });

  const [paymentData, setPaymentData] = useState({
    method: "",
    termsAccepted: false,
    breakdown: {
      rentalDays: 0,
      rentalCost: 0,
      serviceFee: 0,
      taxes: 0,
      total: 0,
    },
  });

  const [transactionResult, setTransactionResult] = useState(null);



  // Modal state for prompting verification
  const [promptVerifyAccount, setPromptVerifyAccount] = useState(false);

  // Handle rent button click
  const handleRentClick = () => {
    if (isOwnItem) {
      return; // Do nothing if user owns the item
    }
    if (!user || !user.isVerified) {
      setPromptVerifyAccount(true);
      return;
    }
    // Prepare item data with pre-calculated deposit info
    const itemWithDepositInfo = {
      ...item,
      depositPercent: downpaymentInfo?.depositPercent || 50,
      depositAmount: downpaymentInfo?.depositAmount || 0,
      finalPrice: (() => {
        const basePrice = parseFloat(item.price) || 0;
        return quickRateCalculation(basePrice).finalRate;
      })(),
    };
    // Navigate directly to rental flow page with enhanced item data
    navigate(`/rental-flow/${item._id}`, {
      state: { item: itemWithDepositInfo },
    });
  };

  // Handle go to profile for verification - delegate to parent
  const handleGoToProfile = () => {
    if (onGoToProfile) {
      onGoToProfile();
    }
  };

  // Process images - handle both new and legacy formats with memoization
  const images = useMemo(() => {
    if (item.images && item.images.length > 0) {
      return item.images.map((img) =>
        typeof img === "string" && img.startsWith("http")
          ? img
          : getImageUrl(img)
      );
    }
    return [item.image].filter(Boolean);
  }, [item.images, item.image]);

  // Use our custom hooks
  const carousel = useImageCarousel(images);
  const reviewsPagination = usePagination(item.reviews || [], REVIEWS_PER_PAGE);

  // Helper function to get downpayment display
  const getDownpaymentDisplay = () => {
    const depositPercent = item.downpayment || item.depositPercent || 50; // Default to 50%
    const basePrice = parseFloat(item.price) || 0;

    if (basePrice <= 0) {
      return null;
    }

    // Calculate final price with tax (same as displayed price)
    const finalPrice = quickRateCalculation(basePrice).finalRate;

    // Calculate deposit amount based on percentage of final price
    const depositAmount = (finalPrice * depositPercent) / 100;

    return {
      amount: formatCurrency(depositAmount),
      percentage: `${depositPercent}%`,
      depositPercent: depositPercent, // Store for passing to RentalFlow
      depositAmount: depositAmount, // Store actual amount for passing to RentalFlow
    };
  };

  const downpaymentInfo = getDownpaymentDisplay();

  // Map AddItem fields to display data
  const itemData = {
    name: item.name || item.title,
    category: item.category,
    price: (() => {
      const basePrice = parseFloat(item.price) || 0;
      const finalPrice = quickRateCalculation(basePrice).finalRate;
      return formatCurrency(finalPrice);
    })(),
    dealOption: item.dealOption,
    location: item.location,
    size: item.size,
    color: item.color,
    description: item.description,
    includedAccessories: item.includedAccessories,
    pickupLocation: item.pickupLocation,
    deliveryOption: item.deliveryOption,
    customTerms: item.customTerms,
    postedDate: getPostedDate(item),
    createdAt: item.createdAt,
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      {/* Prompt modal to verify account before renting */}
      <ConfirmationModal
        isOpen={promptVerifyAccount}
        onClose={() => setPromptVerifyAccount(false)}
        onConfirm={() => {
          setPromptVerifyAccount(false);
          navigate("/profile");
        }}
        title="Verify your account"
        message="You need to verify your account before renting items."
        confirmText="Go to Verification"
        cancelText="Cancel"
        type="info"
      />
      <div className="max-w-7xl mx-auto">
        {/* Sticky Go Back Button */}
        <div className="sticky top-0 z-20 bg-gray-50 pt-2 pb-2">
          <button
            onClick={onBack}
            className="text-[#6C4BF4] text-sm flex items-center gap-2 px-3 py-1"
          >
            <IoChevronBack className="w-4 h-4" />
            Go Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
          {/* Image Gallery Panel */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 lg:col-span-2 flex flex-col">
            <div className="relative h-64 md:h-80 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
              {/* Loading indicator */}
              {(carousel.isTransitioning || !carousel.imageLoaded) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C4BF4]"></div>
                </div>
              )}

              {/* Counter */}
              {carousel.hasMultipleImages && (
                <div className="absolute left-2 top-2 text-xs text-gray-700 bg-white/70 rounded px-2 py-0.5 shadow z-20">
                  {carousel.currentImage + 1}/{carousel.totalImages}
                </div>
              )}

              <img
                src={images[carousel.currentImage]}
                alt={itemData.name}
                className={`w-full h-full object-contain transition-opacity duration-300 ease-in-out ${
                  carousel.isTransitioning || !carousel.imageLoaded
                    ? "opacity-0"
                    : "opacity-100"
                }`}
                onLoad={() => {
                  // This ensures the image is visible once it's fully loaded
                  if (!carousel.isTransitioning) {
                    // Image loaded successfully
                  }
                }}
                onError={() => {
                  console.error(
                    "Failed to load image:",
                    images[carousel.currentImage]
                  );
                }}
              />

              {/* Prev Button */}
              {carousel.hasMultipleImages && (
                <button
                  className={`absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#6C4BF4] rounded-full p-2 shadow transition-all duration-200 z-30 ${
                    carousel.isTransitioning || !carousel.imageLoaded
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-110 hover:shadow-lg"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!carousel.isTransitioning && carousel.imageLoaded) {
                      carousel.goToPrev();
                    }
                  }}
                  disabled={carousel.isTransitioning || !carousel.imageLoaded}
                  tabIndex={0}
                >
                  {carousel.isTransitioning ? (
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-[#6C4BF4] border-t-transparent"></div>
                  ) : (
                    <IoChevronBack className="w-5 h-5" />
                  )}
                </button>
              )}

              {/* Next Button */}
              {carousel.hasMultipleImages && (
                <button
                  className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#6C4BF4] rounded-full p-2 shadow transition-all duration-200 z-30 ${
                    carousel.isTransitioning || !carousel.imageLoaded
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-110 hover:shadow-lg"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!carousel.isTransitioning && carousel.imageLoaded) {
                      carousel.goToNext();
                    }
                  }}
                  disabled={carousel.isTransitioning || !carousel.imageLoaded}
                  tabIndex={0}
                >
                  {carousel.isTransitioning ? (
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-[#6C4BF4] border-t-transparent"></div>
                  ) : (
                    <IoChevronForward className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>

            {/* Dot Indicators */}
            {carousel.hasMultipleImages && (
              <div className="mt-3 flex items-center justify-center gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (
                        !carousel.isTransitioning &&
                        carousel.imageLoaded &&
                        idx !== carousel.currentImage
                      ) {
                        carousel.goToImage(idx);
                      }
                    }}
                    disabled={
                      carousel.isTransitioning ||
                      !carousel.imageLoaded ||
                      carousel.currentImage === idx
                    }
                    className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                      carousel.currentImage === idx
                        ? "bg-[#6C4BF4] scale-110"
                        : carousel.isTransitioning || !carousel.imageLoaded
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-gray-300 hover:bg-gray-400 hover:scale-125"
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Item Information Below Image */}
            <div className="mt-4">
              {/* Location, Deal Option, Posted Date Row - All in one line */}
              <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                {/* Location */}
                <div className="flex items-center gap-1">
                  <IoLocationOutline className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{itemData.location}</span>
                </div>

                {/* Deal Option */}
                {itemData.dealOption && (
                  <div className="flex items-center gap-1">
                    <TbTruckDelivery className="w-4 h-4 text-gray-500" />
                    <span className="text-[#6C4BF4] font-medium">
                      {itemData.dealOption}
                    </span>
                  </div>
                )}

                {/* Posted Date */}
                <div className="flex items-center gap-1">
                  <IoCalendarOutline className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{itemData.postedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">{itemData.name}</h2>
            <p className="text-sm text-gray-600">{itemData.category}</p>

            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-[#6C4BF4]">
                {itemData.price}
              </span>
              <span className="text-sm text-gray-500">/ day</span>
            </div>

            {/* Product Specifications from AddItem */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Specification
              </h3>

              {itemData.size && (
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Size/Dimensions:</span>{" "}
                  {itemData.size}
                </div>
              )}

              {itemData.color && (
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Color:</span> {itemData.color}
                </div>
              )}

              {itemData.description && (
                <div className="text-sm text-gray-700">
                  <span className="font-medium">General Description:</span>
                  <p className="mt-1 text-gray-600">{itemData.description}</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              {!isOwnItem ? (
                hasRequested ? (
                  <div className="flex-1 bg-gray-100 text-gray-500 font-semibold rounded py-2 text-center">
                    You have already requested to rent this item
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleRentClick}
                      className="flex-1 bg-[#6C4BF4] hover:bg-[#7857FD] text-white font-semibold rounded py-2 transition-colors"
                    >
                      RENT NOW
                    </button>
                    <button className="bg-[#6C4BF4] hover:bg-[#7857FD] text-white rounded py-2 px-3 transition-colors">
                      <IoChatbubbleOutline className="w-5 h-5" />
                    </button>
                  </>
                )
              ) : (
                <div className="flex-1 bg-gray-100 text-gray-500 font-semibold rounded py-2 text-center">
                  This is your item
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {/* Included Accessories */}
          {itemData.includedAccessories && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Included Accessories</h3>
              <div className="text-sm text-gray-700">
                {itemData.includedAccessories}
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Terms and Conditions</h3>
            <div className="text-sm text-gray-700 space-y-1">
              {DEFAULT_TERMS.map((term, index) => (
                <div key={index}>
                  {term.label && term.value
                    ? `• ${term.label}: ${term.value}`
                    : `• ${term.label || term}`}
                </div>
              ))}

              {itemData.customTerms && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <div className="font-medium">Additional Terms:</div>
                  <div className="mt-1">{itemData.customTerms}</div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Booking Details</h3>
            <div className="text-sm text-gray-700 space-y-2">
              {downpaymentInfo && (
                <div>
                  <span className="font-medium">Deposit Required:</span>{" "}
                  <span className="text-[#6C4BF4] font-semibold">
                    {downpaymentInfo.amount}
                    {downpaymentInfo.percentage && (
                      <span className="text-gray-500 text-xs ml-1">
                        ({downpaymentInfo.percentage})
                      </span>
                    )}
                  </span>
                </div>
              )}

              {itemData.pickupLocation && (
                <div>
                  <span className="font-medium">Pickup Location:</span>{" "}
                  {itemData.pickupLocation}
                </div>
              )}

              {itemData.deliveryOption && (
                <div>
                  <span className="font-medium">Delivery Option:</span>{" "}
                  {itemData.deliveryOption}
                </div>
              )}

              <div>
                <span className="font-medium">Payment Methods:</span>{" "}
                <span className="inline-flex items-center gap-2">
                  <span className="text-blue-600">GCash</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-green-600">PayMaya</span>
                </span>
              </div>

              {itemData.createdAt && (
                <div>
                  <span className="font-medium">Listed on:</span>{" "}
                  <span className="text-gray-600">
                    {new Date(itemData.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section - Last on mobile */}
        <div className="mt-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Reviews & Ratings</h3>
            <div className="text-sm text-gray-700 space-y-3">
              {reviewsPagination.currentItems.map((review, idx) => (
                <div
                  key={idx}
                  className="border-b border-gray-100 pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0"
                >
                  <div className="font-semibold text-gray-800">
                    {review.user}
                  </div>
                  <div className="text-xs text-yellow-400 flex">
                    {[...Array(5)].map((_, i) =>
                      i < review.rating ? (
                        <IoStarSharp key={i} className="w-3 h-3" />
                      ) : (
                        <IoStarOutline key={i} className="w-3 h-3" />
                      )
                    )}
                  </div>
                  <div>{review.comment}</div>
                </div>
              ))}
              {reviewsPagination.totalItems === 0 && (
                <div className="text-gray-400 italic">No reviews yet.</div>
              )}
            </div>

            {/* Pagination Controls */}
            {reviewsPagination.totalPages > 1 && (
              <div className="flex justify-end items-center gap-2 mt-2">
                <button
                  className="px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                  onClick={reviewsPagination.goToPrevPage}
                  disabled={!reviewsPagination.hasPrevPage}
                >
                  Prev
                </button>
                <span className="text-xs text-gray-500">
                  Page {reviewsPagination.currentPage} of{" "}
                  {reviewsPagination.totalPages}
                </span>
                <button
                  className="px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                  onClick={reviewsPagination.goToNextPage}
                  disabled={!reviewsPagination.hasNextPage}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailView;
