import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import SearchFilterSection from '../components/SearchFilterSection';
import ItemList from '../components/ItemList';
import PageHeader from '../components/PageHeader';
import ItemDetailView from '../components/ItemDetailView';

const ItemsForRent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const user = {
    name: 'John Doe',
    email: 'john@example.com'
  };

  // Placeholder handlers for actions
  const handleView = (item) => {
    setSelectedItem(item);
  };
  const handleRent = (item) => {
    console.log('Rent item', item);
  };

  const handleBack = () => setSelectedItem(null);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="Items for Rent" user={user} onToggleSidebar={toggleSidebar} />

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
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-[#6C4BF4] rounded p-2 hover:bg-[#7857FD]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <SearchFilterSection onFilterChange={setFilters} />
            </div>
          )}
          {/* Main body: list or detail */}
          <div className="py-2">
            {selectedItem ? (
              <ItemDetailView item={selectedItem} onBack={handleBack} />
            ) : (
              <ItemList
                title=""
                showSeeMore={false}
                showActions
                onView={handleView}
                onRent={handleRent}
                onCardClick={handleView}
                compact
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ItemsForRent;
