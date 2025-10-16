import { useState } from "react";
import { IoClose, IoCheckmarkCircle, IoDownload } from "react-icons/io5";
import { getImageUrl } from "../../utils/imageUtils";
import {
  calculateRentalBreakdown,
  formatCurrency,
  quickRateCalculation,
} from "../../utils/rentalCalculations";

const RentalRequestReviewModal = ({
  isOpen,
  onClose,
  reservation,
  onApprove,
  onReject,
}) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [showValidId, setShowValidId] = useState(false);
  const [showProofOfBilling, setShowProofOfBilling] = useState(false);

  if (!isOpen || !reservation) return null;

  // Extract reservation details
  const renterInfo = reservation.renter || {};
  const itemInfo = reservation.item || {};

  // Renter display name
  const renterName = renterInfo.firstName
    ? `${renterInfo.firstName} ${renterInfo.lastName}`
    : renterInfo.username || "Renter";

  // Item details
  const itemName = itemInfo.name || reservation.itemName || "Rental Item";
  const itemImages = itemInfo.images || [reservation.image] || [];
  const itemDescription = itemInfo.description || "";
  const itemCategory = itemInfo.category || "";

  // Daily rate - get base rate and calculate final rate with tax
  const baseRate =
    itemInfo.dailyRate ||
    itemInfo.price ||
    reservation.dailyRate ||
    reservation.itemPrice ||
    reservation.pricePerDay ||
    (reservation.totalAmount && reservation.durationOfRent
      ? Math.round(reservation.totalAmount / reservation.durationOfRent)
      : 0) ||
    0;

  // Calculate final rate with tax (same as displayed in app)
  const finalRate = quickRateCalculation(baseRate).finalRate;

  // Rental details
  const duration = reservation.durationOfRent || reservation.duration || 1;
  const startDate = reservation.startDate || reservation.preferredStartDate;
  const rentalReason =
    reservation.rentalReason || reservation.reasonForRenting || "";

  // Get deposit percentage (default to 50% if not specified)
  const depositPercent =
    reservation.depositPercent || itemInfo.depositPercent || 50;

  // Use centralized calculation system with final rate (no double taxation)
  const rentalBreakdown = calculateRentalBreakdown(
    finalRate,
    duration,
    depositPercent
  );

  const handleApprove = () => {
    if (onApprove) {
      onApprove(reservation._id || reservation.id);
    }
    onClose();
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      if (onReject) {
        onReject(reservation._id || reservation.id, rejectionReason);
      }
      setRejectionReason("");
      setShowRejectionForm(false);
      onClose();
    }
  };

  const downloadFile = async (fileUrl, fileName) => {
    if (!fileUrl) return;

    try {
      const imageUrl = getImageUrl(fileUrl);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Rental Request Details
            </h2>
            <p className="text-sm text-gray-600">
              Request from {renterName} for {itemName} • Status:{" "}
              {reservation.status}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Item & Rental Info */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Item Details */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="font-semibold text-gray-900 mb-2">Item Details</h3>
              <div className="space-y-2">
                <img
                  src={getImageUrl(itemImages[0])}
                  alt={itemName}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml,%3Csvg width='200' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="text-sm">
                  <p>
                    <span className="font-medium">Name:</span> {itemName}
                  </p>
                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {itemCategory || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Base Rate:</span>
                    {baseRate > 0
                      ? ` ${formatCurrency(baseRate)}`
                      : " Not specified"}
                  </p>
                  <p>
                    <span className="font-medium">Daily Rate (incl. tax):</span>
                    {rentalBreakdown.dailyRate.final > 0
                      ? ` ${formatCurrency(rentalBreakdown.dailyRate.final)}`
                      : " Not specified"}
                  </p>
                  <p>
                    <span className="font-medium">Description:</span>{" "}
                    {itemDescription || "No description"}
                  </p>
                </div>
              </div>
            </div>

            {/* Rental Request */}
            <div className="bg-blue-50 rounded-lg p-3">
              <h3 className="font-semibold text-gray-900 mb-2">
                Rental Request
              </h3>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Start Date:</span>{" "}
                  {startDate
                    ? new Date(startDate).toLocaleDateString()
                    : "Not specified"}
                </p>
                <p>
                  <span className="font-medium">Duration:</span> {duration} day
                  {duration > 1 ? "s" : ""}
                </p>
                <p>
                  <span className="font-medium">End Date:</span>{" "}
                  {startDate
                    ? new Date(
                        new Date(startDate).setDate(
                          new Date(startDate).getDate() + duration - 1
                        )
                      ).toLocaleDateString()
                    : "Not specified"}
                </p>
                <p>
                  <span className="font-medium">Reason:</span>{" "}
                  {rentalReason || "No reason provided"}
                </p>
                <p>
                  <span className="font-medium">Total Amount:</span>{" "}
                  {formatCurrency(rentalBreakdown.totalAmountDue)}
                </p>
              </div>
            </div>
          </div>

          {/* Renter Information */}
          <div className="bg-green-50 rounded-lg p-3">
            <h3 className="font-semibold text-gray-900 mb-2">
              Renter Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Name:</span> {renterName}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {renterInfo.email || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {reservation.phone || renterInfo.phone || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Contact Name:</span>{" "}
                  {reservation.contactName || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {reservation.completeAddress ||
                    renterInfo.address ||
                    "No address provided"}
                </p>
                <p>
                  <span className="font-medium">City:</span>{" "}
                  {reservation.city || "N/A"}
                </p>
                <p>
                  <span className="font-medium">State/Province:</span>{" "}
                  {reservation.stateProvince || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Join Date:</span>{" "}
                  {renterInfo.createdAt
                    ? new Date(renterInfo.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Identity Verification */}
          <div className="bg-yellow-50 rounded-lg p-3">
            <h3 className="font-semibold text-gray-900 mb-2">
              Identity Verification
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p>
                  <span className="font-medium">ID Collection Agreed:</span>{" "}
                  {reservation.idCollectionAgreed ? "Yes" : "No"}
                </p>

                {reservation.validId && (
                  <div>
                    <p className="font-medium mb-1">Valid ID Document:</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowValidId(true)}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          downloadFile(
                            reservation.validId,
                            `${renterName.replace(/\s+/g, "_")}_ValidID.jpg`
                          )
                        }
                        className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 flex items-center space-x-1"
                      >
                        <IoDownload className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {reservation.selfieWithId && (
                  <div>
                    <p className="font-medium mb-1">Selfie with ID:</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          downloadFile(
                            reservation.selfieWithId,
                            `${renterName.replace(
                              /\s+/g,
                              "_"
                            )}_SelfieWithID.jpg`
                          )
                        }
                        className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 flex items-center space-x-1"
                      >
                        <IoDownload className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                )}

                {reservation.proofOfBilling && (
                  <div>
                    <p className="font-medium mb-1">Proof of Billing:</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowProofOfBilling(true)}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          downloadFile(
                            reservation.proofOfBilling,
                            `${renterName.replace(
                              /\s+/g,
                              "_"
                            )}_ProofOfBilling.jpg`
                          )
                        }
                        className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 flex items-center space-x-1"
                      >
                        <IoDownload className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="bg-purple-50 rounded-lg p-3">
            <h3 className="font-semibold text-gray-900 mb-2">
              Payment Breakdown
            </h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>
                  Rental Cost ({duration} day{duration > 1 ? "s" : ""} ×{" "}
                  {formatCurrency(rentalBreakdown.dailyRate.final)})
                </span>
                <span>{formatCurrency(rentalBreakdown.totalRentalCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit ({depositPercent}%)</span>
                <span>{formatCurrency(rentalBreakdown.depositAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee (5%)</span>
                <span>{formatCurrency(rentalBreakdown.serviceFee)}</span>
              </div>
              <div className="border-t pt-1 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Amount Due</span>
                  <span>{formatCurrency(rentalBreakdown.totalAmountDue)}</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Platform Earnings:</span>
                    <span>
                      {formatCurrency(rentalBreakdown.platformEarnings)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Owner Receivable:</span>
                    <span>
                      {formatCurrency(rentalBreakdown.ownerReceivable)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deposit (Refundable):</span>
                    <span>
                      {formatCurrency(rentalBreakdown.refundableDeposit)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer - Always visible for sticky action buttons */}
        <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
          {reservation.status === "pending_review" ||
          reservation.status === "pending" ? (
            !showRejectionForm ? (
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRejectionForm(true)}
                  className="px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors text-sm"
                >
                  Reject Request
                </button>
                <button
                  onClick={handleApprove}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
                >
                  <IoCheckmarkCircle className="w-4 h-4" />
                  <span>Approve Request</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  rows="2"
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowRejectionForm(false);
                      setRejectionReason("");
                    }}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!rejectionReason.trim()}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            )
          ) : (
            // For non-pending statuses, show only close button
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Valid ID Modal */}
      {showValidId && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
          onClick={() => setShowValidId(false)}
        >
          <div
            className="bg-white rounded-lg p-4 max-w-2xl max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Valid ID Document</h3>
              <button
                onClick={() => setShowValidId(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>
            <img
              src={getImageUrl(reservation.validId)}
              alt="Valid ID"
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                e.target.src =
                  "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280'%3EID Image Not Available%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>
      )}

      {/* Proof of Billing Modal */}
      {showProofOfBilling && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
          onClick={() => setShowProofOfBilling(false)}
        >
          <div
            className="bg-white rounded-lg p-4 max-w-2xl max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Proof of Billing</h3>
              <button
                onClick={() => setShowProofOfBilling(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>
            <img
              src={getImageUrl(reservation.proofOfBilling)}
              alt="Proof of Billing"
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                e.target.src =
                  "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280'%3EBilling Image Not Available%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalRequestReviewModal;
