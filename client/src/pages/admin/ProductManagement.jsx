import { useState, useEffect, useContext } from "react";
import {
  IoSearch,
  IoFilter,
  IoAdd,
  IoEye,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoTrash,
  IoPencil,
  IoWarning,
  IoCube,
} from "react-icons/io5";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { UserContext } from "../../context/userContext";
import { getImageUrl } from "../../utils/imageUtils";

const ProductManagement = () => {
  const { getAllItems } = useContext(UserContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);
  const [error, setError] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch actual items from database
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedItems = await getAllItems();

        // Transform database items to admin-friendly format
        const transformedItems = fetchedItems.map((item) => ({
          id: item._id,
          name: item.name,
          owner:
            item.owner?.username ||
            `${item.owner?.firstName || ""} ${
              item.owner?.lastName || ""
            }`.trim() ||
            "Unknown User",
          ownerId: item.owner?._id || item.owner,
          category: item.category,
          price: parseFloat(item.price),
          status: item.status || "active", // Default to active if no status field
          dateSubmitted: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "Unknown",
          image: getImageUrl(item.images?.[0] || "/placeholder-image.jpg"),
          description: item.description,
          location: item.location,
          dealOption: item.dealOption,
          originalData: item, // Keep original data for reference
        }));

        setItems(transformedItems);
      } catch (err) {
        console.error("Failed to fetch items:", err);
        setError("Failed to load items. Please try again.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [getAllItems]);

  const handleStatusChange = async (itemId, newStatus) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
    // TODO: Make API call to update status
    console.log(`Item ${itemId} status changed to ${newStatus}`);
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} on items:`, selectedItems);
    // TODO: Implement bulk actions
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
      suspended: "bg-gray-100 text-gray-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <IoCheckmarkCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <IoWarning className="w-4 h-4 text-yellow-600" />;
      case "rejected":
        return <IoCloseCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Add refresh function
  const handleRefresh = async () => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedItems = await getAllItems();

        const transformedItems = fetchedItems.map((item) => ({
          id: item._id,
          name: item.name,
          owner:
            item.owner?.username ||
            `${item.owner?.firstName || ""} ${
              item.owner?.lastName || ""
            }`.trim() ||
            "Unknown User",
          ownerId: item.owner?._id || item.owner,
          category: item.category,
          price: parseFloat(item.price),
          status: item.status || "active",
          dateSubmitted: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "Unknown",
          image: getImageUrl(item.images?.[0] || "/placeholder-image.jpg"),
          description: item.description,
          location: item.location,
          dealOption: item.dealOption,
          originalData: item,
        }));

        setItems(transformedItems);
      } catch (err) {
        console.error("Failed to refresh items:", err);
        setError("Failed to refresh items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    await fetchItems();
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
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Items & Products
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage rental items, approvals, and moderation
                </p>
              </div>
              <button
                onClick={handleRefresh}
                className="mt-4 sm:mt-0 mr-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
              >
                <IoSearch className="w-5 h-5" />
                <span>Refresh</span>
              </button>
              <button className="mt-4 sm:mt-0 bg-[#6C4BF4] text-white px-4 py-2 rounded-lg hover:bg-[#7857FD] flex items-center space-x-2">
                <IoAdd className="w-5 h-5" />
                <span>Add Item</span>
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search items or owners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C4BF4]"
                />
                <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C4BF4]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </select>

                {selectedItems.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {selectedItems.length} selected
                    </span>
                    <button
                      onClick={() => handleBulkAction("approve")}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleBulkAction("reject")}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {error && (
              <div className="p-4 bg-red-50 border-b border-red-200">
                <div className="flex items-center">
                  <IoWarning className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700">{error}</span>
                  <button
                    onClick={handleRefresh}
                    className="ml-auto text-red-700 hover:text-red-900 underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-[#6C4BF4] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading items...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <IoCube className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No items found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search terms or filters"
                    : "No items have been submitted yet"}
                </p>
                <button
                  onClick={handleRefresh}
                  className="bg-[#6C4BF4] text-white px-4 py-2 rounded-lg hover:bg-[#7857FD]"
                >
                  Refresh
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(
                                filteredItems.map((item) => item.id)
                              );
                            } else {
                              setSelectedItems([]);
                            }
                          }}
                          className="rounded border-gray-300 text-[#6C4BF4] focus:ring-[#6C4BF4]"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
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
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover mr-4"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {item.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.owner}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.location || "Not specified"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ₱{item.price}/day
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(item.status)}
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.dateSubmitted}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <IoEye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <IoPencil className="w-4 h-4" />
                            </button>
                            {item.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleStatusChange(item.id, "active")
                                  }
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <IoCheckmarkCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusChange(item.id, "rejected")
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <IoCloseCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button className="text-red-600 hover:text-red-900">
                              <IoTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing 1 to {filteredItems.length} of {filteredItems.length}{" "}
              results
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 bg-[#6C4BF4] text-white rounded-md text-sm">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductManagement;
