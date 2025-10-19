import { useState, useEffect } from "react";
import { IoCube, IoWarning, IoEye } from "react-icons/io5";

const ReportedItemsTab = ({ searchTerm, onViewReport }) => {
  const [reportedItems, setReportedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    // Simulate fetching reported items with enhanced dummy data
    setTimeout(() => {
      setReportedItems([
        {
          id: "rep001",
          name: "Suspicious Gaming Laptop",
          owner: "John Doe",
          ownerEmail: "john.doe@email.com",
          category: "Electronics",
          location: "Manila",
          price: 1500,
          status: "reported",
          image: "/api/placeholder/40/40",
          dateSubmitted: "2024-10-15",
          reportCount: 3,
          lastReported: "2024-10-18",
          reports: [
            {
              id: "r001",
              reporterName: "Jane Smith",
              reporterEmail: "jane.smith@email.com",
              reportDate: "2024-10-18",
              violationType: "Prohibited Goods",
              reason:
                "Seller provides illegal or restricted items. This appears to be stolen property based on serial numbers.",
              evidence: ["/evidence1.jpg", "/evidence2.jpg"],
              status: "Open",
            },
            {
              id: "r004",
              reporterName: "Mike Johnson",
              reporterEmail: "mike@email.com",
              reportDate: "2024-10-17",
              violationType: "Fraudulent Activity",
              reason:
                "Item description doesn't match actual product. Seller is misleading buyers.",
              evidence: ["/evidence4.jpg"],
              status: "Open",
            },
            {
              id: "r007",
              reporterName: "Sarah Wilson",
              reporterEmail: "sarah@email.com",
              reportDate: "2024-10-16",
              violationType: "Safety Concerns",
              reason:
                "Product appears to have safety issues and could be dangerous to use.",
              evidence: [],
              status: "Open",
            },
          ],
        },
        {
          id: "rep002",
          name: "Inappropriate T-Shirt Design",
          owner: "Mike Johnson",
          ownerEmail: "mike.j@email.com",
          category: "Fashion",
          location: "Quezon City",
          price: 50,
          status: "reported",
          image: "/api/placeholder/40/40",
          dateSubmitted: "2024-10-10",
          reportCount: 2,
          lastReported: "2024-10-19",
          reports: [
            {
              id: "r002",
              reporterName: "Sarah Wilson",
              reporterEmail: "sarah.wilson@email.com",
              reportDate: "2024-10-19",
              violationType: "Offensive Content",
              reason:
                "Product page shows inappropriate images with nudity and sexual content that violates community guidelines.",
              evidence: ["/evidence2.jpg"],
              status: "Open",
            },
            {
              id: "r005",
              reporterName: "Lisa Brown",
              reporterEmail: "lisa@email.com",
              reportDate: "2024-10-18",
              violationType: "Inappropriate Content",
              reason: "Design contains hate symbols and offensive language.",
              evidence: ["/evidence5.jpg"],
              status: "Open",
            },
          ],
        },
        {
          id: "rep003",
          name: "Counterfeit Designer Watch",
          owner: "Fashion Store",
          ownerEmail: "store@fashion.com",
          category: "Accessories",
          location: "Makati",
          price: 2000,
          status: "reported",
          image: "/api/placeholder/40/40",
          dateSubmitted: "2024-10-08",
          reportCount: 5,
          lastReported: "2024-10-19",
          reports: [
            {
              id: "r003",
              reporterName: "Brand Representative",
              reporterEmail: "legal@brandname.com",
              reportDate: "2024-10-19",
              violationType: "Trademark Violation",
              reason:
                "This is a counterfeit product that violates our trademark. We have legal documentation proving authenticity issues.",
              evidence: ["/evidence3.jpg", "/trademark_docs.pdf"],
              status: "High Priority",
            },
            {
              id: "r006",
              reporterName: "Customer A",
              reporterEmail: "customer1@email.com",
              reportDate: "2024-10-15",
              violationType: "Counterfeit Product",
              reason:
                "Received fake product. Quality is terrible and clearly not authentic.",
              evidence: ["/evidence6.jpg"],
              status: "Open",
            },
          ],
        },
        {
          id: "rep004",
          name: "Broken Power Tool",
          owner: "Tool Rental Co",
          ownerEmail: "tools@rental.com",
          category: "Tools & Equipment",
          location: "Pasig",
          price: 300,
          status: "reported",
          image: "/api/placeholder/40/40",
          dateSubmitted: "2024-10-05",
          reportCount: 1,
          lastReported: "2024-10-18",
          reports: [
            {
              id: "r008",
              reporterName: "Safety Inspector",
              reporterEmail: "safety@gov.ph",
              reportDate: "2024-10-18",
              violationType: "Safety Hazard",
              reason:
                "Tool has exposed wiring and damaged safety features. Poses serious risk of electrical shock.",
              evidence: ["/safety_report.pdf", "/hazard_photo.jpg"],
              status: "Critical",
            },
          ],
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredItems = reportedItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleViewReport = (item) => {
    if (onViewReport) {
      onViewReport(item);
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} on reported items:`, selectedItems);
    // TODO: Implement bulk actions for reported items
  };

  const getReportSeverity = (reports) => {
    if (reports.some((r) => r.status === "Critical")) return "Critical";
    if (reports.some((r) => r.status === "High Priority"))
      return "High Priority";
    return "Standard";
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      Critical: "bg-red-100 text-red-800",
      "High Priority": "bg-orange-100 text-orange-800",
      Standard: "bg-yellow-100 text-yellow-800",
    };
    return badges[severity] || "bg-yellow-100 text-yellow-800";
  };

  const getMostCommonViolation = (reports) => {
    const violations = reports.map((r) => r.violationType);
    const counts = violations.reduce((acc, v) => {
      acc[v] = (acc[v] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b
    );
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-8 h-8 border-4 border-[#6C4BF4] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading reported items...</p>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-4">
          <IoCube className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No reported items found
        </h3>
        <p className="text-gray-600 mb-4">
          {searchTerm
            ? "Try adjusting your search terms"
            : "No items have been reported yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-red-800 font-medium">
              {selectedItems.length} reported items selected
            </span>
            <div className="space-x-2">
              <button
                onClick={() => handleBulkAction("dismiss")}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Dismiss All
              </button>
              <button
                onClick={() => handleBulkAction("remove")}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Remove All
              </button>
              <button
                onClick={() => setSelectedItems([])}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="w-full text-xs">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-3 py-2 text-left">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedItems(filteredItems.map((item) => item.id));
                  } else {
                    setSelectedItems([]);
                  }
                }}
                className="rounded border-gray-300 text-[#6C4BF4] focus:ring-[#6C4BF4]"
              />
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Item
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Owner
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Reports
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Violation Type
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
          {filteredItems.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-3 py-2">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems([...selectedItems, item.id]);
                    } else {
                      setSelectedItems(
                        selectedItems.filter((id) => id !== item.id)
                      );
                    }
                  }}
                  className="rounded border-gray-300 text-[#6C4BF4] focus:ring-[#6C4BF4]"
                />
              </td>
              <td className="px-3 py-2">
                <div>
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-gray-500">
                    {item.category} • ₱{item.price}/day
                  </div>
                  <div className="text-gray-400">{item.location}</div>
                </div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="font-medium text-gray-900">{item.owner}</div>
                <div className="text-gray-500">{item.ownerEmail}</div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="flex items-center">
                  <IoWarning className="w-4 h-4 text-red-500 mr-1" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {item.reportCount} reports
                    </div>
                    <div className="text-gray-500">
                      {item.reports.length} unique reporters
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="text-gray-900">
                  {getMostCommonViolation(item.reports)}
                </div>
                {item.reports.length > 1 && (
                  <div className="text-gray-500">
                    +{item.reports.length - 1} other violations
                  </div>
                )}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-gray-900">
                {item.lastReported}
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleViewReport(item)}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    title="View Report Details"
                  >
                    <IoEye className="w-4 h-4 inline mr-1" />
                    View
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportedItemsTab;
