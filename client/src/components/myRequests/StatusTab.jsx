import { useState, useEffect } from "react";
import { useRental } from "../../context/rentalContext";
import { IoEye, IoCash, IoCheckmarkCircle, IoClose } from "react-icons/io5";
import { getImageUrl } from "../../utils/imageUtils";
import Pagination from "../Pagination";
import RequestDetailsModal from "../modals/RequestDetailsModal";
import PaymentModal from "../modals/PaymentModal";
import ReceiptModal from "../modals/ReceiptModal";

const StatusTab = ({
  userRequests = [],
  pagination,
  onUpdateRequest,
  loading = false,
  itemsPerPage = 4, // Exactly 4 cards to fit without scrolling
}) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  // Use the requests data passed from parent (already paginated)
  const requests = userRequests;

  // Use the pagination data from parent
  const displayedRequests = requests;
  const paginationProps = pagination;

  // Listen for payment completion messages from gateway windows
  useEffect(() => {
    const handlePaymentMessage = (event) => {
      // Only accept messages from the same origin for security
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === "PAYMENT_COMPLETED") {
        const { data } = event.data;
        console.log("Payment completed:", data);

        // Update the request status to paid
        if (onUpdateRequest) {
          onUpdateRequest(data.requestId, "pay");
        }

        // Show receipt modal
        setPaymentData(data);
        setSelectedRequest(requests.find((req) => req.id === data.requestId));
        setShowReceiptModal(true);
      }
    };

    window.addEventListener("message", handlePaymentMessage);
    return () => window.removeEventListener("message", handlePaymentMessage);
  }, [requests, onUpdateRequest]);

  const getStatusDisplay = (status) => {
    const statusMap = {
      pending: {
        text: "Pending Approval",
        color: "bg-yellow-100 text-yellow-800",
      },
      approved: { text: "Approved", color: "bg-green-100 text-green-800" },
      paid: { text: "Payment Confirmed", color: "bg-blue-100 text-blue-800" },
      shipped: { text: "Item Shipped", color: "bg-purple-100 text-purple-800" },
      received: {
        text: "Item Received",
        color: "bg-indigo-100 text-indigo-800",
      },
      pending_return: {
        text: "Pending Return",
        color: "bg-orange-100 text-orange-800",
      },
      returned: { text: "Returned", color: "bg-gray-100 text-gray-800" },
      cancelled: { text: "Cancelled", color: "bg-red-100 text-red-800" },
    };
    return (
      statusMap[status] || { text: status, color: "bg-gray-100 text-gray-800" }
    );
  };

  const getActionButton = (request) => {
    switch (request.status) {
      case "pending":
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction(request.id, "cancel");
            }}
            className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs font-medium"
            disabled={cancellingIds.has(request.id)}
          >
            {cancellingIds.has(request.id) ? (
              <svg
                className="animate-spin h-3 w-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              <>
                <IoClose className="w-3 h-3" /> Cancel
              </>
            )}
          </button>
        );
      case "cancelled":
        return null;
      case "approved":
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRequest(request);
              setShowPaymentModal(true);
            }}
            className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs font-medium"
          >
            <IoCash className="w-3 h-3" />
            Pay
          </button>
        );
      case "shipped":
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction(request.id, "mark_received");
            }}
            className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-medium"
          >
            <IoCheckmarkCircle className="w-3 h-3" />
            Received
          </button>
        );
      case "pending_return":
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction(request.id, "mark_shipped");
            }}
            className="flex items-center gap-1 px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-xs font-medium"
          >
            <IoCheckmarkCircle className="w-3 h-3" />
            Shipped
          </button>
        );
      default:
        return null;
    }
  };

  const handleAction = (requestId, action) => {
    console.log(`Action: ${action} for request: ${requestId}`);
    // This will be connected to the actual API later
    if (action === "cancel") {
      // cancel handled via rental context
      handleCancel(requestId);
      return;
    }

    if (onUpdateRequest) {
      onUpdateRequest(requestId, action);
    }
  };

  const { cancelRental } = useRental();
  const [cancellingIds, setCancellingIds] = useState(new Set());

  const handleCancel = async (requestId) => {
    try {
      setCancellingIds((s) => new Set(s).add(requestId));
      await cancelRental(requestId);
      // inform parent so it can refresh the list or update state
      if (onUpdateRequest) onUpdateRequest(requestId, "cancel");
    } catch (err) {
      console.error("Failed to cancel rental", err);
      // optionally show UI feedback here
    } finally {
      setCancellingIds((s) => {
        const next = new Set(s);
        next.delete(requestId);
        return next;
      });
    }
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedRequest(null);
  };

  const handlePaymentConfirm = (requestId, paymentMethod) => {
    console.log(
      `Payment confirmed for request ${requestId} with ${paymentMethod}`
    );
    // Update request status to paid
    if (onUpdateRequest) {
      onUpdateRequest(requestId, "pay");
    }
  };

  const closeReceiptModal = () => {
    setShowReceiptModal(false);
    setSelectedRequest(null);
    setPaymentData(null);
  };

  const handleReturnItem = (requestId) => {
    console.log(`Marking item as received for request ${requestId}`);
    // Update request status to received
    if (onUpdateRequest) {
      onUpdateRequest(requestId, "receive");
    }
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
      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">No rental requests found</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 space-y-4">
            {displayedRequests.map((request) => {
              const statusInfo = getStatusDisplay(request.status);
              const requestId = request._id || request.id;
              // owner can be an object populated from the API; render a readable name
              const ownerDisplay =
                request.owner && typeof request.owner === "object"
                  ? request.owner.firstName
                    ? `${request.owner.firstName} ${request.owner.lastName}`
                    : request.owner.username || request.owner._id || "Owner"
                  : request.owner || "Owner";

              // Item name and image fallbacks (support populated item)
              const itemName =
                (request.item &&
                  typeof request.item === "object" &&
                  request.item.name) ||
                request.itemName ||
                request.item ||
                "Requested Item";

              const rawImage =
                request.image ||
                (request.item &&
                  request.item.images &&
                  request.item.images[0]) ||
                "";
              const imageSrc = rawImage ? getImageUrl(rawImage) : "";

              // Duration and date range fallbacks
              const duration =
                request.durationOfRent ||
                request.duration ||
                request.durationDays ||
                1;
              let dateRange = request.dateRange || "";
              if (!dateRange && request.preferredStartDate) {
                try {
                  const start = new Date(request.preferredStartDate);
                  const end = new Date(start);
                  end.setDate(
                    start.getDate() + Math.max(0, Number(duration) - 1)
                  );
                  const fmt = (d) => d.toLocaleDateString();
                  dateRange = `${fmt(start)} - ${fmt(end)}`;
                } catch (e) {
                  dateRange = request.dateRange || "";
                }
              }

              return (
                <div
                  key={requestId}
                  className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openModal(request)}
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

                      {/* Item Details (only owner and item name) */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          [{ownerDisplay}] {itemName}
                        </h4>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-gray-500 font-medium">
                            Status:
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                          >
                            {statusInfo.text}
                          </span>
                          {request.approvedDate && (
                            <span className="text-xs text-gray-400">
                              • {request.approvedDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex items-center space-x-2">
                      {/* Message Owner Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(`Message owner: ${ownerDisplay}`);
                        }}
                        className="px-2 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors text-xs font-medium"
                      >
                        Message
                      </button>

                      {/* Action Button */}
                      {getActionButton({ ...request, id: requestId })}
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
            itemName="requests"
            maxVisiblePages={5}
          />
        </div>
      )}

      {/* Request Details Modal */}
      <RequestDetailsModal
        isOpen={showModal}
        onClose={closeModal}
        request={selectedRequest}
        getActionButton={getActionButton}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={closePaymentModal}
        request={selectedRequest}
        onPaymentConfirm={handlePaymentConfirm}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={closeReceiptModal}
        request={selectedRequest}
        paymentData={paymentData}
        onReturnItem={handleReturnItem}
      />
    </div>
  );
};

export default StatusTab;
