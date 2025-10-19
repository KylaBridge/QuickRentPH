import { useState } from "react";
import {
  IoClose,
  IoWarning,
  IoPerson,
  IoMail,
  IoCalendar,
  IoDocument,
  IoEye,
  IoDownload,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoTrash,
  IoTime,
} from "react-icons/io5";

const ReportedUserModal = ({ isOpen, onClose, userReport, onUserAction }) => {
  const [selectedAction, setSelectedAction] = useState("");
  const [actionReason, setActionReason] = useState("");
  const [showActionForm, setShowActionForm] = useState(false);

  if (!isOpen || !userReport) return null;

  const handleTakeAction = () => {
    if (!selectedAction) {
      alert("Please select an action.");
      return;
    }

    if (!actionReason.trim()) {
      alert("Please provide a reason for this action.");
      return;
    }

    if (onUserAction) {
      onUserAction(userReport.id, selectedAction, actionReason);
    }

    setShowActionForm(false);
    setSelectedAction("");
    setActionReason("");
    onClose();
  };

  const handleViewEvidence = (evidence) => {
    // TODO: Implement evidence viewer
    console.log("Viewing evidence:", evidence);
  };

  const handleDownloadEvidence = (evidence) => {
    // TODO: Implement evidence download
    console.log("Downloading evidence:", evidence);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Harassment":
        return "🚫";
      case "Fraudulent Activity":
        return "💳";
      case "Payment Fraud":
        return "💰";
      case "Item Theft":
        return "🔒";
      case "Property Damage":
        return "💥";
      case "Terms Violation":
        return "📋";
      case "Inappropriate Behavior":
        return "⚠️";
      default:
        return "🚨";
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-red-50">
          <div className="flex items-center gap-3">
            <IoWarning className="w-6 h-6 text-red-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                User Report Details
              </h2>
              <p className="text-sm text-red-600">
                {userReport.reportCount} report(s) • Last reported{" "}
                {userReport.lastReported}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Information */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 sticky top-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <IoPerson className="w-5 h-5 text-[#6C4BF4]" />
                  User Information
                </h3>

                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={userReport.profileImage}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {userReport.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Member since {userReport.joinDate}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <IoMail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {userReport.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <IoTime className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      Status: {userReport.status}
                    </span>
                  </div>
                </div>

                {/* Report Summary */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Report Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Reports:</span>
                      <span className="font-medium text-red-600">
                        {userReport.reportCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Categories:</span>
                      <span className="font-medium">
                        {
                          [
                            ...new Set(
                              userReport.reports.map((r) => r.category)
                            ),
                          ].length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Open Cases:</span>
                      <span className="font-medium">
                        {
                          userReport.reports.filter((r) => r.status === "Open")
                            .length
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reports Details */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <IoDocument className="w-5 h-5 text-red-600" />
                Report Details ({userReport.reports.length} reports)
              </h3>

              <div className="space-y-4">
                {userReport.reports.map((report, index) => (
                  <div
                    key={report.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    {/* Report Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {getCategoryIcon(report.category)}
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Report #{index + 1}: {report.category}
                          </h4>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span>By: {report.reporterName}</span>
                            <span>Date: {report.reportDate}</span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(
                          report.severity
                        )}`}
                      >
                        {report.severity}
                      </span>
                    </div>

                    {/* Report Content */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {report.reason}
                      </p>
                    </div>

                    {/* Evidence */}
                    {report.evidence && report.evidence.length > 0 && (
                      <div className="border-t pt-3">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">
                          Evidence ({report.evidence.length} files)
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {report.evidence.map((evidence, evidenceIndex) => (
                            <div
                              key={evidenceIndex}
                              className="flex items-center gap-2 bg-gray-50 rounded px-3 py-2 text-sm"
                            >
                              <IoDocument className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">
                                Evidence {evidenceIndex + 1}
                              </span>
                              <button
                                onClick={() => handleViewEvidence(evidence)}
                                className="text-blue-600 hover:text-blue-800 ml-2"
                                title="View Evidence"
                              >
                                <IoEye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDownloadEvidence(evidence)}
                                className="text-gray-600 hover:text-gray-800"
                                title="Download Evidence"
                              >
                                <IoDownload className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reporter Info */}
                    <div className="border-t pt-3 mt-3">
                      <div className="text-xs text-gray-500">
                        Reported by: {report.reporterName} (
                        {report.reporterEmail})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex-shrink-0 rounded-b-lg">
          {!showActionForm ? (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Review all reports before taking action
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => setShowActionForm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Take Action
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Action
                  </label>
                  <select
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select action...</option>
                    <option value="suspend">Suspend Account</option>
                    <option value="ban">Ban Account</option>
                    <option value="delete">Delete Account</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason
                  </label>
                  <input
                    type="text"
                    placeholder="Provide reason for this action..."
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowActionForm(false);
                    setSelectedAction("");
                    setActionReason("");
                  }}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTakeAction}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Confirm Action
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportedUserModal;
