import { useState, useEffect } from "react";
import api from "../../axios";
import { IoEye, IoCard, IoCheckmarkCircle, IoTime, IoWarning, } from "react-icons/io5";
import Pagination from "../Pagination";
import PaymentDetailsModal from "../modals/PaymentDetailsModal";


const PaymentsTab = ({
  itemsPerPage = 10, // Customizable items per page for table view
}) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch payments on mount
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/api/payments");
        // If payments are nested in res.data.payments, use that
        setPayments(res.data.payments || []);
      } catch (err) {
        setError("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // Pagination logic
  const totalItems = payments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const displayedPayments = payments.slice(startIndex, endIndex);
  const paginationProps = {
    currentPage,
    totalPages,
    totalItems,
    startIndex: startIndex + 1,
    endIndex,
    goToPage: setCurrentPage,
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      completed: {
        text: "Completed",
        color: "bg-green-100 text-green-800",
        icon: IoCheckmarkCircle,
      },
      pending: {
        text: "Pending",
        color: "bg-yellow-100 text-yellow-800",
        icon: IoTime,
      },
      failed: {
        text: "Failed",
        color: "bg-red-100 text-red-800",
        icon: IoWarning,
      },
      refunded: {
        text: "Refunded",
        color: "bg-blue-100 text-blue-800",
        icon: IoCheckmarkCircle,
      },
      processing: {
        text: "Processing",
        color: "bg-purple-100 text-purple-800",
        icon: IoTime,
      },
    };
    return (
      statusMap[status] || {
        text: status,
        color: "bg-gray-100 text-gray-800",
        icon: IoCard,
      }
    );
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case "gcash":
        return "/src/assets/GCash-Logo.png";
      case "paymaya":
        return "/src/assets/paymaya-logo.png";
      case "credit card":
      case "mastercard":
        return "/src/assets/Mastercard-logo.svg.png";
      default:
        return null;
    }
  };

  const openModal = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPayment(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C4BF4]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      {/* <div className="flex items-center justify-end">
        <p className="text-xs text-gray-600">
          {payments.length} total payments
        </p>
      </div> */}

      {/* Payments Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {/* Payments List */}
        {payments.length === 0 ? (
          <div className="text-center py-12">
            <IoCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No payment history found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedPayments.map((payment) => {
                    const statusInfo = getStatusDisplay(payment.status);
                    const StatusIcon = statusInfo.icon;
                    const methodIcon = getPaymentMethodIcon(payment.paymentMethod);

                    return (
                      <tr key={payment._id || payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {/* Display payment _id instead of transactionId */}
                              {payment._id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.duration}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {/* Display item name if available, fallback to id */}
                              {payment.rental && payment.rental.item && payment.rental.item.name
                                ? payment.rental.item.name
                                : (typeof payment.rental?.item === 'string' ? payment.rental.item : 'Item')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {/* Format rentalPeriod if it's a date string */}
                              {(() => {
                                if (!payment.rentalPeriod) return "-";
                                const d = new Date(payment.rentalPeriod);
                                // If valid date, format it, else show as is
                                return isNaN(d.getTime())
                                  ? payment.rentalPeriod
                                  : d.toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    });
                              })()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {payment.totalPaid}
                            </div>
                            <div className="text-sm text-gray-500">
                              Rental: {payment.amount}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {methodIcon && (
                              <img
                                src={methodIcon}
                                alt={payment.paymentMethod}
                                className="w-6 h-6 object-contain"
                              />
                            )}
                            <span className="text-sm text-gray-900">
                              {payment.paymentMethod}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="w-4 h-4" />
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                            >
                              {statusInfo.text}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(payment.paymentDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => openModal(payment)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <IoEye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Pagination - Fixed at bottom */}
      <div className="mt-4">
        <Pagination
          currentPage={paginationProps.currentPage}
          totalPages={paginationProps.totalPages}
          totalItems={paginationProps.totalItems}
          startIndex={paginationProps.startIndex}
          endIndex={paginationProps.endIndex}
          onPageChange={paginationProps.goToPage}
          itemName="payments"
          maxVisiblePages={5}
        />
      </div>

      {/* Payment Details Modal */}
      <PaymentDetailsModal
        isOpen={showModal}
        onClose={closeModal}
        payment={selectedPayment}
        getStatusDisplay={getStatusDisplay}
        getPaymentMethodIcon={getPaymentMethodIcon}
        formatDate={formatDate}
      />
    </div>
  );
};

export default PaymentsTab;
