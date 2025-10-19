import { useState } from "react";
import { IoEye } from "react-icons/io5";
import { getImageUrl } from "../../utils/imageUtils";
import Pagination from "../Pagination";
import RentalRequestReviewModal from "../modals/RentalRequestReviewModal";

const ReservedTab = ({
  userReservations = [],
  pagination,
  onUpdateReservation,
  loading = false,
  itemsPerPage = 4, // Exactly 4 cards to fit without scrolling
}) => {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Use the reservations data passed from parent (already paginated)
  const reservations = userReservations;

  // Use the pagination data from parent
  const displayedReservations = reservations;
  const paginationProps = pagination;

  // Use consistent status mapping as in StatusTab
  const getStatusDisplay = (status) => {
    const statusMap = {
      pending: { text: "Pending Approval", color: "bg-yellow-100 text-yellow-800" },
      approved: { text: "Approved", color: "bg-green-100 text-green-800" },
      paid: { text: "Payment Confirmed", color: "bg-blue-100 text-blue-800" },
      shipped: { text: "Item Shipped", color: "bg-purple-100 text-purple-800" },
      received: { text: "Item Received", color: "bg-indigo-100 text-indigo-800" },
      shipping_for_return: { text: "Shipping for Return", color: "bg-pink-100 text-pink-800" },
      returned_to_owner: { text: "Returned to Owner", color: "bg-gray-200 text-gray-800" },
      pending_return: { text: "Pending Return", color: "bg-orange-100 text-orange-800" },
      returned: { text: "Returned", color: "bg-gray-100 text-gray-800" },
      cancelled: { text: "Cancelled", color: "bg-red-100 text-red-800" },
      rejected: { text: "Rejected", color: "bg-red-100 text-red-800" },
    };
    return (
      statusMap[status] || { text: status, color: "bg-gray-100 text-gray-800" }
    );
  };

  const getActionButton = (reservation) => {
    // If status is 'paid', show Ship button for lender
    if (reservation.status === 'paid') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onUpdateReservation) {
              onUpdateReservation(reservation._id || reservation.id, 'shipped');
            }
          }}
          className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs font-medium"
        >
          Ship
        </button>
      );
    }
    // If status is 'shipping_for_return', show Returned button for lender
    if (reservation.status === 'shipping_for_return') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onUpdateReservation) {
              onUpdateReservation(reservation._id || reservation.id, 'returned_to_owner');
            }
          }}
          className="flex items-center gap-1 px-2 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors text-xs font-medium"
        >
          Returned
        </button>
      );
    }
    // Default: show View Details button
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          openReviewModal(reservation);
        }}
        className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-medium"
      >
        <IoEye className="w-3 h-3" />
        View Details
      </button>
    );
  };

  const openReviewModal = (reservation) => {
    const rawImage =
      reservation.image ||
      (reservation.item &&
        reservation.item.images &&
        reservation.item.images[0]) ||
      "";

    const enhancedReservation = {
      ...reservation,
      // Make sure the image data is available in the modal
      image: rawImage,
      // Ensure item object has images array if it exists
      item: reservation.item
        ? {
            ...reservation.item,
            images: reservation.item.images || (rawImage ? [rawImage] : []),
          }
        : {
            images: rawImage ? [rawImage] : [],
          },
    };

    setSelectedReservation(enhancedReservation);
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedReservation(null);
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
      {/* Reservations List */}
      {reservations.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">No rental requests found</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 space-y-4">
            {displayedReservations.map((reservation) => {
              const statusInfo = getStatusDisplay(reservation.status);
              const reservationId = reservation._id || reservation.id;

              // Renter info display
              const renterDisplay =
                reservation.renter && typeof reservation.renter === "object"
                  ? reservation.renter.firstName
                    ? `${reservation.renter.firstName} ${reservation.renter.lastName}`
                    : reservation.renter.username ||
                      reservation.renter._id ||
                      "Renter"
                  : reservation.renter || "Renter";

              // Item name and image
              const itemName =
                (reservation.item &&
                  typeof reservation.item === "object" &&
                  reservation.item.name) ||
                reservation.itemName ||
                reservation.item ||
                "Rental Item";

              const rawImage =
                reservation.image ||
                (reservation.item &&
                  reservation.item.images &&
                  reservation.item.images[0]) ||
                "";
              const imageSrc = rawImage ? getImageUrl(rawImage) : "";

              // Duration and date range
              const duration =
                reservation.durationOfRent ||
                reservation.duration ||
                reservation.durationDays ||
                1;

              let dateRange = reservation.dateRange || "";
              if (!dateRange && reservation.startDate) {
                try {
                  const start = new Date(reservation.startDate);
                  const end = new Date(start);
                  end.setDate(
                    start.getDate() + Math.max(0, Number(duration) - 1)
                  );
                  const fmt = (d) => d.toLocaleDateString();
                  dateRange = `${fmt(start)} - ${fmt(end)}`;
                } catch (e) {
                  dateRange = reservation.dateRange || "";
                }
              }

              return (
                <div
                  key={reservationId}
                  className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openReviewModal(reservation)}
                >
                  <div className="flex items-center justify-between">
                    {/* Left Side - Item Info */}
                    <div className="flex items-center space-x-3">
                      {/* Item Image */}
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={imageSrc}
                          alt={itemName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-size='8'%3ENo Image%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>

                      {/* Reservation Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          [{renterDisplay}] {itemName}
                        </h4>
                        <p className="text-xs text-gray-600 truncate">
                          {dateRange && `${dateRange} • `}
                          {duration} day{duration > 1 ? "s" : ""}
                          {reservation.totalAmount &&
                            ` • ₱${reservation.totalAmount}`}
                        </p>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                          >
                            {statusInfo.text}
                            {reservation.requestedDate &&
                              ` • ${reservation.requestedDate}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex items-center space-x-2">
                      {/* Message Renter Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(`Message renter: ${renterDisplay}`);
                        }}
                        className="px-2 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors text-xs font-medium"
                      >
                        Message
                      </button>

                      {/* Action Button */}
                      {getActionButton({ ...reservation, id: reservationId })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={paginationProps.currentPage}
            totalPages={paginationProps.totalPages}
            totalItems={paginationProps.totalItems}
            startIndex={paginationProps.startIndex}
            endIndex={paginationProps.endIndex}
            onPageChange={paginationProps.goToPage}
            itemName="reservations"
            maxVisiblePages={5}
          />
        </div>
      )}

      {/* Rental Request Review Modal */}
      <RentalRequestReviewModal
        isOpen={showReviewModal}
        onClose={closeReviewModal}
        reservation={selectedReservation}
        onApprove={(reservationId) =>
          onUpdateReservation && onUpdateReservation(reservationId, "approve")
        }
        onReject={(reservationId, reason) =>
          onUpdateReservation &&
          onUpdateReservation(reservationId, "reject", reason)
        }
      />
    </div>
  );
};

export default ReservedTab;
