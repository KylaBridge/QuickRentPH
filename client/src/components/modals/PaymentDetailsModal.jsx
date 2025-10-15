import React from "react";
import { IoClose } from "react-icons/io5";

const PaymentDetailsModal = ({
  isOpen,
  onClose,
  payment,
  getStatusDisplay,
  getPaymentMethodIcon,
  formatDate,
}) => {
  if (!isOpen || !payment) return null;

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
            Payment Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Transaction Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Transaction Summary
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">
                  Transaction ID:
                </span>
                <p className="text-gray-900">{payment.transactionId}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <div className="flex items-center gap-2 mt-1">
                  {(() => {
                    const statusInfo = getStatusDisplay(payment.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <>
                        <StatusIcon className="w-4 h-4" />
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                        >
                          {statusInfo.text}
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Item Details */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Rental Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Item:</span>
                <p className="text-gray-900">
                  [{payment.owner}] {payment.itemName}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Duration:</span>
                <p className="text-gray-900">{payment.duration}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Rental Period:
                </span>
                <p className="text-gray-900">{payment.rentalPeriod}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Payment Date:</span>
                <p className="text-gray-900">
                  {formatDate(payment.paymentDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Payment Breakdown
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Rental Fee:</span>
                <span className="text-gray-900">{payment.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Processing Fee:</span>
                <span className="text-gray-900">{payment.processingFee}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-medium">
                <span className="text-gray-900">Total Paid:</span>
                <span className="text-gray-900">{payment.totalPaid}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
            <div className="flex items-center gap-3">
              {(() => {
                const methodIcon = getPaymentMethodIcon(payment.paymentMethod);
                return methodIcon ? (
                  <img
                    src={methodIcon}
                    alt={payment.paymentMethod}
                    className="w-8 h-8 object-contain"
                  />
                ) : null;
              })()}
              <span className="text-gray-900">{payment.paymentMethod}</span>
            </div>
          </div>

          {/* Additional Info for Failed/Refunded */}
          {payment.failureReason && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Failure Reason</h4>
              <p className="text-red-600 text-sm">{payment.failureReason}</p>
            </div>
          )}

          {payment.refundDate && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Refund Information
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">
                    Refund Date:
                  </span>
                  <p className="text-gray-900">
                    {formatDate(payment.refundDate)}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Refund Amount:
                  </span>
                  <p className="text-gray-900">{payment.refundAmount}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end">
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

export default PaymentDetailsModal;
