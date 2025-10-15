import React from "react";
import { IoClose } from "react-icons/io5";

const RentalDetailsModal = ({ isOpen, onClose, rental, getActionButton }) => {
  if (!isOpen || !rental) return null;

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
            Rental Details
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
              src={rental.image}
              alt={rental.itemName}
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
                {rental.itemName}
              </h4>
              <p className="text-gray-600">{rental.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Renter:</span>
                <p className="text-gray-600">{rental.renter}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Duration:</span>
                <p className="text-gray-600">{rental.duration}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Rental Period:
                </span>
                <p className="text-gray-600">{rental.dateRange}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Total Amount:</span>
                <p className="text-gray-600">{rental.totalAmount}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    rental.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : rental.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : rental.status === "Completed"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {rental.status}
                </span>
              </div>
              {rental.paymentStatus && (
                <div>
                  <span className="font-medium text-gray-700">
                    Payment Status:
                  </span>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      rental.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {rental.paymentStatus}
                  </span>
                </div>
              )}
            </div>

            {/* Status Timeline */}
            <div>
              <h5 className="font-medium text-gray-700 mb-2">
                Rental Timeline
              </h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Request Received</span>
                </div>
                {rental.approvedDate && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Approved {rental.approvedDate}</span>
                  </div>
                )}
                {rental.paymentDate && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Payment Received {rental.paymentDate}</span>
                  </div>
                )}
                {rental.shippedDate && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Item Shipped {rental.shippedDate}</span>
                  </div>
                )}
                {rental.deliveredDate && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Item Delivered {rental.deliveredDate}</span>
                  </div>
                )}
                {rental.completedDate && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Rental Completed {rental.completedDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-2">
                Contact Information
              </h5>
              <div className="text-sm text-gray-600">
                <p>Renter: {rental.renter}</p>
                {rental.renterEmail && <p>Email: {rental.renterEmail}</p>}
                {rental.renterPhone && <p>Phone: {rental.renterPhone}</p>}
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
            {getActionButton && getActionButton(rental)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalDetailsModal;
