import React from "react";
import { IoClose } from "react-icons/io5";

const RequestDetailsModal = ({ isOpen, onClose, request, getActionButton }) => {
  if (!isOpen || !request) return null;

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
          <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={request.image}
              alt={request.itemName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>

          {/* Item Details */}
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                [{request.owner}] {request.itemName}
              </h4>
              <p className="text-gray-600">{request.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Duration:</span>
                <p className="text-gray-600">{request.duration}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Rental Period:
                </span>
                <p className="text-gray-600">{request.dateRange}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Rental Fee:</span>
                <p className="text-gray-600">{request.rentalFee}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Total Amount:</span>
                <p className="text-gray-600">{request.totalAmount}</p>
              </div>
            </div>

            {/* Status Timeline */}
            <div>
              <h5 className="font-medium text-gray-700 mb-2">
                Status Timeline
              </h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Request Submitted</span>
                </div>
                {request.approvedDate && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Approved {request.approvedDate}</span>
                  </div>
                )}
                {request.paymentDate && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Payment Confirmed {request.paymentDate}</span>
                  </div>
                )}
                {request.shippedDate && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Item Shipped {request.shippedDate}</span>
                  </div>
                )}
                {request.receivedDate && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Item Received {request.receivedDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Button in Modal */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
            >
              Close
            </button>
            {getActionButton && getActionButton(request)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
