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

  // Calculate rental costs - completely refactored to use current pricing system
  const rentalCalculation = useMemo(() => {
    if (!request || !request.item) {
      return {
        subtotal: 0,
        total: 0,
        breakdown: null,
      };
    }

    // Debug log to see what request data we have
    console.log("Request data:", {
      item: request.item,
      duration: duration,
      depositPercent: request.item?.depositPercent,
      downpayment: request.item?.downpayment,
    });

    // Use the current pricing system exactly like the frontend does
    const basePrice = parseFloat(request.item.price) || 0;
    const days = parseInt(duration) || 1;

    if (basePrice <= 0 || days <= 0) {
      return {
        subtotal: 0,
        total: 0,
        breakdown: null,
      };
    }

    // Calculate final price with tax (same as displayed throughout the app)
    const finalPrice = quickRateCalculation(basePrice).finalRate;

    // Calculate rental cost (final price × days)
    const rentalCost = finalPrice * days;

    // Calculate service fee (5% of rental cost)
    const serviceFee = rentalCost * 0.05; // BUSINESS_RATES.SERVICE_FEE_RATE

    // Get deposit percentage from item (where it's actually stored)
    const depositPercent =
      request.item?.depositPercent || request.item?.downpayment || 50;

    // Calculate deposit amount
    const depositAmount = (rentalCost * depositPercent) / 100;

    // Calculate total amount due
    const totalAmountDue = rentalCost + serviceFee + depositAmount;

    // Create proper breakdown structure
    const breakdown = {
      totalRentalCost: Math.round(rentalCost * 100) / 100,
      serviceFee: Math.round(serviceFee * 100) / 100,
      depositAmount: Math.round(depositAmount * 100) / 100,
      depositPercent: depositPercent,
      totalAmountDue: Math.round(totalAmountDue * 100) / 100,
      platformEarnings: Math.round(serviceFee * 100) / 100, // Platform gets the service fee
      ownerReceivable: Math.round(rentalCost * 100) / 100,
      refundableDeposit: Math.round(depositAmount * 100) / 100,
      duration: days,
      dailyRate: {
        base: basePrice,
        final: finalPrice,
      },
    };

    console.log("Calculated breakdown:", breakdown);

    return {
      subtotal: breakdown.totalRentalCost,
      total: breakdown.totalAmountDue,
      breakdown: breakdown,
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
            </div>

            {/* Detailed Cost Breakdown */}
            {rentalCalculation.breakdown && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3">
                  Cost Breakdown
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">
                      Rental ({duration} day{duration > 1 ? "s" : ""})
                    </span>
                    <span className="font-medium">
                      {formatCurrency(
                        rentalCalculation.breakdown.totalRentalCost
                      )}
                    </span>
                  </div>

                  {/* Show service fee if available and non-zero */}
                  {rentalCalculation.breakdown.serviceFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Service Fee (5%)</span>
                      <span className="font-medium">
                        {formatCurrency(rentalCalculation.breakdown.serviceFee)}
                      </span>
                    </div>
                  )}

                  {/* Show deposit if available and non-zero */}
                  {rentalCalculation.breakdown.depositAmount > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-700">
                          Deposit ({rentalCalculation.breakdown.depositPercent}
                          %)
                        </span>
                        <span className="font-medium">
                          {formatCurrency(
                            rentalCalculation.breakdown.depositAmount
                          )}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 italic mt-1">
                        Note: The deposit is refundable and will be returned
                        once the item is confirmed returned in good condition.
                      </div>
                    </>
                  )}

                  <hr className="border-gray-300 my-2" />
                  <div className="flex justify-between font-semibold text-base">
                    <span className="text-[#6C4BF4]">Total</span>
                    <span className="text-[#6C4BF4]">
                      {formatCurrency(
                        rentalCalculation.breakdown.totalAmountDue
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Fallback for when detailed breakdown is not available */}
            {!rentalCalculation.breakdown && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3">
                  Payment Summary
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Rental Fee:</span>
                    <span className="font-medium">
                      {formatCurrency(rentalCalculation.subtotal)}
                    </span>
                  </div>
                  <hr className="border-gray-300 my-2" />
                  <div className="flex justify-between font-semibold text-base">
                    <span className="text-[#6C4BF4]">Total Amount:</span>
                    <span className="text-[#6C4BF4]">
                      {formatCurrency(rentalCalculation.total)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Status Timeline */}
            <div>
              <h5 className="font-medium text-gray-700 mb-3">
                Status:{" "}
                <span className="text-[#6C4BF4] capitalize">
                  {request.status?.replace("_", " ") || "Unknown"}
                </span>
              </h5>
              <h6 className="font-medium text-gray-700 mb-2 text-sm">
                Status Timeline
              </h6>
              <div className="space-y-3 text-sm">
                {/* Request Submitted */}
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Request Submitted</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {request.createdAt ? new Date(request.createdAt).toLocaleString() : "Date not available"}
                    </div>
                  </div>
                </div>

                {/* Approved */}
                {request.approvedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Request Approved</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {new Date(request.approvedAt).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Owner has approved your rental request. You can now proceed with payment.</div>
                    </div>
                  </div>
                )}

                {/* Payment Made */}
                {request.paidAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Payment Submitted</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {new Date(request.paidAt).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">You have submitted payment. Waiting for owner confirmation.</div>
                    </div>
                  </div>
                )}

                {/* Item Shipped */}
                {request.shippedDate && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Item Shipped</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {new Date(request.shippedDate).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Item is on its way to you.</div>
                    </div>
                  </div>
                )}

                {/* Item Received */}
                {request.receivedDate && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Item Received</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {new Date(request.receivedDate).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">You have confirmed receipt of the item.</div>
                    </div>
                  </div>
                )}

                {/* Shipping for Return */}
                {(request.status === "shipping_for_return" || request.status === "returned_to_owner") && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Shipping for Return</div>
                      <div className="text-xs text-gray-500 mt-0.5">Item is being shipped back to the owner.</div>
                    </div>
                  </div>
                )}

                {/* Returned to Owner */}
                {request.status === "returned_to_owner" && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Returned to Owner</div>
                      <div className="text-xs text-gray-500 mt-0.5">Item has been returned and rental is complete.</div>
                    </div>
                  </div>
                )}

                {/* Cancelled */}
                {request.status === "cancelled" && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Request Cancelled</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {request.cancelledDate ? new Date(request.cancelledDate).toLocaleString() : "Cancellation date not available"}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{request.cancellationReason || "Request has been cancelled."}</div>
                    </div>
                  </div>
                )}

                {/* Rejected */}
                {request.status === "rejected" && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Request Rejected</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {request.rejectedDate ? new Date(request.rejectedDate).toLocaleString() : "Rejection date not available"}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{request.rejectionReason || "Owner has rejected your request."}</div>
                    </div>
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
