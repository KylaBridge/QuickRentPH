import React from "react";
import { IoClose, IoDownload } from "react-icons/io5";
import {
  formatCurrency,
  quickRateCalculation,
} from "../../utils/rentalCalculations";

const ReceiptModal = ({
  isOpen,
  onClose,
  request,
  paymentData,
  onReturnItem,
}) => {
  if (!isOpen || !request || !paymentData) return null;

  // Calculate rental costs using the same logic as PaymentModal
  const calculateRentalBreakdown = () => {
    if (!request || !request.item) {
      return null;
    }

    const basePrice = parseFloat(request.item.price) || 0;
    const duration = parseInt(request.durationOfRent || request.duration || 1);

    if (basePrice <= 0 || duration <= 0) {
      return null;
    }

    // Calculate final price with tax
    const finalPrice = quickRateCalculation(basePrice).finalRate;
    const rentalCost = finalPrice * duration;
    const serviceFee = rentalCost * 0.05;
    const depositPercent =
      request.item?.depositPercent || request.item?.downpayment || 50;
    const depositAmount = (rentalCost * depositPercent) / 100;
    const totalAmountDue = rentalCost + serviceFee + depositAmount;

    return {
      basePrice,
      finalPrice,
      rentalCost: Math.round(rentalCost * 100) / 100,
      serviceFee: Math.round(serviceFee * 100) / 100,
      depositAmount: Math.round(depositAmount * 100) / 100,
      depositPercent,
      totalAmountDue: Math.round(totalAmountDue * 100) / 100,
      duration,
    };
  };

  const breakdown = calculateRentalBreakdown();
  const transactionId = `QR${Date.now()}${Math.random()
    .toString(36)
    .substr(2, 5)
    .toUpperCase()}`;
  const transactionDate = new Date(paymentData.timestamp).toLocaleString();

  const downloadReceipt = () => {
    const receiptContent = `
QUICKRENT PAYMENT RECEIPT
========================

Transaction ID: ${transactionId}
Date: ${transactionDate}
Payment Method: ${paymentData.paymentMethod.toUpperCase()}

RENTAL DETAILS
--------------
Item: ${request.item?.name || request.itemName || "Rental Item"}
Duration: ${breakdown?.duration || 1} day(s)
Request ID: #${request.id}

COST BREAKDOWN
--------------
Rental Cost (${breakdown?.duration || 1} day${
      (breakdown?.duration || 1) > 1 ? "s" : ""
    }): ${formatCurrency(breakdown?.rentalCost || 0)}
Service Fee (5%): ${formatCurrency(breakdown?.serviceFee || 0)}
Deposit (${breakdown?.depositPercent || 50}%): ${formatCurrency(
      breakdown?.depositAmount || 0
    )}

TOTAL AMOUNT PAID: ${formatCurrency(breakdown?.totalAmountDue || 0)}

STATUS: PAYMENT COMPLETED ✓

Note: The deposit is refundable upon item return in good condition.

Thank you for using QuickRent!
Visit us at: www.quickrent.ph
    `.trim();

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `QuickRent_Receipt_${transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-lg w-full transform transition-all flex flex-col"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Payment Successful!
              </h3>
              <p className="text-sm text-gray-600">Transaction completed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Transaction Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">
              Transaction Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono font-medium">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium">{transactionDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <div className="flex items-center gap-2">
                  <img
                    src={
                      paymentData.paymentMethod === "gcash"
                        ? "/src/assets/GCash-Logo.png"
                        : "/src/assets/paymaya-logo.png"
                    }
                    alt={paymentData.paymentMethod}
                    className="w-5 h-5"
                  />
                  <span className="font-medium capitalize">
                    {paymentData.paymentMethod}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">✓ Completed</span>
              </div>
            </div>
          </div>

          {/* Rental Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">
              Rental Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Item:</span>
                <span className="font-medium">
                  {request.item?.name || request.itemName || "Rental Item"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">
                  {breakdown?.duration || 1} day(s)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Request ID:</span>
                <span className="font-mono font-medium">#{request.id}</span>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          {breakdown && (
            <div className="border border-gray-200 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">
                Payment Breakdown
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">
                    Rental ({breakdown.duration} day
                    {breakdown.duration > 1 ? "s" : ""})
                  </span>
                  <span className="font-medium">
                    {formatCurrency(breakdown.rentalCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Service Fee (5%)</span>
                  <span className="font-medium">
                    {formatCurrency(breakdown.serviceFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">
                    Deposit ({breakdown.depositPercent}%)
                  </span>
                  <span className="font-medium">
                    {formatCurrency(breakdown.depositAmount)}
                  </span>
                </div>
                <div className="border-t pt-2 mt-3 flex justify-between font-semibold text-base">
                  <span className="text-gray-900">Total Paid:</span>
                  <span className="text-green-600">
                    {formatCurrency(breakdown.totalAmountDue)}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500 italic mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                💡 The deposit is refundable upon item return in good condition.
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">
              ✅ What's Next?
            </h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Your payment has been processed successfully</li>
              <li>• The item owner will be notified</li>
              <li>• Coordinate pickup/delivery with the owner</li>
              <li>
                • Return the item in good condition to get your deposit back
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 px-6 py-4 flex gap-3 flex-shrink-0">
          <button
            onClick={downloadReceipt}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <IoDownload className="w-5 h-5" />
            Download Receipt
          </button>
          <button
            onClick={() => {
              onReturnItem(request.id);
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
          >
            Mark as Received
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
