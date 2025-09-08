import React, { useState } from 'react';

const SearchFilterSection = ({ onFilterChange }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: '',
    sort: '',
    price: '',
    dealOption: '',
    location: '',
    condition: ''
  });

  const filterOptions = {
    categories: ['Electronics', 'Sports', 'Music', 'Tools', 'Books', 'Clothing', 'Furniture', 'Vehicles'],
    sort: ['Newest First', 'Oldest First', 'Most Popular'],
    dealOption: [
      'Standard Delivery',
      'Express / Same-day Delivery',
      'Scheduled Delivery',
      'Drop-off Point / Locker Delivery',
      'Return via Courier Pickup'
    ],
  };

  // --- Simulation for dynamic price ranges based on search ---
  // In a real app, this would depend on the user's search or selected category.
  // For now, we simulate with a hardcoded variable.
  const searchedItem = selectedFilters.categories || 'default';
  let priceRanges = [
    { label: '₱1 - ₱149', value: '1-149' },
    { label: '₱149 - ₱300', value: '149-300' },
    { label: '₱300 - ₱6,000', value: '300-6000' },
  ];
  if (searchedItem.toLowerCase().includes('camera')) {
    priceRanges = [
      { label: '₱500 - ₱1,000', value: '500-1000' },
      { label: '₱1,000 - ₱3,000', value: '1000-3000' },
      { label: '₱3,000 - ₱10,000', value: '3000-10000' },
    ];
  } else if (searchedItem.toLowerCase().includes('umbrella')) {
    priceRanges = [
      { label: '₱10 - ₱50', value: '10-50' },
      { label: '₱50 - ₱100', value: '50-100' },
      { label: '₱100 - ₱300', value: '100-300' },
    ];
  }
  // --- End simulation ---

  const toggleDropdown = (filterName) => {
    setActiveDropdown(activeDropdown === filterName ? null : filterName);
  };

  const selectFilter = (filterName, value) => {
    const newFilters = {
      ...selectedFilters,
      [filterName]: value
    };
    setSelectedFilters(newFilters);
    setActiveDropdown(null);
    onFilterChange(newFilters);
  };

  const resetFilter = (filterName) => {
    const newFilters = {
      ...selectedFilters,
      [filterName]: ''
    };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const btn = "flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-sm font-poppins";

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-3 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto">
        {/* Filter Options */}
        <div className="flex flex-wrap gap-2 sm:gap-2 justify-center relative">
          {/* Categories Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('categories')}
              className={btn}
            >
              <span className="text-gray-900">{selectedFilters.categories || 'Categories'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === 'categories' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {filterOptions.categories.map((option) => (
                  <button
                    key={option}
                    onClick={() => selectFilter('categories', option)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-poppins text-gray-900"
                  >
                    {option}
                  </button>
                ))}
                <button
                  onClick={() => resetFilter('categories')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-poppins text-gray-500 border-t border-gray-200"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('sort')}
              className={btn}
            >
              <span className="text-gray-900">{selectedFilters.sort || 'Sort'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === 'sort' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {filterOptions.sort.map((option) => (
                  <button
                    key={option}
                    onClick={() => selectFilter('sort', option)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-poppins text-gray-900"
                  >
                    {option}
                  </button>
                ))}
                <button
                  onClick={() => resetFilter('sort')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-poppins text-gray-500 border-t border-gray-200"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* Price Range Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('price')}
              className={btn}
            >
              <span className="text-gray-900">{selectedFilters.price || 'Price'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === 'price' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {priceRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => selectFilter('price', range.label)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-poppins text-gray-900 ${selectedFilters.price === range.label ? 'bg-[#6C4BF4] text-white' : ''}`}
                  >
                    {range.label}
                  </button>
                ))}
                <button
                  onClick={() => resetFilter('price')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-poppins text-gray-500 border-t border-gray-200"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* Deal Option Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('dealOption')}
              className={btn}
            >
              <span className="text-gray-900">{selectedFilters.dealOption || 'Deal Option'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === 'dealOption' && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {filterOptions.dealOption.map((option) => (
                  <button
                    key={option}
                    onClick={() => selectFilter('dealOption', option)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-poppins text-gray-900"
                  >
                    {option}
                  </button>
                ))}
                <button
                  onClick={() => resetFilter('dealOption')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-poppins text-gray-500 border-t border-gray-200"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchFilterSection;
