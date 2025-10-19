import { useState, useContext, useEffect } from "react";
import api from "../axios";
import { UserContext } from "../context/userContext";
import { useRental } from "../context/rentalContext";
import { usePagination } from "../hooks/usePagination";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import ItemsTab from "../components/myRentals/ItemsTab";
import EarningsTab from "../components/myRentals/EarningsTab";
import ReservedTab from "../components/myRentals/ReservedTab";
import AddItem from "../components/myRentals/AddItem";

// Custom Dropdown Component
// This component replaces the default browser <select> element for better styling control.
const CustomDropdown = ({ label, options, onSelect, isOpen, onToggle }) => {
  const [selectedOption, setSelectedOption] = useState(label);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
    onToggle(); // Close the dropdown after selection
  };

  return (
    <div className="relative w-full md:w-auto">
      <button
        onClick={onToggle}
        className="flex items-center justify-center gap-1 w-full md:w-48 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] transition-colors duration-200"
      >
        <span className="truncate">{selectedOption}</span>
        <svg
          className={`h-5 w-5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 animate-fade-in-up">
          <div className="py-1">
            {[label, ...options].map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MyRentals = () => {
  const { getUserItems, deleteItem } = useContext(UserContext);
  const { getOwnerRentals, updateRentalStatus } = useRental();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("items");
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // State for items data
  const [itemsData, setItemsData] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState(null);
  const [itemsFilters, setItemsFilters] = useState({
    categories: "",
    availability: "",
  });

  // State for reservations data
  const [reservationsData, setReservationsData] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(true);
  const [reservationsError, setReservationsError] = useState(null);

  // Fetch user items on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setItemsLoading(true);
        const items = await getUserItems();
        setItemsData(items);
        setItemsError(null);
      } catch (error) {
        setItemsError(error);
        setItemsData([]);
      } finally {
        setItemsLoading(false);
      }
    };

    fetchItems();
  }, [getUserItems]);

  // Fetch owner rentals (reservations) on component mount
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setReservationsLoading(true);
        const result = await getOwnerRentals();
        setReservationsData(result.rentals || []);
        setReservationsError(null);
      } catch (error) {
        setReservationsError(error);
        setReservationsData([]);
      } finally {
        setReservationsLoading(false);
      }
    };

    fetchReservations();
  }, [getOwnerRentals]);

  // State for earnings data
  const [earningsData, setEarningsData] = useState([]);
  const [earningsLoading, setEarningsLoading] = useState(true);
  const [earningsError, setEarningsError] = useState(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setEarningsLoading(true);
        const res = await api.get("/api/payments/owner");
        // Map backend data to EarningsTab format
        const mapped = (res.data.payments || []).map((p, idx) => {
          // Status mapping for display
          let status = "Pending";
          if (p.status === "completed") status = "Completed";
          else if (p.status === "processing") status = "In Escrow";
          else if (p.status === "pending") status = "Pending";
          else if (p.status === "refunded") status = "Refunded";
          else if (p.status === "failed") status = "Failed";

          // Escrow: if not completed, show totalPaid as escrow, else 0
          const escrow = status === "Completed" ? 0 : p.totalPaid || 0;
          // Total earned: only if completed
          const totalEarned = status === "Completed" ? (p.amount || 0) : 0;

          return {
            id: p._id || idx,
            transactionId: p._id, // Use payment's _id for Transaction ID
            item: p.rental?.item?.name || "-",
            rentalDate: p.rental?.preferredStartDate
              ? new Date(p.rental.preferredStartDate).toLocaleDateString()
              : "-",
            payment: p.totalPaid || 0,
            status,
            escrow,
            totalEarned,
          };
        });
        setEarningsData(mapped);
        setEarningsError(null);
      } catch (error) {
        setEarningsError(error);
        setEarningsData([]);
      } finally {
        setEarningsLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  // Filter items based on current filters
  const filteredItems = itemsData.filter((item) => {
    // Category filter - SearchFilterSection uses "categories" property
    if (itemsFilters.categories && itemsFilters.categories.trim()) {
      if (item.category !== itemsFilters.categories) return false;
    }

    // Availability filter
    if (itemsFilters.availability && itemsFilters.availability.trim()) {
      const itemAvailability = item.availability || "Available";
      if (itemAvailability !== itemsFilters.availability) return false;
    }

    return true;
  });

  // Use pagination hooks - reduced items per page for better UX
  const itemsPagination = usePagination(filteredItems, 4);
  const earningsPagination = usePagination(earningsData, 5);
  const reservationsPagination = usePagination(reservationsData, 4);

  // State for earnings status filter
  const [earningsStatusFilter, setEarningsStatusFilter] = useState("Status");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleEarningsStatusSelect = (status) => {
    console.log("Selected earnings status:", status);
    setEarningsStatusFilter(status);
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await deleteItem(itemId);
      // Remove from local state after successful deletion
      setItemsData((prev) => prev.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error("Failed to delete item:", error);
      // Could add error notification here
    }
  };

  const refreshItems = async () => {
    try {
      const items = await getUserItems();
      setItemsData(items);
    } catch (error) {
      console.error("Failed to refresh items:", error);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowAddItem(true);
  };

  const handleUpdateReservation = async (
    reservationId,
    action,
    reason = ""
  ) => {
    try {
      setReservationsLoading(true);

      let status;
      switch (action) {
        case "approve":
          status = "approved";
          break;
        case "reject":
          status = "rejected";
          break;
        default:
          status = action; // For other direct status updates
      }

      await updateRentalStatus(reservationId, status, reason);

      // Refresh the reservations data
      const result = await getOwnerRentals();
      setReservationsData(result.rentals || []);
      setReservationsError(null);

      console.log(`Reservation ${reservationId} updated to ${status}`);
      if (reason) {
        console.log(`Reason: ${reason}`);
      }
    } catch (error) {
      console.error("Error updating reservation:", error);
      setReservationsError(error);
    } finally {
      setReservationsLoading(false);
    }
  };

  const tabComponents = {
    items: (
      <ItemsTab
        currentItems={itemsPagination.currentItems}
        paginate={itemsPagination.goToPage}
        pageNumbers={Array.from(
          { length: itemsPagination.totalPages },
          (_, i) => i + 1
        )}
        onRemoveItem={handleRemoveItem}
        currentPage={itemsPagination.currentPage}
        totalPages={itemsPagination.totalPages}
        totalItems={itemsPagination.totalItems}
        startIndex={itemsPagination.startIndex}
        endIndex={itemsPagination.endIndex}
        onAddItem={() => setShowAddItem(true)}
        onEditItem={handleEditItem}
        loading={itemsLoading}
        error={itemsError}
        onFilterChange={setItemsFilters}
      />
    ),
    requests: (
      <ReservedTab
        userReservations={reservationsPagination.currentItems}
        pagination={{
          currentPage: reservationsPagination.currentPage,
          totalPages: reservationsPagination.totalPages,
          totalItems: reservationsPagination.totalItems,
          startIndex: reservationsPagination.startIndex,
          endIndex: reservationsPagination.endIndex,
          goToPage: reservationsPagination.goToPage,
        }}
        onUpdateReservation={handleUpdateReservation}
        loading={reservationsLoading}
        itemsPerPage={4}
      />
    ),
    earnings: (
      <div className="flex-1 flex flex-col">
        {earningsLoading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">Loading earnings...</div>
        ) : earningsError ? (
          <div className="flex-1 flex items-center justify-center text-red-500">Error loading earnings.</div>
        ) : (
          <EarningsTab
            currentEarnings={earningsPagination.currentItems}
            paginate={earningsPagination.goToPage}
            pageNumbers={Array.from(
              { length: earningsPagination.totalPages },
              (_, i) => i + 1
            )}
            currentPage={earningsPagination.currentPage}
            totalPages={earningsPagination.totalPages}
            totalItems={earningsPagination.totalItems}
            startIndex={earningsPagination.startIndex}
            endIndex={earningsPagination.endIndex}
          />
        )}
      </div>
    ),
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <PageHeader title="My Rentals" onToggleSidebar={toggleSidebar} />
        <main
          className={`flex-1 min-h-0 p-6 flex flex-col ${
            showAddItem ? "overflow-y-auto" : "overflow-hidden"
          }`}
        >
          {showAddItem ? (
            // Completely override the MyRentals container with AddItem
            <AddItem
              editingItem={editingItem}
              onClose={() => {
                setShowAddItem(false);
                setEditingItem(null);
              }}
              onSuccess={() => {
                setShowAddItem(false);
                setEditingItem(null);
                refreshItems();
              }}
            />
          ) : (
            <div className="w-full bg-white rounded-lg shadow-xl p-8 flex-1 flex flex-col">
              {/* Tab Navigation Section */}
              <div className="flex items-center space-x-12 text-lg font-semibold text-gray-700 border-b border-gray-200 -mx-8 px-8 pb-3">
                {/* Items Tab */}
                <button
                  onClick={() => setActiveTab("items")}
                  className={`relative ${
                    activeTab === "items"
                      ? "text-[#6C4BF4] font-bold"
                      : "text-gray-700"
                  }`}
                >
                  Items
                  {activeTab === "items" && (
                    <span className="absolute left-0 -bottom-3 h-1 w-full bg-[#6C4BF4] rounded" />
                  )}
                </button>

                {/* Reserved Tab */}
                <button
                  onClick={() => setActiveTab("requests")}
                  className={`relative ${
                    activeTab === "requests"
                      ? "text-[#6C4BF4] font-bold"
                      : "text-gray-700"
                  }`}
                >
                  Reserved
                  {activeTab === "requests" && (
                    <span className="absolute left-0 -bottom-3 h-1 w-full bg-[#6C4BF4] rounded" />
                  )}
                </button>

                {/* Earnings Tab */}
                <button
                  onClick={() => setActiveTab("earnings")}
                  className={`relative ${
                    activeTab === "earnings"
                      ? "text-[#6C4BF4] font-bold"
                      : "text-gray-700"
                  }`}
                >
                  Earnings
                  {activeTab === "earnings" && (
                    <span className="absolute left-0 -bottom-3 h-1 w-full bg-[#6C4BF4] rounded" />
                  )}
                </button>
              </div>
              {/* Conditional content based on activeTab */}
              <div className="mt-8 flex-1 flex flex-col">
                {tabComponents[activeTab] || (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">
                      Content for the "
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}"
                      tab goes here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyRentals;
