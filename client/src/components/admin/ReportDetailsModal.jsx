import React from "react";

const ReportDetailsModal = ({
  isOpen,
  onClose,
  selectedReport,
  onDismissReport,
  onRemoveItem,
}) => {
  if (!isOpen || !selectedReport) return null;

  const handleViolationDetails = (violationType) => {
    const details = {
      "Offensive content":
        "The images include nudity, sexual content, or inappropriate display. The images include violent or unpleasant content.",
      "Prohibited Goods": "Seller provides illegal or restricted items.",
      "Suspected store/product": "Store/item appears to be a scam",
      "Suspicious payment method":
        "Seller requested payment outside Lazada (eg. transfer to direct bank account).",
      Others: "Other issues that you encounter from this store/product.",
    };

    alert(details[violationType] || "Other violation details...");
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Report Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Item Details */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">
              Reported Item
            </h4>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={selectedReport.image}
                alt={selectedReport.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <p className="font-medium text-gray-900">
                  {selectedReport.name}
                </p>
                <p className="text-sm text-gray-600">
                  Owner: {selectedReport.owner}
                </p>
                <p className="text-sm text-gray-600">
                  Category: {selectedReport.category}
                </p>
              </div>
            </div>
          </div>

          {/* Report Details */}
          {selectedReport.reports?.map((report, index) => (
            <div key={report.id} className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Report {index + 1} -{" "}
                {new Date(report.reportDate).toLocaleDateString()}
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reporter
                  </label>
                  <p className="text-gray-900">{report.reporterName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Violation Type
                  </label>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        report.violationType === "Offensive content"
                          ? "bg-red-100 text-red-800"
                          : report.violationType === "Prohibited Goods"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {report.violationType}
                    </span>
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      onClick={() =>
                        handleViolationDetails(report.violationType)
                      }
                    >
                      View Details
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-900 text-sm">{report.reason}</p>
                  </div>
                </div>

                {report.evidence && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Evidence
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-600 text-sm">
                        Evidence file: {report.evidence}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={() => onDismissReport && onDismissReport(selectedReport)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Dismiss Report
            </button>
            <button
              onClick={() => onRemoveItem && onRemoveItem(selectedReport)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Remove Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;
