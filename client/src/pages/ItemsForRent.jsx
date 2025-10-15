import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
//import { UserContext } from "../context/userContext";
import { AuthContext } from "../context/authContext";
import { useModal } from "../context/modalContext";
import Sidebar from "../components/Sidebar";
import SearchFilterSection from "../components/SearchFilterSection";
import ItemList from "../components/ItemList";
import PageHeader from "../components/PageHeader";
import ItemDetailView from "../components/ItemDetailView";

const ItemsForRent = () => {
  //const { getAllItems } = useContext(UserContext);
  const { user } = useContext(AuthContext);
  const { openVerificationRequiredModal } = useModal();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Simplified handlers
  const handleRentClick = () => {
    // Check if user is verified
    if (!user?.isVerified) {
      openVerificationRequiredModal(handleGoToProfile);
    } else {
      // Navigate to rental flow page
      navigate(`/rental-flow/${selectedItem._id}`);
    }
  };

  const handleGoToProfile = () => {
    navigate("/profile?section=verification");
  };

  const handleView = (item) => {
    setSelectedItem(item);
  };

  const handleBack = () => setSelectedItem(null);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="Items for Rent" onToggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto">
          {/* Sticky search (always visible) */}
          {!selectedItem && (
            <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
              <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-3">
                <div className="w-full max-w-4xl mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search items for rent"
                      className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C4BF4]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-[#6C4BF4] rounded p-2 hover:bg-[#7857FD]">
                      <IoSearch className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <SearchFilterSection
                onFilterChange={setFilters}
                showFilters={["categories", "sort", "price", "dealOption"]}
              />
            </div>
          )}
          {/* Main body: list or detail */}
          <div className="py-2">
            {selectedItem ? (
              <ItemDetailView
                item={selectedItem}
                onBack={handleBack}
                onRentClick={handleRentClick}
                onGoToProfile={handleGoToProfile}
              />
            ) : (
              <ItemList
                title=""
                showSeeMore={false}
                showActions={false}
                onCardClick={handleView}
                compact
                filters={filters}
                searchTerm={searchTerm}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ItemsForRent;
