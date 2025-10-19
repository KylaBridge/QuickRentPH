import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../axios";

const GCashGateway = () => {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("requestId");
  const totalAmount = parseFloat(searchParams.get("totalAmount")) || 0;
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentInterface, setShowPaymentInterface] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setShowPaymentInterface(true);
    }, 3000); // 3 seconds loading

    return () => clearTimeout(loadingTimer);
  }, []);

  const handlePaymentComplete = async () => {
    // Send payment completion data back to parent window
    const paymentData = {
      requestId,
      paymentMethod: "gcash",
      status: "completed",
      paymentDate: new Date().toISOString(),
      totalAmount,
    };

    // Record escrow payment on server (subtotal as amount)
    try {
      await api.post("/api/payments", {
        requestId,
        paymentMethod: "gcash",
        totalPaid: totalAmount,
      });
      // Update rental status to 'paid'
      await api.patch(`/api/rentals/${requestId}/status`, {
        status: "paid"
      });
    } catch (e) {
      console.warn("Failed to record payment or update rental status", e);
    }

    // If opened in a new window, send message to parent
    if (window.opener) {
      window.opener.postMessage(
        {
          type: "PAYMENT_COMPLETED",
          data: paymentData,
        },
        window.location.origin
      );
      window.close();
    } else {
      // Fallback: redirect back to the main app
      window.location.href = `/?payment=success&requestId=${requestId}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* GCash Header */}
        <div className="text-center mb-8">
          <img
            src="/src/assets/GCash-Logo.png"
            alt="GCash"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">GCash Payment</h1>
          <p className="text-gray-600 mt-2">Secure and convenient payment</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Connecting to GCash...</p>
            <p className="text-sm text-gray-500 mt-2">
              Please wait while we set up your payment
            </p>
          </div>
        )}

        {/* Payment Interface */}
        {showPaymentInterface && (
          <div className="space-y-6">
            {/* Transaction Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                Transaction Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Request ID:</span>
                  <span className="font-medium">#{requestId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium text-blue-600">
                    ₱
                    {totalAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">
                    Ready to Pay
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Simulation */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-800">
                  Payment gateway connected
                </span>
              </div>
              <p className="text-sm text-blue-700">
                This is a demo payment gateway. In a real scenario, you would
                authenticate with your GCash account and authorize the payment.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handlePaymentComplete}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg"
              >
                ✓ Confirm Payment
              </button>

              <button
                onClick={() => window.close()}
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel Payment
              </button>
            </div>

            {/* Security Info */}
            <div className="text-center text-xs text-gray-500 pt-4 border-t">
              🔒 Your payment is secured with 256-bit SSL encryption
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GCashGateway;
