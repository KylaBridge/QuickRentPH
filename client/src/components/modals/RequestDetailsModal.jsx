import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoClose,
  IoChevronBack,
  IoChevronForward,
  IoEye,
} from "react-icons/io5";
import { getImageUrl } from "../../utils/imageUtils";
import { useImageCarousel } from "../../hooks/useImageCarousel";
import {
  calculateRentalBreakdown,
  formatCurrency as formatCurrencyUtil,
  quickRateCalculation,
} from "../../utils/rentalCalculations";

const RequestDetailsModal = ({ isOpen, onClose, request, getActionButton }) => {
  const navigate = useNavigate();

  // Build images array (support populated item.images, request.images, single image fields)
  const rawImages = useMemo(() => {
    if (!request) return [];
    if (
      request.item &&
      Array.isArray(request.item.images) &&
      request.item.images.length
    )
      return request.item.images;
    if (Array.isArray(request.images) && request.images.length)
      return request.images;
    if (request.image) return [request.image];
    if (request.itemImage) return [request.itemImage];
    return [];
  }, [request]);

  const images = useMemo(
    () =>
      rawImages.map((img) => (img ? getImageUrl(img) : null)).filter(Boolean),
    [rawImages]
  );

  const {
    currentImage,
    imageLoaded,
    goToPrev,
    goToNext,
    hasMultipleImages,
    totalImages,
  } = useImageCarousel(images);

  // Duration and dates - calculate this before other useMemo hooks
  const duration = request?.durationOfRent || request?.duration || 1;

  // Calculate rental costs using centralized calculations
  const rentalCalculation = useMemo(() => {
    if (!request) return { subtotal: 0, total: 0 };

    if (request.cost) {
      // Use existing cost structure if available
      return {
        subtotal: request.cost.subtotal || 0,
        total: request.cost.total || 0,
      };
    }

    // Calculate using centralized logic
    if (request.item?.price && duration) {
      const basePrice = Number(request.item.price);
      const days = Number(duration);
      if (basePrice > 0 && days > 0) {
        const finalPrice = quickRateCalculation(basePrice).finalRate;
        const breakdown = calculateRentalBreakdown(finalPrice, days);
        return {
          subtotal: breakdown.totalRentalCost,
          total: breakdown.totalAmountDue,
        };
      }
    }

    // Fallback values
    return {
      subtotal: request.rentalFee || 0,
      total: request.totalAmount || 0,
    };
  }, [request, duration]);

  // Early return AFTER all hooks are called
  if (!isOpen || !request) return null;

  const ownerDisplay =
    request.owner && typeof request.owner === "object"
      ? request.owner.firstName
        ? `${request.owner.firstName} ${request.owner.lastName}`
        : request.owner.username || request.owner._id || "Owner"
      : request.owner || "Owner";

  const imageSrc = images.length > 0 ? images[currentImage] : null;

  const itemName = request.item?.name || request.itemName || "Requested Item";
  const description = request.item?.description || request.description || "";

  // Duration and dates
  let startDate = null;
  let endDate = null;
  let dateRange = "";
  if (request.preferredStartDate) {
    startDate = new Date(request.preferredStartDate);
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + Math.max(0, Number(duration) - 1));
    const fmt = (d) => d.toLocaleDateString();
    dateRange = `${fmt(startDate)} - ${fmt(endDate)}`;
  } else if (request.dateRange) {
    dateRange = request.dateRange;
  }

  // Fees
  const rentalFeeValue = rentalCalculation.subtotal;
  const totalValue = rentalCalculation.total;

  const formatCurrency = (v) => {
    if (v == null) return "-";
    return formatCurrencyUtil(v);
  };

  const handleViewItem = () => {
    // Get the item ID from the request
    const itemId = request.item?._id || request.item?.id || request.itemId;
    if (itemId) {
      onClose(); // Close the modal first
      // Navigate to items-for-rent page and pass the item ID as state
      navigate("/items-for-rent", {
        state: {
          viewItemId: itemId,
          item: request.item,
        },
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Request Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Item Image */}
          <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={itemName}
                className={`w-full h-full object-cover transition-opacity duration-200 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            {hasMultipleImages && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrev();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 rounded-full p-2 shadow"
                >
                  <IoChevronBack className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 rounded-full p-2 shadow"
                >
                  <IoChevronForward className="w-5 h-5" />
                </button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/80 text-xs text-gray-800 px-2 py-1 rounded">
                  {currentImage + 1} / {totalImages}
                </div>
              </>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                [{ownerDisplay}] {itemName}
              </h4>
              <p className="text-gray-600">{description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Duration:</span>
                <p className="text-gray-600">{duration} day(s)</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Rental Period:
                </span>
                <p className="text-gray-600">{dateRange || "TBD"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Rental Fee:</span>
                <p className="text-gray-600">
                  {formatCurrency(rentalFeeValue)}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Total Amount:</span>
                <p className="text-gray-600">{formatCurrency(totalValue)}</p>
              </div>
            </div>

            {/* Status Timeline */}
            <div>
              <h5 className="font-medium text-gray-700 mb-2">
                Status Timeline
              </h5>
              <div className="space-y-2 text-sm">
                {request.status === "cancelled" ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>
                      Request Cancelled
                      {request.cancelledDate
                        ? ` • ${request.cancelledDate}`
                        : ""}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Request Submitted</span>
                  </div>
                )}
                {request.approvedDate && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Approved {request.approvedDate}</span>
                  </div>
                )}
                {request.paymentDate && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Payment Confirmed {request.paymentDate}</span>
                  </div>
                )}
                {request.shippedDate && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Item Shipped {request.shippedDate}</span>
                  </div>
                )}
                {request.receivedDate && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Item Received {request.receivedDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Button in Modal - keep modal-level actions local to avoid cross-component render helpers */}
          <div className="flex justify-end space-x-3">
            {/* Show "View Item" button if the request is cancelled */}
            {request.status === "cancelled" && (
              <button
                onClick={handleViewItem}
                className="flex items-center gap-2 px-4 py-2 text-white bg-[#6C4BF4] rounded-lg hover:bg-[#5B3FD8] transition-colors duration-200 font-medium"
              >
                <IoEye className="w-4 h-4" />
                View Item
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
