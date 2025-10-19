import { useState, useEffect } from "react";
import { IoEye, IoWarning, IoPerson } from "react-icons/io5";
import ReportedUserModal from "../ReportedUserModal";

const ReportedUsersTab = ({ query, onUserAction }) => {
  const [reportedUsers, setReportedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedUserReport, setSelectedUserReport] = useState(null);

  useEffect(() => {
    // Simulate fetching reported users with dummy data
    setTimeout(() => {
      setReportedUsers([
        {
          id: 1,
          name: "John Troublemaker",
          email: "john.trouble@email.com",
          profileImage: "/api/placeholder/40/40",
          reportCount: 3,
          lastReported: "2024-10-18",
          status: "Under Review",
          joinDate: "2024-08-15",
          reports: [
            {
              id: "r001",
              reporterName: "Sarah Johnson",
              reporterEmail: "sarah@email.com",
              reportDate: "2024-10-18",
              category: "Harassment",
              reason:
                "User sent inappropriate messages and made threats during rental negotiation. Screenshots provided as evidence.",
              evidence: ["/evidence1.jpg", "/evidence2.jpg"],
              severity: "High",
              status: "Open",
            },
            {
              id: "r002",
              reporterName: "Mike Wilson",
              reporterEmail: "mike@email.com",
              reportDate: "2024-10-15",
              category: "Fraudulent Activity",
              reason:
                "User attempted to rent item but provided fake payment information and false identity documents.",
              evidence: ["/evidence3.jpg"],
              severity: "Critical",
              status: "Open",
            },
            {
              id: "r003",
              reporterName: "Lisa Brown",
              reporterEmail: "lisa@email.com",
              reportDate: "2024-10-12",
              category: "Inappropriate Behavior",
              reason:
                "User showed up to pickup location intoxicated and behaved aggressively toward item owner.",
              evidence: [],
              severity: "Medium",
              status: "Open",
            },
          ],
        },
        {
          id: 2,
          name: "Jane Scammer",
          email: "jane.scam@email.com",
          profileImage: "/api/placeholder/40/40",
          reportCount: 5,
          lastReported: "2024-10-19",
          status: "Under Review",
          joinDate: "2024-09-01",
          reports: [
            {
              id: "r004",
              reporterName: "Tom Anderson",
              reporterEmail: "tom@email.com",
              reportDate: "2024-10-19",
              category: "Payment Fraud",
              reason:
                "User used stolen credit card information for payment. Bank confirmed fraudulent transaction.",
              evidence: ["/bank_report.pdf", "/transaction_details.jpg"],
              severity: "Critical",
              status: "High Priority",
            },
            {
              id: "r005",
              reporterName: "Emily Davis",
              reporterEmail: "emily@email.com",
              reportDate: "2024-10-16",
              category: "Item Theft",
              reason:
                "User rented expensive camera equipment and never returned it. Has been unreachable since rental period ended.",
              evidence: ["/rental_agreement.pdf", "/messages.jpg"],
              severity: "Under Review",
              status: "Open",
            },
          ],
        },
        {
          id: 3,
          name: "Bob Violator",
          email: "bob.v@email.com",
          profileImage: "/api/placeholder/40/40",
          reportCount: 2,
          lastReported: "2024-10-14",
          status: "Under Review",
          joinDate: "2024-07-20",
          reports: [
            {
              id: "r006",
              reporterName: "Carol Martinez",
              reporterEmail: "carol@email.com",
              reportDate: "2024-10-14",
              category: "Property Damage",
              reason:
                "User returned rental car with significant unreported damage. Attempted to hide damage with temporary fixes.",
              evidence: ["/damage_photos.jpg", "/repair_estimate.pdf"],
              severity: "High",
              status: "Under Review",
            },
            {
              id: "r007",
              reporterName: "David Lee",
              reporterEmail: "david@email.com",
              reportDate: "2024-10-10",
              category: "Terms Violation",
              reason:
                "User subleted rental apartment to unauthorized parties, violating rental agreement terms.",
              evidence: ["/subletting_evidence.jpg"],
              severity: "Medium",
              status: "Open",
            },
          ],
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = reportedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.reports.some(
        (report) =>
          report.category.toLowerCase().includes(query.toLowerCase()) ||
          report.reason.toLowerCase().includes(query.toLowerCase())
      )
  );

  const handleViewReport = (userReport) => {
    setSelectedUserReport(userReport);
    setShowReportModal(true);
    if (onUserAction) {
      onUserAction(`Viewed reports for user ${userReport.name}`);
    }
  };

  const handleUserAction = (userId, action, reason = "") => {
    setReportedUsers((prev) =>
      prev.map((user) => {
        if (user.id === userId) {
          switch (action) {
            case "suspend":
              return { ...user, status: "Suspended" };
            case "ban":
              return { ...user, status: "Banned" };
            case "delete":
              // In real implementation, would remove from database
              return { ...user, status: "Deleted" };
            default:
              return user;
          }
        }
        return user;
      })
    );

    if (onUserAction) {
      onUserAction(
        `${action} reported user ${userId}${reason ? `: ${reason}` : ""}`
      );
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      "Under Review": "bg-blue-100 text-blue-800",
      "High Priority": "bg-red-100 text-red-800",
      Suspended: "bg-yellow-100 text-yellow-800",
      Banned: "bg-red-100 text-red-800",
      Resolved: "bg-green-100 text-green-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const getSeverityBadge = (reports) => {
    const hasCritical = reports.some((r) => r.severity === "Critical");
    const hasHigh = reports.some((r) => r.severity === "High");

    if (hasCritical) return "bg-red-100 text-red-800";
    if (hasHigh) return "bg-orange-100 text-orange-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getHighestSeverity = (reports) => {
    if (reports.some((r) => r.severity === "Critical")) return "Critical";
    if (reports.some((r) => r.severity === "High")) return "High";
    return "Medium";
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="w-8 h-8 border-4 border-[#6C4BF4] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading reported users...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Summary cards removed for compact layout */}

      <table className="min-w-full divide-y divide-gray-200 text-xs">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Reports
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Last Reported
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-3 py-4 text-center text-gray-500">
                No reported users found.
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                  <div className="text-xs text-gray-400">
                    Member since {user.joinDate}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <IoWarning className="w-4 h-4 text-red-500 mr-2" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.reportCount} reports
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.reports.length} unique incidents
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {user.lastReported}
                </td>
                <td className="px-3 py-2 whitespace-nowrap font-medium">
                  <button
                    onClick={() => handleViewReport(user)}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 flex items-center gap-1"
                  >
                    {" "}
                    <IoEye className="w-4 h-4" /> View Reports{" "}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Reported User Modal */}
      <ReportedUserModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        userReport={selectedUserReport}
        onUserAction={handleUserAction}
      />
    </div>
  );
};

export default ReportedUsersTab;
