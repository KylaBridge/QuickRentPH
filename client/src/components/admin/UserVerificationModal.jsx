import { useState } from "react";
import {
  IoClose,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoDownload,
  IoEye,
  IoShield,
  IoPerson,
  IoMail,
  IoCall,
  IoCalendar,
  IoDocument,
  IoCamera,
  IoLocation,
} from "react-icons/io5";

const UserVerificationModal = ({
  isOpen,
  onClose,
  verificationData,
  onApprove,
  onReject,
}) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  if (!isOpen || !verificationData) return null;

  // Mock user data based on verification request
  const userData = {
    id: verificationData.id,
    firstName: verificationData.name.split(" ")[0] || "John",
    lastName: verificationData.name.split(" ")[1] || "Doe",
    email: verificationData.email,
    mobileNumber: "+639123456789",
    dateOfBirth: "1995-05-15",
    address: "123 Sample Street, Quezon City, Metro Manila",
    joinDate: "2024-09-01",
    profileImage: verificationData.profileImage || "/api/placeholder/120/120",
    verificationLevel: "Basic",
  };

  // Mock documents based on verification type
  const getDocuments = () => {
    const baseDocuments = [
      {
        id: 1,
        type: "Government ID (Front)",
        fileName: "government_id_front.jpg",
        fileSize: "2.4 MB",
        uploadDate: verificationData.submittedDate,
        status: "uploaded",
        thumbnail: "/api/placeholder/150/100",
      },
      {
        id: 2,
        type: "Government ID (Back)",
        fileName: "government_id_back.jpg",
        fileSize: "2.1 MB",
        uploadDate: verificationData.submittedDate,
        status: "uploaded",
        thumbnail: "/api/placeholder/150/100",
      },
      {
        id: 3,
        type: "Selfie with ID",
        fileName: "selfie_with_id.jpg",
        fileSize: "3.2 MB",
        uploadDate: verificationData.submittedDate,
        status: "uploaded",
        thumbnail: "/api/placeholder/150/100",
      },
    ];

    if (verificationData.verificationType === "Address Verification") {
      return [
        ...baseDocuments,
        {
          id: 4,
          type: "Utility Bill",
          fileName: "utility_bill.pdf",
          fileSize: "1.8 MB",
          uploadDate: verificationData.submittedDate,
          status: "uploaded",
          thumbnail: "/api/placeholder/150/100",
        },
        {
          id: 5,
          type: "Bank Statement",
          fileName: "bank_statement.pdf",
          fileSize: "2.5 MB",
          uploadDate: verificationData.submittedDate,
          status: "uploaded",
          thumbnail: "/api/placeholder/150/100",
        },
      ];
    }

    if (verificationData.verificationType === "Business Verification") {
      return [
        ...baseDocuments,
        {
          id: 6,
          type: "Business License",
          fileName: "business_license.pdf",
          fileSize: "4.1 MB",
          uploadDate: verificationData.submittedDate,
          status: "uploaded",
          thumbnail: "/api/placeholder/150/100",
        },
        {
          id: 7,
          type: "Tax Certificate",
          fileName: "tax_certificate.pdf",
          fileSize: "1.9 MB",
          uploadDate: verificationData.submittedDate,
          status: "uploaded",
          thumbnail: "/api/placeholder/150/100",
        },
      ];
    }

    return baseDocuments;
  };

  const documents = getDocuments();

  const handleDownload = (document) => {
    // TODO: Implement actual file download
    console.log("Downloading document:", document.fileName);
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
  };

  const handleApproveVerification = () => {
    if (onApprove) {
      onApprove(verificationData.id);
    }
    onClose();
  };

  const handleRejectVerification = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    if (onReject) {
      onReject(verificationData.id, rejectionReason);
    }
    setShowRejectionForm(false);
    setRejectionReason("");
    onClose();
  };

  const getDocumentIcon = (type) => {
    if (type.includes("ID")) return <IoDocument className="w-5 h-5" />;
    if (type.includes("Selfie")) return <IoCamera className="w-5 h-5" />;
    return <IoDocument className="w-5 h-5" />;
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <IoShield className="w-6 h-6 text-[#6C4BF4]" />
            <h2 className="text-xl font-semibold text-gray-900">
              User Verification Details
            </h2>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <IoPerson className="w-5 h-5 text-[#6C4BF4]" />
                  User Information
                </h3>

                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={userData.profileImage}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {userData.firstName} {userData.lastName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Member since {userData.joinDate}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <IoMail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {userData.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <IoCall className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {userData.mobileNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <IoCalendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      Born {userData.dateOfBirth}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <IoLocation className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-sm text-gray-900">
                      {userData.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verification Request Details */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Verification Request
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {verificationData.verificationType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Submitted:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {verificationData.submittedDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        verificationData.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : verificationData.status === "Under Review"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {verificationData.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Documents:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {documents.length} files
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <IoDocument className="w-5 h-5 text-[#6C4BF4]" />
                Submitted Documents
              </h3>

              <div className="space-y-3">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <img
                          src={document.thumbnail}
                          alt={document.type}
                          className="w-12 h-12 object-cover rounded border"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getDocumentIcon(document.type)}
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {document.type}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          {document.fileName}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>{document.fileSize}</span>
                          <span>Uploaded {document.uploadDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDocument(document)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="View Document"
                        >
                          <IoEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(document)}
                          className="text-gray-600 hover:text-gray-800 p-1"
                          title="Download Document"
                        >
                          <IoDownload className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0 rounded-b-lg">
          <div className="text-sm text-gray-500">
            Review all documents before making a decision
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
            {!showRejectionForm ? (
              <>
                <button
                  onClick={() => setShowRejectionForm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                >
                  <IoCloseCircle className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={handleApproveVerification}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                >
                  <IoCheckmarkCircle className="w-4 h-4" />
                  Approve
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <button
                  onClick={() => {
                    setShowRejectionForm(false);
                    setRejectionReason("");
                  }}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectVerification}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Confirm Rejection
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">{selectedDocument.type}</h3>
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedDocument.thumbnail}
                alt={selectedDocument.type}
                className="max-w-full max-h-[70vh] object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserVerificationModal;
