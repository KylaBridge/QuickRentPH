import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { usePagination } from "../hooks/usePagination";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import ItemsTab from "../components/myRentals/ItemsTab";
import EarningsTab from "../components/myRentals/EarningsTab";
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

  // State for earnings data
  const [earningsData] = useState([
    {
      id: 1,
      transactionId: "TXN73847",
      item: "Electric Drill",
      model: "X-2500",
      rentalDate: "2024-05-10",
      payment: "850.00",
      status: "Completed",
      escrow: "0.00",
      totalEarned: "850.00",
    },
    {
      id: 2,
      transactionId: "TXN84923",
      item: "Telescope",
      model: "Celestron 130EQ",
      rentalDate: "2024-05-12",
      payment: "1200.00",
      status: "Pending",
      escrow: "1200.00",
      totalEarned: "0.00",
    },
    {
      id: 3,
      transactionId: "TXN92384",
      item: "DJ Controller",
      model: "Pioneer DDJ-400",
      rentalDate: "2024-05-15",
      payment: "1500.00",
      status: "Completed",
      escrow: "0.00",
      totalEarned: "1500.00",
    },
    {
      id: 4,
      transactionId: "TXN10293",
      item: "Kayak",
      model: "Seahawk II",
      rentalDate: "2024-05-18",
      payment: "2000.00",
      status: "In Escrow",
      escrow: "2000.00",
      totalEarned: "0.00",
    },
    {
      id: 5,
      transactionId: "TXN29384",
      item: "GoPro Camera",
      model: "Hero 9",
      rentalDate: "2024-05-20",
      payment: "1300.00",
      status: "Completed",
      escrow: "0.00",
      totalEarned: "1300.00",
    },
    {
      id: 6,
      transactionId: "TXN38475",
      item: "Camping Tent",
      model: "Outfitter 4P",
      rentalDate: "2024-05-22",
      payment: "600.00",
      status: "Completed",
      escrow: "0.00",
      totalEarned: "600.00",
    },
    {
      id: 7,
      transactionId: "TXN47563",
      item: "Camera Lens",
      model: "Canon 50mm",
      rentalDate: "2024-05-25",
      payment: "950.00",
      status: "Pending",
      escrow: "950.00",
      totalEarned: "0.00",
    },
    {
      id: 8,
      transactionId: "TXN56382",
      item: "Pressure Washer",
      model: "PowerClean 3000",
      rentalDate: "2024-06-01",
      payment: "1100.00",
      status: "Completed",
      escrow: "0.00",
      totalEarned: "1100.00",
    },
    {
      id: 9,
      transactionId: "TXN63829",
      item: "Mountain Bike",
      model: "Trailmaster 29",
      rentalDate: "2024-06-05",
      payment: "1800.00",
      status: "In Escrow",
      escrow: "1800.00",
      totalEarned: "0.00",
    },
    {
      id: 10,
      transactionId: "TXN73829",
      item: "Inflatable Boat",
      model: "Explorer Pro",
      rentalDate: "2024-06-10",
      payment: "2200.00",
      status: "Completed",
      escrow: "0.00",
      totalEarned: "2200.00",
    },
    {
      id: 11,
      transactionId: "TXN82930",
      item: "Portable Projector",
      model: "MiniBeam P7",
      rentalDate: "2024-06-12",
      payment: "700.00",
      status: "Pending",
      escrow: "700.00",
      totalEarned: "0.00",
    },
    {
      id: 12,
      transactionId: "TXN93021",
      item: "Car Roof Rack",
      model: "Thule Aero",
      rentalDate: "2024-06-15",
      payment: "500.00",
      status: "Completed",
      escrow: "0.00",
      totalEarned: "500.00",
    },
    {
      id: 13,
      transactionId: "TXN10293",
      item: "Concrete Mixer",
      model: "ProMix 1.5",
      rentalDate: "2024-06-18",
      payment: "2500.00",
      status: "In Escrow",
      escrow: "2500.00",
      totalEarned: "0.00",
    },
    {
      id: 14,
      transactionId: "TXN29384",
      item: "Snowboard",
      model: "Burton Custom",
      rentalDate: "2024-06-20",
      payment: "1400.00",
      status: "Completed",
      escrow: "0.00",
      totalEarned: "1400.00",
    },
    {
      id: 15,
      transactionId: "TXN38475",
      item: "Leaf Blower",
      model: "Husqvarna 125B",
      rentalDate: "2024-06-22",
      payment: "400.00",
      status: "Completed",
      escrow: "0.00",
      totalEarned: "400.00",
    },
    {
      id: 16,
      transactionId: "TXN47563",
      item: "Karaoke Machine",
      model: "Singsation All-In-One",
      rentalDate: "2024-06-25",
      payment: "900.00",
      status: "Pending",
      escrow: "900.00",
      totalEarned: "0.00",
    },
    {
      id: 17,
      transactionId: "TXN56382",
      item: "Portable Sound System",
      model: "JBL PartyBox",
      rentalDate: "2024-06-28",
      payment: "1600.00",
      status: "In Escrow",
      escrow: "1600.00",
      totalEarned: "0.00",
    },
    {
      id: 18,
      transactionId: "TXN63829",
      item: "Electric Drill",
      model: "X-2500",
      rentalDate: "2024-07-01",
      payment: "850.00",
      status: "Completed",
      escrow: "0.00",
      totalEarned: "850.00",
    },
  ]);

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

  // Use pagination hooks
  const itemsPagination = usePagination(filteredItems, 6);
  const earningsPagination = usePagination(earningsData, 7);

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
        onAddItem={() => setShowAddItem(true)}
        onEditItem={handleEditItem}
        loading={itemsLoading}
        error={itemsError}
        onFilterChange={setItemsFilters}
      />
    ),
    earnings: (
      <div className="flex-1 flex flex-col">
        <EarningsTab
          currentEarnings={earningsPagination.currentItems}
          paginate={earningsPagination.goToPage}
          pageNumbers={Array.from(
            { length: earningsPagination.totalPages },
            (_, i) => i + 1
          )}
          currentPage={earningsPagination.currentPage}
          totalPages={earningsPagination.totalPages}
        />
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

                {/* Requests Tab */}
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
