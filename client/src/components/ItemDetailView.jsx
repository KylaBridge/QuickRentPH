import { useImageCarousel } from "../hooks/useImageCarousel";
import { usePagination } from "../hooks/usePagination";
import { getPostedDate } from "../utils/dateUtils";
import { DEFAULT_TERMS } from "../utils/placeholderUtils";
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

const REVIEWS_PER_PAGE = 3;

const ItemDetailView = ({ item, onBack }) => {
  if (!item) return null;

  // Process images - handle both new and legacy formats
  const images =
    item.images && item.images.length > 0
      ? item.images.map((img) =>
          typeof img === "string" && img.startsWith("http")
            ? img
            : getImageUrl(img)
        )
      : [item.image].filter(Boolean);

  // Use our custom hooks
  const carousel = useImageCarousel(images);
  const reviewsPagination = usePagination(item.reviews || [], REVIEWS_PER_PAGE);

  // Map AddItem fields to display data
  const itemData = {
    name: item.name || item.title,
    category: item.category,
    price: item.price ? `₱${parseFloat(item.price).toFixed(2)}` : "",
    dealOption: item.dealOption,
    location: item.location,
    size: item.size,
    color: item.color,
    description: item.description,
    includedAccessories: item.includedAccessories,
    downpayment: item.downpayment
      ? `₱${parseFloat(item.downpayment).toFixed(2)}`
      : "",
    pickupLocation: item.pickupLocation,
    paymentMethod: item.paymentMethod,
    deliveryOption: item.deliveryOption,
    customTerms: item.customTerms,
    postedDate: getPostedDate(item),
    availability: item.availability || "Available",
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
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
            <div
              className="relative h-64 md:h-80 bg-gray-100 rounded flex items-center justify-center overflow-hidden"
              onMouseLeave={carousel.stopAutoSlide}
            >
              {/* Counter */}
              {carousel.hasMultipleImages && (
                <div className="absolute left-2 top-2 text-xs text-gray-700 bg-white/70 rounded px-2 py-0.5 shadow">
                  {carousel.currentImage + 1}/{carousel.totalImages}
                </div>
              )}

              <img
                src={images[carousel.currentImage]}
                alt={itemData.name}
                className="w-full h-full object-contain transition-all duration-200"
              />

              {/* Prev Button */}
              {carousel.hasMultipleImages && (
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#6C4BF4] rounded-full p-2 shadow"
                  onClick={carousel.goToPrev}
                  onMouseEnter={() => carousel.startAutoSlide("prev")}
                  onMouseLeave={carousel.stopAutoSlide}
                  tabIndex={0}
                >
                  <IoChevronBack className="w-5 h-5" />
                </button>
              )}

              {/* Next Button */}
              {carousel.hasMultipleImages && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#6C4BF4] rounded-full p-2 shadow"
                  onClick={carousel.goToNext}
                  onMouseEnter={() => carousel.startAutoSlide("next")}
                  onMouseLeave={carousel.stopAutoSlide}
                  tabIndex={0}
                >
                  <IoChevronForward className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Dot Indicators */}
            {carousel.hasMultipleImages && (
              <div className="mt-3 flex items-center justify-center gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => carousel.goToImage(idx)}
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${
                      carousel.currentImage === idx
                        ? "bg-[#6C4BF4]"
                        : "bg-gray-300"
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

            <div className="text-sm text-gray-700">
              <span className="font-medium">Availability:</span>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  itemData.availability === "Available"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {itemData.availability}
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 bg-[#6C4BF4] hover:bg-[#7857FD] text-white font-semibold rounded py-2 transition-colors">
                RENT NOW
              </button>
              <button className="bg-[#6C4BF4] hover:bg-[#7857FD] text-white rounded py-2 px-3 transition-colors">
                <IoChatbubbleOutline className="w-5 h-5" />
              </button>
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
              {itemData.downpayment && (
                <div>
                  <span className="font-medium">Downpayment Required:</span>{" "}
                  <span className="text-[#6C4BF4] font-semibold">
                    {itemData.downpayment}
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

              {itemData.paymentMethod && (
                <div>
                  <span className="font-medium">Payment Methods:</span>{" "}
                  {itemData.paymentMethod}
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
