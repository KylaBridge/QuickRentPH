import { useState } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("items");
  // New state to manage which dropdown is open. It will store the label of the open dropdown.
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // State for row dropdowns
  const [rowDropdown, setRowDropdown] = useState({});

  // State for items data (to allow updating availability/status)
  const [itemsData, setItemsData] = useState([
    {
      id: 1,
      item: "Electric Drill",
      model: "X-2500",
      category: "Tools",
      price: "850.00",
      availability: "Available",
      status: "Active",
      image: "https://placehold.co/60x60/3277a8/ffffff?text=Drill",
    },
    {
      id: 2,
      item: "Telescope",
      model: "Celestron 130EQ",
      category: "Outdoor",
      price: "1200.00",
      availability: "Unavailable",
      status: "Active",
      image: "https://placehold.co/60x60/4c4c87/ffffff?text=Scope",
    },
    {
      id: 3,
      item: "DJ Controller",
      model: "Pioneer DDJ-400",
      category: "Electronics",
      price: "1500.00",
      availability: "Rented Out",
      status: "Inactive",
      image: "https://placehold.co/60x60/8b4513/ffffff?text=DJ",
    },
    {
      id: 4,
      item: "Kayak",
      model: "Seahawk II",
      category: "Outdoor",
      price: "2000.00",
      availability: "Available",
      status: "Active",
      image: "https://placehold.co/60x60/008080/ffffff?text=Kayak",
    },
    {
      id: 5,
      item: "Camping Tent",
      model: "Outfitter 4P",
      category: "Outdoor",
      price: "600.00",
      availability: "Available",
      status: "Active",
      image: "https://placehold.co/60x60/5C8A8A/ffffff?text=Tent",
    },
    {
      id: 6,
      item: "Camera Lens",
      model: "Canon 50mm",
      category: "Electronics",
      price: "950.00",
      availability: "Unavailable",
      status: "Active",
      image: "https://placehold.co/60x60/7689A4/ffffff?text=Lens",
    },
    {
      id: 7,
      item: "Pressure Washer",
      model: "PowerClean 3000",
      category: "Tools",
      price: "1100.00",
      availability: "Available",
      status: "Active",
      image: "https://placehold.co/60x60/8C92AC/ffffff?text=Washer",
    },
    {
      id: 8,
      item: "GoPro Camera",
      model: "Hero 9",
      category: "Electronics",
      price: "1300.00",
      availability: "Rented Out",
      status: "Active",
      image: "https://placehold.co/60x60/6A5ACD/ffffff?text=GoPro",
    },
    {
      id: 9,
      item: "Mountain Bike",
      model: "Trailmaster 29",
      category: "Outdoor",
      price: "1800.00",
      availability: "Available",
      status: "Active",
      image: "https://placehold.co/60x60/9C549F/ffffff?text=Bike",
    },
    {
      id: 10,
      item: "Inflatable Boat",
      model: "Explorer Pro",
      category: "Outdoor",
      price: "2200.00",
      availability: "Available",
      status: "Active",
      image: "https://placehold.co/60x60/B47291/ffffff?text=Boat",
    },
    {
      id: 11,
      item: "Portable Projector",
      model: "MiniBeam P7",
      category: "Electronics",
      price: "700.00",
      availability: "Unavailable",
      status: "Inactive",
      image: "https://placehold.co/60x60/B2A0A1/ffffff?text=Projector",
    },
    {
      id: 12,
      item: "Car Roof Rack",
      model: "Thule Aero",
      category: "Vehicles and Transport",
      price: "500.00",
      availability: "Available",
      status: "Active",
      image: "https://placehold.co/60x60/957DAD/ffffff?text=Rack",
    },
    {
      id: 13,
      item: "Concrete Mixer",
      model: "ProMix 1.5",
      category: "Tools",
      price: "2500.00",
      availability: "Rented Out",
      status: "Active",
      image: "https://placehold.co/60x60/B2BEB2/ffffff?text=Mixer",
    },
    {
      id: 14,
      item: "Snowboard",
      model: "Burton Custom",
      category: "Sports Essentials",
      price: "1400.00",
      availability: "Available",
      status: "Active",
      image: "https://placehold.co/60x60/C9C0BB/ffffff?text=Snowboard",
    },
    {
      id: 15,
      item: "Leaf Blower",
      model: "Husqvarna 125B",
      category: "Tools",
      price: "400.00",
      availability: "Available",
      status: "Active",
      image: "https://placehold.co/60x60/D1B891/ffffff?text=Blower",
    },
    {
      id: 16,
      item: "Karaoke Machine",
      model: "Singsation All-In-One",
      category: "Events and Parties",
      price: "900.00",
      availability: "Unavailable",
      status: "Active",
      image: "https://placehold.co/60x60/C19B81/ffffff?text=Karaoke",
    },
    {
      id: 17,
      item: "Portable Sound System",
      model: "JBL PartyBox",
      category: "Events and Parties",
      price: "1600.00",
      availability: "Available",
      status: "Active",
      image: "https://placehold.co/60x60/B47081/ffffff?text=Sound",
    },
    {
      id: 18,
      item: "Paddleboard",
      model: "Aqua Marina",
      category: "Outdoor",
      price: "1300.00",
      availability: "Available",
      status: "Active",
      image: "https://placehold.co/60x60/20B2AA/ffffff?text=Board",
    },
    {
      id: 19,
      item: "Drone",
      model: "DJI Mini 3",
      category: "Electronics",
      price: "2500.00",
      availability: "Rented Out",
      status: "Active",
      image: "https://placehold.co/60x60/708090/ffffff?text=Drone",
    },
    {
      id: 20,
      item: "Sewing Machine",
      model: "Brother CS6000i",
      category: "Home and Appliances",
      price: "750.00",
      availability: "Available",
      status: "Inactive",
      image: "https://placehold.co/60x60/FF69B4/ffffff?text=Sew",
    },
    {
      id: 21,
      item: "Electric Guitar",
      model: "Fender Strat",
      category: "Media and Hobbies",
      price: "1800.00",
      availability: "Available",
      status: "Active",
      image: "https://placehold.co/60x60/8A2BE2/ffffff?text=Guitar",
    },
    {
      id: 22,
      item: "Treadmill",
      model: "NordicTrack T 6.5S",
      category: "Sports Essentials",
      price: "3000.00",
      availability: "Unavailable",
      status: "Active",
      image: "https://placehold.co/60x60/5F9EA0/ffffff?text=Treadmill",
    },
    {
      id: 23,
      item: "3D Printer",
      model: "Creality Ender 3",
      category: "Electronics",
      price: "1500.00",
      availability: "Available",
      status: "Active",
      image: "https://placehold.co/60x60/DEB887/ffffff?text=3DPrint",
    },
    {
      id: 24,
      item: "Wetsuit",
      model: "O'Neill Epic 4/3mm",
      category: "Outdoor",
      price: "800.00",
      availability: "Available",
      status: "Active",
      image: "https://placehold.co/60x60/4682B4/ffffff?text=Wetsuit",
    },
    {
      id: 25,
      item: "Fog Machine",
      model: "ADJ Fog Fury",
      category: "Events and Parties",
      price: "500.00",
      availability: "Rented Out",
      status: "Active",
      image: "https://placehold.co/60x60/A9A9A9/ffffff?text=Fog",
    },
    {
      id: 26,
      item: "Chainsaw",
      model: "Stihl MS 271",
      category: "Tools",
      price: "1200.00",
      availability: "Available",
      status: "Active",
      image: "https://placehold.co/60x60/FFA500/ffffff?text=Saw",
    },
    {
      id: 27,
      item: "VR Headset",
      model: "Oculus Quest 2",
      category: "Electronics",
      price: "1700.00",
      availability: "Unavailable",
      status: "Inactive",
      image: "https://placehold.co/60x60/DDA0DD/ffffff?text=VR",
    },
    {
      id: 28,
      item: "Air Compressor",
      model: "Craftsman 6 Gallon",
      category: "Tools",
      price: "600.00",
      availability: "Available",
      status: "Active",
      image: "https://placehold.co/60x60/B0C4DE/ffffff?text=Air",
    },
    {
      id: 29,
      item: "Binoculars",
      model: "Nikon Prostaff",
      category: "Outdoor",
      price: "450.00",
      availability: "Available",
      status: "Active",
      image: "https://placehold.co/60x60/8FBC8F/ffffff?text=Binos",
    },
    {
      id: 30,
      item: "Popcorn Machine",
      model: "Great Northern",
      category: "Events and Parties",
      price: "700.00",
      availability: "Rented Out",
      status: "Active",
      image: "https://placehold.co/60x60/FFD700/ffffff?text=Popcorn",
    },
  ]);

  // Removed: state for removed items since 'Removed' tab is no longer present

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

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = itemsData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(itemsData.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Pagination logic for Earnings
  const [earningsCurrentPage, setEarningsCurrentPage] = useState(1);
  const earningsItemsPerPage = 7;
  const indexOfLastEarning = earningsCurrentPage * earningsItemsPerPage;
  const indexOfFirstEarning = indexOfLastEarning - earningsItemsPerPage;
  // State for earnings status filter
  const [earningsStatusFilter, setEarningsStatusFilter] = useState("Status");

  const currentEarnings = earningsData.slice(
    indexOfFirstEarning,
    indexOfLastEarning
  );
  const totalEarningsPages = Math.ceil(
    earningsData.length / earningsItemsPerPage
  );
  const earningsPageNumbers = Array.from(
    { length: totalEarningsPages },
    (_, i) => i + 1
  );
  const paginateEarnings = (pageNumber) => setEarningsCurrentPage(pageNumber);

  // Removed: pagination logic for Removed Items

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Placeholder functions for dropdown selection
  const handleCategorySelect = (category) => {
    console.log("Selected category:", category);
  };

  const handleAvailabilitySelect = (availability) => {
    console.log("Selected availability:", availability);
  };

  const handleStatusSelect = (status) => {
    console.log("Selected status:", status);
  };

  const handleEarningsStatusSelect = (status) => {
    console.log("Selected earnings status:", status);
    setEarningsStatusFilter(status);
  };

  // This function handles the toggle logic for any dropdown.
  // It closes the current dropdown if it's already open, otherwise it opens it.
  const handleDropdownToggle = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  // Handlers for row dropdowns
  const handleRowDropdownToggle = (rowId, type) => {
    setRowDropdown((prev) => {
      const key = `${rowId}-${type}`;
      // If already open, close it. Otherwise, open only this one.
      if (prev[key]) {
        return {};
      } else {
        return { [key]: true };
      }
    });
  };

  const handleRowSelect = (rowId, type, value) => {
    setItemsData((prev) =>
      prev.map((item) =>
        item.id === rowId ? { ...item, [type]: value } : item
      )
    );
    setRowDropdown((prev) => ({
      ...prev,
      [`${rowId}-${type}`]: false,
    }));
  };

  const handleRemoveItem = (itemId) => {
    // Simply remove the item from the list
    setItemsData((prev) => prev.filter((item) => item.id !== itemId));
  };

  const tabComponents = {
    items: (
      <ItemsTab
        currentItems={currentItems}
        rowDropdown={rowDropdown}
        handleRowDropdownToggle={handleRowDropdownToggle}
        handleRowSelect={handleRowSelect}
        CustomDropdown={CustomDropdown}
        openDropdown={openDropdown}
        handleDropdownToggle={handleDropdownToggle}
        handleCategorySelect={handleCategorySelect}
        handleAvailabilitySelect={handleAvailabilitySelect}
        handleStatusSelect={handleStatusSelect}
        paginate={paginate}
        pageNumbers={pageNumbers}
        onRemoveItem={handleRemoveItem}
        currentPage={currentPage}
        totalPages={totalPages}
        onAddItem={() => setShowAddItem(true)}
      />
    ),
    earnings: (
      <div className="flex-1 flex flex-col">
        <EarningsTab
          currentEarnings={currentEarnings}
          paginate={paginateEarnings}
          pageNumbers={earningsPageNumbers}
          currentPage={earningsCurrentPage}
          totalPages={totalEarningsPages}
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
            <AddItem onClose={() => setShowAddItem(false)} />
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
                  Requests
                  {activeTab === "requests" && (
                    <span className="absolute left-0 -bottom-3 h-1 w-full bg-[#6C4BF4] rounded" />
                  )}
                </button>

                {/* Status Tab */}
                <button
                  onClick={() => setActiveTab("status")}
                  className={`relative ${
                    activeTab === "status"
                      ? "text-[#6C4BF4] font-bold"
                      : "text-gray-700"
                  }`}
                >
                  Status
                  {activeTab === "status" && (
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
