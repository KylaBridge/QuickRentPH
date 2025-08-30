import React, { useState } from 'react';

const SearchFilterSection = ({ onFilterChange }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);
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
    sort: ['Price: Low to High', 'Price: High to Low', 'Newest First', 'Oldest First', 'Most Popular'],
    dealOption: ['Daily', 'Weekly', 'Monthly', 'Hourly'],
    location: ['Within 5 miles', 'Within 10 miles', 'Within 25 miles', 'Within 50 miles'],
    condition: ['New', 'Like New', 'Good', 'Fair', 'Poor']
  };

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
    if (filterName === 'price') {
      setPriceRange([0, 1000]);
    }
    onFilterChange(newFilters);
  };

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value);
    setPriceRange(newRange);
    const newFilters = {
      ...selectedFilters,
      price: `$${newRange[0]} - $${newRange[1]}`
    };
    setSelectedFilters(newFilters);
  };

  const applyPriceFilter = () => {
    const newFilters = {
      ...selectedFilters,
      price: `$${priceRange[0]} - $${priceRange[1]}`
    };
    setSelectedFilters(newFilters);
    setActiveDropdown(null);
    onFilterChange(newFilters);
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto">
        {/* Filter Options */}
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center relative">
          {/* Categories Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('categories')}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base font-poppins"
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
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base font-poppins"
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

          {/* Price Range Button */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('price')}
              className="flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base font-poppins"
            >
              <span className="text-gray-900">{selectedFilters.price || 'Price'}</span>
            </button>
            {activeDropdown === 'price' && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-10 p-4">
                <h3 className="font-semibold text-gray-800 mb-4 text-center">Price range</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500">Min</label>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(0, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <span className="text-gray-400">-</span>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500">Max</label>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(1, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #6C4BF4 0%, #6C4BF4 ${(priceRange[0] / 1000) * 100}%, #e5e7eb ${(priceRange[0] / 1000) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider mt-2"
                    style={{
                      background: `linear-gradient(to right, #6C4BF4 0%, #6C4BF4 ${(priceRange[1] / 1000) * 100}%, #e5e7eb ${(priceRange[1] / 1000) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <button
                    onClick={applyPriceFilter}
                    className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-sm font-poppins hover:bg-gray-50"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => resetFilter('price')}
                    className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-2 text-sm font-poppins hover:bg-gray-200 text-gray-600"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Deal Option Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('dealOption')}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base font-poppins"
            >
              <span className="text-gray-900">{selectedFilters.dealOption || 'Deal Option'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === 'dealOption' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
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

          {/* Location Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('location')}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base font-poppins"
            >
              <span className="text-gray-900">{selectedFilters.location || 'Location'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === 'location' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {filterOptions.location.map((option) => (
                  <button
                    key={option}
                    onClick={() => selectFilter('location', option)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-poppins text-gray-900"
                  >
                    {option}
                  </button>
                ))}
                <button
                  onClick={() => resetFilter('location')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-poppins text-gray-500 border-t border-gray-200"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* Condition Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('condition')}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base font-poppins"
            >
              <span className="text-gray-900">{selectedFilters.condition || 'Condition'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === 'condition' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {filterOptions.condition.map((option) => (
                  <button
                    key={option}
                    onClick={() => selectFilter('condition', option)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-poppins text-gray-900"
                  >
                    {option}
                  </button>
                ))}
                <button
                  onClick={() => resetFilter('condition')}
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
