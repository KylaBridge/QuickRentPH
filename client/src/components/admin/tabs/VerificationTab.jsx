import { useState, useEffect } from "react";
import { IoEye } from "react-icons/io5";
import UserVerificationModal from "../UserVerificationModal";

const VerificationTab = ({ query, onUserAction }) => {
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(null);

  useEffect(() => {
    // Simulate fetching verification requests with dummy data
    setTimeout(() => {
      setVerificationRequests([
        {
          id: 1,
          name: "Alice Johnson",
          email: "alice@example.com",
          submittedDate: "2024-10-15",
          verificationType: "Identity Verification",
          documents: ["ID Front", "ID Back", "Selfie"],
          status: "Pending",
          profileImage: "/api/placeholder/40/40",
        },
        {
          id: 2,
          name: "Bob Smith",
          email: "bob@example.com",
          submittedDate: "2024-10-14",
          verificationType: "Address Verification",
          documents: ["Utility Bill", "Bank Statement"],
          status: "Pending",
          profileImage: "/api/placeholder/40/40",
        },
        {
          id: 3,
          name: "Carol Wilson",
          email: "carol@example.com",
          submittedDate: "2024-10-13",
          verificationType: "Business Verification",
          documents: ["Business License", "Tax Certificate"],
          status: "Pending",
          profileImage: "/api/placeholder/40/40",
        },
        {
          id: 4,
          name: "David Brown",
          email: "david@example.com",
          submittedDate: "2024-10-12",
          verificationType: "Identity Verification",
          documents: ["Passport", "Selfie"],
          status: "Pending",
          profileImage: "/api/placeholder/40/40",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRequests = verificationRequests.filter(
    (request) =>
      request.name.toLowerCase().includes(query.toLowerCase()) ||
      request.email.toLowerCase().includes(query.toLowerCase()) ||
      request.verificationType.toLowerCase().includes(query.toLowerCase())
  );

  const handleViewVerification = (request) => {
    setSelectedVerification(request);
    setShowVerificationModal(true);
    if (onUserAction) {
      onUserAction(`Viewed verification details for ${request.name}`);
    }
  };

  const handleApprove = (requestId) => {
    setVerificationRequests((prev) =>
      prev.map((request) =>
        request.id === requestId ? { ...request, status: "Approved" } : request
      )
    );
    if (onUserAction) {
      onUserAction(`Approved verification request ${requestId}`);
    }
  };

  const handleReject = (requestId, reason) => {
    setVerificationRequests((prev) =>
      prev.map((request) =>
        request.id === requestId ? { ...request, status: "Rejected" } : request
      )
    );
    if (onUserAction) {
      onUserAction(`Rejected verification request ${requestId}: ${reason}`);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending: "bg-yellow-100 text-yellow-800",
      "Under Review": "bg-blue-100 text-blue-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="w-8 h-8 border-4 border-[#6C4BF4] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading verification requests...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-xs">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Verification Type
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Documents
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Submitted Date
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredRequests.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-3 py-4 text-center text-gray-500">
                No verification requests found.
              </td>
            </tr>
          ) : (
            filteredRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {request.name}
                  </div>
                  <div className="text-xs text-gray-400">{request.email}</div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {request.verificationType}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div>{request.documents.join(", ")}</div>
                  <div className="text-xs text-gray-500">
                    {request.documents.length} document(s)
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {request.submittedDate}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap font-medium">
                  {request.status === "Pending" ||
                  request.status === "Under Review" ? (
                    <button
                      onClick={() => handleViewVerification(request)}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 flex items-center gap-1"
                    >
                      {" "}
                      <IoEye className="w-4 h-4" /> Review{" "}
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <button
                        onClick={() => handleViewVerification(request)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        {" "}
                        <IoEye className="w-4 h-4" />{" "}
                      </button>
                      {request.status}
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* User Verification Modal */}
      <UserVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        verificationData={selectedVerification}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default VerificationTab;
