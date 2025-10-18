import React, { useState, useMemo } from "react";
import { IoClose } from "react-icons/io5";
import {
  formatCurrency,
  quickRateCalculation,
} from "../../utils/rentalCalculations";

const PaymentModal = ({ isOpen, onClose, request, onPaymentConfirm }) => {
  const [paymentMethod, setPaymentMethod] = useState("gcash");

  // Calculate rental costs using the same logic as RequestDetailsModal
  const rentalCalculation = useMemo(() => {
    if (!request || !request.item) {
      return {
        subtotal: 0,
        total: 0,
        breakdown: null,
      };
    }

    // Use the current pricing system exactly like the frontend does
    const basePrice = parseFloat(request.item.price) || 0;
    const duration = parseInt(request.durationOfRent || request.duration || 1);

    if (basePrice <= 0 || duration <= 0) {
      return {
        subtotal: 0,
        total: 0,
        breakdown: null,
      };
    }

    // Calculate final price with tax (same as displayed throughout the app)
    const finalPrice = quickRateCalculation(basePrice).finalRate;

    // Calculate rental cost (final price × days)
    const rentalCost = finalPrice * duration;

    // Calculate service fee (5% of rental cost)
    const serviceFee = rentalCost * 0.05;

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
      duration: duration,
    };

    return {
      subtotal: breakdown.totalRentalCost,
      total: breakdown.totalAmountDue,
      breakdown: breakdown,
    };
  }, [request]);

  if (!isOpen || !request) return null;

  const handlePayment = () => {
    // Get the total amount from the calculation
    const totalAmount = rentalCalculation.breakdown?.totalAmountDue || 0;

    // Navigate to respective payment gateway with total amount
    if (paymentMethod === "gcash") {
      window.open(
        `/gcash-gateway?requestId=${request.id}&totalAmount=${totalAmount}`,
        "_blank"
      );
    } else if (paymentMethod === "paymaya") {
      window.open(
        `/paymaya-gateway?requestId=${request.id}&totalAmount=${totalAmount}`,
        "_blank"
      );
    }
    onClose(); // Close the modal after opening payment gateway
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full transform transition-all flex flex-col"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
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

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Payment Summary</h4>

            {/* Item Info */}
            <div className="mb-4 pb-3 border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Item:</span>
                <span className="font-medium">
                  {request.item?.name || request.itemName || "Rental Item"}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Duration:</span>
                <span>
                  {rentalCalculation.breakdown?.duration ||
                    request.duration ||
                    1}{" "}
                  day(s)
                </span>
              </div>
            </div>

            {/* Cost Breakdown */}
            {rentalCalculation.breakdown && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">
                    Rental ({rentalCalculation.breakdown.duration} day
                    {rentalCalculation.breakdown.duration > 1 ? "s" : ""})
                  </span>
                  <span className="font-medium">
                    {formatCurrency(
                      rentalCalculation.breakdown.totalRentalCost
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-700">Service Fee (5%)</span>
                  <span className="font-medium">
                    {formatCurrency(rentalCalculation.breakdown.serviceFee)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-700">
                    Deposit ({rentalCalculation.breakdown.depositPercent}%)
                  </span>
                  <span className="font-medium">
                    {formatCurrency(rentalCalculation.breakdown.depositAmount)}
                  </span>
                </div>

                <div className="text-xs text-gray-500 italic mt-1">
                  Note: The deposit is refundable upon item return in good
                  condition.
                </div>

                <div className="border-t pt-2 mt-3 flex justify-between font-semibold text-base">
                  <span className="text-gray-900">Total Amount:</span>
                  <span className="text-[#6C4BF4]">
                    {formatCurrency(rentalCalculation.breakdown.totalAmountDue)}
                  </span>
                </div>
              </div>
            )}

            {/* Fallback for when breakdown is not available */}
            {!rentalCalculation.breakdown && (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rental Fee:</span>
                  <span>
                    {(() => {
                      const fee = request.rentalFee;
                      if (typeof fee === "string" && fee.includes("₱")) {
                        const numericValue = parseFloat(
                          fee.replace(/[^0-9.]/g, "")
                        );
                        return formatCurrency(numericValue);
                      } else if (typeof fee === "number") {
                        return formatCurrency(fee);
                      }
                      return fee || "N/A";
                    })()}
                  </span>
                </div>
                <div className="border-t pt-1 mt-2 flex justify-between font-medium">
                  <span>Total Amount:</span>
                  <span className="text-green-600">
                    {(() => {
                      const total = request.totalAmount;
                      if (typeof total === "string" && total.includes("₱")) {
                        const numericValue = parseFloat(
                          total.replace(/[^0-9.]/g, "")
                        );
                        return formatCurrency(numericValue);
                      } else if (typeof total === "number") {
                        return formatCurrency(total);
                      }
                      return total || "N/A";
                    })()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method Selection */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Choose Payment Method
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {/* GCash Payment Button */}
              <button
                onClick={() => setPaymentMethod("gcash")}
                className={`p-4 border-2 rounded-lg transition-all duration-200 flex items-center gap-4 ${
                  paymentMethod === "gcash"
                    ? "border-[#6C4BF4] bg-[#6C4BF4]/10"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <img
                  src="/src/assets/GCash-Logo.png"
                  alt="GCash"
                  className="w-10 h-10"
                />
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">GCash</div>
                  <div className="text-sm text-gray-600">
                    Pay securely using your GCash account
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 ${
                    paymentMethod === "gcash"
                      ? "border-[#6C4BF4] bg-[#6C4BF4]"
                      : "border-gray-300"
                  } flex items-center justify-center`}
                >
                  {paymentMethod === "gcash" && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </button>

              {/* PayMaya Payment Button */}
              <button
                onClick={() => setPaymentMethod("paymaya")}
                className={`p-4 border-2 rounded-lg transition-all duration-200 flex items-center gap-4 ${
                  paymentMethod === "paymaya"
                    ? "border-[#6C4BF4] bg-[#6C4BF4]/10"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <img
                  src="/src/assets/paymaya-logo.png"
                  alt="PayMaya"
                  className="w-10 h-10"
                />
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">PayMaya</div>
                  <div className="text-sm text-gray-600">
                    Pay securely using your PayMaya account
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 ${
                    paymentMethod === "paymaya"
                      ? "border-[#6C4BF4] bg-[#6C4BF4]"
                      : "border-gray-300"
                  } flex items-center justify-center`}
                >
                  {paymentMethod === "paymaya" && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Payment Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
              disabled={!paymentMethod}
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={!paymentMethod}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
