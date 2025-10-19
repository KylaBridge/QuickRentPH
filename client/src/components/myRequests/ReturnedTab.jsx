import { useState } from "react";
import { IoEye, IoCheckmarkCircle, IoTime, IoStar, IoStarOutline,} from "react-icons/io5";
import Pagination from "../Pagination";
import RequestDetailsModal from "../modals/RequestDetailsModal";
import ReviewModal from "../modals/ReviewModal";

const ReturnedTab = ({
  userReturns = [],
  pagination,
  loading = false,
  itemsPerPage = 4, // Exactly 4 cards to fit without scrolling
}) => {
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  // Use the returns data passed from parent (already paginated)
  const returns = userReturns;

  // Use the pagination data from parent
  const displayedReturns = returns;
  const paginationProps = pagination;

  const getStatusDisplay = (status) => {
    const statusMap = {
      completed: {
        text: "Return Completed",
        color: "bg-green-100 text-green-800",
        icon: IoCheckmarkCircle,
      },
      pending_confirmation: {
        text: "Pending Confirmation",
        color: "bg-yellow-100 text-yellow-800",
        icon: IoTime,
      },
      late_return: {
        text: "Late Return",
        color: "bg-red-100 text-red-800",
        icon: IoTime,
      },
      disputed: {
        text: "Disputed",
        color: "bg-orange-100 text-orange-800",
        icon: IoTime,
      },
    };
    return (
      statusMap[status] || {
        text: status,
        color: "bg-gray-100 text-gray-800",
        icon: IoCheckmarkCircle,
      }
    );
  };

  const getConditionColor = (condition) => {
    const conditionMap = {
      excellent: "text-green-600",
      good: "text-blue-600",
      fair: "text-yellow-600",
      poor: "text-red-600",
    };
    return conditionMap[condition] || "text-gray-600";
  };

  // Map returned item to request structure for modal
  const mapReturnToRequest = (returnItem) => {
    if (!returnItem) return null;
    // Only use real timestamps, do not fallback
    let approvedAt = returnItem.approvedAt || returnItem.approvedDate || returnItem.requestApprovedDate || null;
    let paidAt = returnItem.paidAt || returnItem.paidDate || returnItem.paymentSubmittedDate || null;

    // Owner display name for status
    let ownerDisplay = "Owner";
    if (returnItem.owner && typeof returnItem.owner === "object") {
      ownerDisplay = returnItem.owner.firstName
        ? `${returnItem.owner.firstName} ${returnItem.owner.lastName}`
        : returnItem.owner.username || returnItem.owner._id || "Owner";
    } else if (returnItem.owner) {
      ownerDisplay = returnItem.owner;
    }

    // Status text override for returned_to_owner
    let statusText = returnItem.returnStatus === "completed"
      ? `Returned to ${ownerDisplay}`
      : (returnItem.returnStatus || "");

    return {
      // Status mapping
      status: returnItem.returnStatus === "completed" ? "returned_to_owner" : returnItem.returnStatus,
      statusText,
      approvedAt,
      paidAt,
      shippedDate: returnItem.shippedDate,
      receivedDate: returnItem.receivedDate,
      returnedDate: returnItem.returnDate,
      cancelledDate: returnItem.cancelledDate,
      rejectedDate: returnItem.rejectedDate,
      createdAt: returnItem.createdAt,
      item: {
        name: returnItem.itemName,
        price: returnItem.price,
        images: returnItem.image ? [returnItem.image] : [],
        description: returnItem.description,
        depositPercent: returnItem.depositPercent,
        downpayment: returnItem.downpayment,
      },
      owner: returnItem.owner,
      durationOfRent: returnItem.duration,
      preferredStartDate: returnItem.preferredStartDate,
      cost: returnItem.cost,
      image: returnItem.image,
    };
  };

  const openModal = (returnItem) => {
    setSelectedReturn(mapReturnToRequest(returnItem));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReturn(null);
  };

  const openReviewModal = (returnItem) => {
    setSelectedReturn(returnItem);
    setRating(0);
    setReview("");
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedReturn(null);
    setRating(0);
    setReview("");
  };

  const submitReview = () => {
    console.log("Submitting review:", {
      rating,
      review,
      itemId: selectedReturn.id,
    });
    // This will be connected to the actual API later
    closeReviewModal();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const StarRating = ({ rating, onRatingChange, readonly = false }) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onRatingChange && onRatingChange(star)}
            className={`${
              readonly ? "" : "hover:scale-110"
            } transition-transform`}
          >
            {star <= rating ? (
              <IoStar className="w-3 h-3 text-yellow-400" />
            ) : (
              <IoStarOutline className="w-3 h-3 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C4BF4]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      {/* <div className="flex items-center justify-end">
        <p className="text-xs text-gray-600">
          {returns.length} completed rentals
        </p>
      </div> */}

      {/* Returns Content - No scrolling, exactly 4 items */}
      <div className="flex-1 space-y-4">
        {/* Returns List */}
        {returns.length === 0 ? (
          <div className="text-center py-12">
            <IoCheckmarkCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No returned items found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedReturns.map((returnItem) => {
              const statusInfo = getStatusDisplay(returnItem.returnStatus);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={returnItem.id}
                  className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openModal(returnItem)}
                >
                  <div className="flex items-center justify-between">
                    {/* Left Side - Item Info */}
                    <div className="flex items-center space-x-3">
                      {/* Item Image */}
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={returnItem.image}
                          alt={returnItem.itemName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-size='8'%3ENo Image%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          [{returnItem.owner}] {returnItem.itemName}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {returnItem.duration} • Returned:{" "}
                          {formatDate(returnItem.returnDate)}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <StatusIcon className="w-3 h-3" />
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                          >
                            {statusInfo.text}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">
                            <span
                              className={`font-medium ${getConditionColor(
                                returnItem.condition
                              )}`}
                            >
                              {returnItem.condition}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Actions and Review */}
                    <div className="flex items-center space-x-2">
                      {/* Review Section */}
                      {returnItem.hasReviewed ? (
                        <div className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <StarRating
                              rating={returnItem.userRating}
                              readonly
                            />
                          </div>
                        </div>
                      ) : (
                        returnItem.returnStatus === "completed" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openReviewModal(returnItem);
                            }}
                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors font-medium"
                          >
                            Review
                          </button>
                        )
                      )}

                      {/* Total Amount */}
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Total</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {returnItem.totalPaid}
                        </div>
                      </div>

                      {/* View Details Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(returnItem);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <IoEye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination - Fixed at bottom */}
      <div className="mt-4">
        <Pagination
          currentPage={paginationProps.currentPage}
          totalPages={paginationProps.totalPages}
          totalItems={paginationProps.totalItems}
          startIndex={paginationProps.startIndex}
          endIndex={paginationProps.endIndex}
          onPageChange={paginationProps.goToPage}
          itemName="returned items"
          maxVisiblePages={5}
        />
      </div>

      {/* Return Details Modal */}
      <RequestDetailsModal
        isOpen={showModal}
        onClose={closeModal}
        request={selectedReturn}
        getActionButton={() => null}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={closeReviewModal}
        request={selectedReturn}
        onReviewSubmit={(id, reviewData) => {
          console.log("Submitting review:", { id, reviewData });
          closeReviewModal();
        }}
      />
    </div>
  );
};

export default ReturnedTab;
