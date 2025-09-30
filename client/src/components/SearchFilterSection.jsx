import React, { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import {
  CATEGORIES,
  SORT_OPTIONS,
  DEAL_OPTIONS,
  AVAILABILITY_OPTIONS,
} from "../constants/categories";

const SearchFilterSection = ({
  onFilterChange,
  showFilters = [
    "categories",
    "sort",
    "price",
    "dealOption",
    "location",
    "condition",
  ],
  layout = "horizontal", // "horizontal" or "vertical"
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: "",
    sort: "",
    price: "",
    dealOption: "",
    location: "",
    condition: "",
    availability: "",
  });

  const filterOptions = {
    categories: CATEGORIES,
    sort: SORT_OPTIONS,
    dealOption: DEAL_OPTIONS,
    availability: AVAILABILITY_OPTIONS,
  };

  // --- Simulation for dynamic price ranges based on search ---
  // In a real app, this would depend on the user's search or selected category.
  // For now, we simulate with a hardcoded variable.
  const searchedItem = selectedFilters.categories || "default";
  let priceRanges = [
    { label: "₱1 - ₱149", value: "1-149" },
    { label: "₱149 - ₱300", value: "149-300" },
    { label: "₱300 - ₱6,000", value: "300-6000" },
  ];
  if (searchedItem.toLowerCase().includes("camera")) {
    priceRanges = [
      { label: "₱500 - ₱1,000", value: "500-1000" },
      { label: "₱1,000 - ₱3,000", value: "1000-3000" },
      { label: "₱3,000 - ₱10,000", value: "3000-10000" },
    ];
  } else if (searchedItem.toLowerCase().includes("umbrella")) {
    priceRanges = [
      { label: "₱10 - ₱50", value: "10-50" },
      { label: "₱50 - ₱100", value: "50-100" },
      { label: "₱100 - ₱300", value: "100-300" },
    ];
  }
  // --- End simulation ---

  const toggleDropdown = (filterName) => {
    setActiveDropdown(activeDropdown === filterName ? null : filterName);
  };

  const selectFilter = (filterName, value) => {
    const newFilters = {
      ...selectedFilters,
      [filterName]: value,
    };
    setSelectedFilters(newFilters);
    setActiveDropdown(null);
    onFilterChange(newFilters);
  };

  const resetFilter = (filterName) => {
    const newFilters = {
      ...selectedFilters,
      [filterName]: "",
    };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const btn =
    "flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-sm font-poppins";

  // Helper function to render individual filter dropdowns
  const renderFilterDropdown = (filterKey) => {
    const filterLabels = {
      categories: "Categories",
      sort: "Sort",
      price: "Price",
      dealOption: "Deal Option",
      availability: "Availability",
    };

    const label = filterLabels[filterKey];
    const value = selectedFilters[filterKey] || label;

    // Handle special case for price filter
    if (filterKey === "price") {
      return (
        <div key={filterKey} className="relative">
          <button onClick={() => toggleDropdown(filterKey)} className={btn}>
            <span className="text-gray-900">{value}</span>
            <IoChevronDown className="w-4 h-4" />
          </button>
          {activeDropdown === filterKey && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => selectFilter(filterKey, range.label)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-poppins text-gray-900 ${
                    selectedFilters[filterKey] === range.label
                      ? "bg-[#6C4BF4] text-white"
                      : ""
                  }`}
                >
                  {range.label}
                </button>
              ))}
              <button
                onClick={() => resetFilter(filterKey)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-poppins text-gray-500 border-t border-gray-200"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      );
    }

    // Handle special case for location and condition (text input)
    if (filterKey === "location" || filterKey === "condition") {
      return (
        <div key={filterKey} className="relative">
          <input
            type="text"
            placeholder={label}
            value={selectedFilters[filterKey]}
            onChange={(e) => selectFilter(filterKey, e.target.value)}
            className="px-2.5 sm:px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-[#6C4BF4]"
          />
        </div>
      );
    }

    // Handle regular dropdown filters
    const options = filterOptions[filterKey];
    if (!options) return null;

    return (
      <div key={filterKey} className="relative">
        <button onClick={() => toggleDropdown(filterKey)} className={btn}>
          <span className="text-gray-900">{value}</span>
          <IoChevronDown className="w-4 h-4" />
        </button>
        {activeDropdown === filterKey && (
          <div
            className={`absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto ${
              filterKey === "dealOption" ? "w-80" : "w-48"
            }`}
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => selectFilter(filterKey, option)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-poppins text-gray-900"
              >
                {option}
              </button>
            ))}
            <button
              onClick={() => resetFilter(filterKey)}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-poppins text-gray-500 border-t border-gray-200"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-3 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto">
        {/* Filter Options */}
        <div
          className={`flex gap-2 sm:gap-2 relative ${
            layout === "vertical"
              ? "flex-col items-start"
              : "flex-wrap justify-center"
          }`}
        >
          {showFilters.map((filterKey) => renderFilterDropdown(filterKey))}
        </div>
      </div>
    </section>
  );
};

export default SearchFilterSection;
