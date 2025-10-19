import { useState, useEffect, useContext } from "react";
import { IoWarning } from "react-icons/io5";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import ReportDetailsModal from "../../components/admin/ReportDetailsModal";
import AllItemsTab from "../../components/admin/tabs/AllItemsTab";
import ReportedItemsTab from "../../components/admin/tabs/ReportedItemsTab";
import { UserContext } from "../../context/userContext";

const ProductManagement = () => {
  const { getAllItems } = useContext(UserContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [error, setError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleStatusChange = async (itemId, newStatus) => {
    // TODO: Make API call to update status
    console.log(`Item ${itemId} status changed to ${newStatus}`);
  };

  // Handle viewing report details
  const handleViewReport = (item) => {
    setSelectedReport(item);
    setShowReportModal(true);
  };

  // Handle dismissing a report
  const handleDismissReport = (item) => {
    // TODO: Implement API call to dismiss report
    console.log("Dismissing report for item:", item.id);
    setShowReportModal(false);
  };

  // Handle removing an item
  const handleRemoveItem = (item) => {
    // TODO: Implement API call to remove item
    console.log("Removing item:", item.id);
    setShowReportModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          title="Product Management"
          onToggleSidebar={toggleSidebar}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Header Section */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Items & Products
              </h1>
              <p className="text-gray-600">Manage and review rental items</p>
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2 text-xs">
              <input
                type="text"
                placeholder="Search items by name or owner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4]"
              />
              <div className="ml-2">
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-3 py-2 bg-gray-100 rounded-md text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-4">
            <div className="flex space-x-2">
              {[
                { id: "all", label: "All Items" },
                { id: "reported", label: "Reported Items" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === t.id
                      ? "bg-[#6C4BF4] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden text-xs">
            {error && (
              <div className="p-4 bg-red-50 border-b border-red-200">
                <div className="flex items-center">
                  <IoWarning className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

            {activeTab === "all" && (
              <AllItemsTab
                searchTerm={searchTerm}
                onError={setError}
                onStatusChange={handleStatusChange}
              />
            )}

            {activeTab === "reported" && (
              <ReportedItemsTab
                searchTerm={searchTerm}
                onViewReport={handleViewReport}
              />
            )}
          </div>
        </main>
      </div>

      {/* Report Details Modal */}
      <ReportDetailsModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        selectedReport={selectedReport}
        onDismissReport={handleDismissReport}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default ProductManagement;
