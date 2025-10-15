import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import ItemList from "../components/ItemList";
import ItemDetailView from "../components/ItemDetailView";
import { useWishlist } from "../context/wishlistContext";
import { AuthContext } from "../context/authContext";
import { useModal } from "../context/modalContext";

const MyWishlist = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { wishlistItems, loading } = useWishlist();
  const { user } = useContext(AuthContext);
  const { openVerificationRequiredModal } = useModal();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleView = (item) => {
    setSelectedItem(item);
  };

  const handleBack = () => setSelectedItem(null);

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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="My Wishlist" onToggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C4BF4]"></div>
              <span className="ml-3 text-gray-600">Loading wishlist...</span>
            </div>
          ) : selectedItem ? (
            <ItemDetailView
              item={selectedItem}
              onBack={handleBack}
              onRentClick={handleRentClick}
              onGoToProfile={handleGoToProfile}
            />
          ) : wishlistItems.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="text-gray-500 text-center mb-4">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-500">
                  Start browsing items and add them to your wishlist by clicking
                  the heart button!
                </p>
              </div>
            </div>
          ) : (
            <ItemList
              items={wishlistItems}
              title=""
              showSeeMore={false}
              showActions={false}
              onCardClick={handleView}
              compact={true}
              maxItems={wishlistItems.length}
            />
          )}
        </main>
      </div>
    </div>
  );
};
export default MyWishlist;
