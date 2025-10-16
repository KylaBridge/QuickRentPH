import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { formatCurrency } from "../../utils/rentalCalculations";

const PaymentModal = ({ isOpen, onClose, request, onPaymentConfirm }) => {
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !request) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      onPaymentConfirm(request.id, paymentMethod);
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
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

        <div className="p-6 space-y-4">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Item:</span>
                <span className="font-medium">{request.itemName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span>{request.duration}</span>
              </div>
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
                    return fee;
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
                    return total;
                  })()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
            <div className="space-y-2">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="gcash"
                  checked={paymentMethod === "gcash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600"
                />
                <img
                  src="/src/assets/GCash-Logo.png"
                  alt="GCash"
                  className="w-8 h-8 ml-3 mr-2"
                />
                <span>GCash</span>
              </label>

              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="paymaya"
                  checked={paymentMethod === "paymaya"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600"
                />
                <img
                  src="/src/assets/paymaya-logo.png"
                  alt="PayMaya"
                  className="w-8 h-8 ml-3 mr-2"
                />
                <span>PayMaya</span>
              </label>

              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="mastercard"
                  checked={paymentMethod === "mastercard"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600"
                />
                <img
                  src="/src/assets/Mastercard-logo.svg.png"
                  alt="Mastercard"
                  className="w-8 h-8 ml-3 mr-2"
                />
                <span>Mastercard</span>
              </label>
            </div>
          </div>

          {/* Payment Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
