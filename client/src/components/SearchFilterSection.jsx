import React, { useState, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import {
  CATEGORIES,
  SORT_OPTIONS,
  DEAL_OPTIONS,
  AVAILABILITY_OPTIONS,
} from "../constants/categories";

const SearchFilterSection = ({
  onFilterChange,
  searchTerm = "", // Add searchTerm prop
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

  // --- Dynamic price ranges based on search and category ---
  const getDynamicPriceRanges = (searchTerm, category) => {
    // Default price ranges
    const defaultRanges = [
      { label: "₱1 - ₱149", value: "1-149" },
      { label: "₱149 - ₱300", value: "149-300" },
      { label: "₱300 - ₱6,000", value: "300-6000" },
    ];

    // Combine search term and category for analysis
    const combinedText = `${searchTerm} ${category}`.toLowerCase();

    // Electronics/Tech categories - higher price ranges
    if (
      combinedText.includes("camera") ||
      combinedText.includes("laptop") ||
      combinedText.includes("computer") ||
      combinedText.includes("gaming") ||
      combinedText.includes("electronics") ||
      combinedText.includes("phone") ||
      combinedText.includes("tablet") ||
      combinedText.includes("projector") ||
      combinedText.includes("monitor")
    ) {
      return [
        { label: "₱500 - ₱1,000", value: "500-1000" },
        { label: "₱1,000 - ₱3,000", value: "1000-3000" },
        { label: "₱3,000 - ₱10,000", value: "3000-10000" },
        { label: "₱10,000+", value: "10000-999999" },
      ];
    }

    // Vehicles - very high price ranges
    if (
      combinedText.includes("car") ||
      combinedText.includes("motorcycle") ||
      combinedText.includes("bike") ||
      combinedText.includes("vehicle") ||
      combinedText.includes("transportation")
    ) {
      return [
        { label: "₱1,000 - ₱5,000", value: "1000-5000" },
        { label: "₱5,000 - ₱15,000", value: "5000-15000" },
        { label: "₱15,000 - ₱50,000", value: "15000-50000" },
        { label: "₱50,000+", value: "50000-999999" },
      ];
    }

    // Formal wear/suits - medium-high price ranges
    if (
      combinedText.includes("suit") ||
      combinedText.includes("formal") ||
      combinedText.includes("tuxedo") ||
      combinedText.includes("dress") ||
      combinedText.includes("gown") ||
      combinedText.includes("wedding")
    ) {
      return [
        { label: "₱200 - ₱500", value: "200-500" },
        { label: "₱500 - ₱1,500", value: "500-1500" },
        { label: "₱1,500 - ₱5,000", value: "1500-5000" },
        { label: "₱5,000+", value: "5000-999999" },
      ];
    }

    // Sports equipment - medium price ranges
    if (
      combinedText.includes("sports") ||
      combinedText.includes("equipment") ||
      combinedText.includes("racket") ||
      combinedText.includes("ball") ||
      combinedText.includes("gym") ||
      combinedText.includes("fitness")
    ) {
      return [
        { label: "₱100 - ₱300", value: "100-300" },
        { label: "₱300 - ₱800", value: "300-800" },
        { label: "₱800 - ₱2,000", value: "800-2000" },
        { label: "₱2,000+", value: "2000-999999" },
      ];
    }

    // Books/Educational - low price ranges
    if (
      combinedText.includes("book") ||
      combinedText.includes("educational") ||
      combinedText.includes("study") ||
      combinedText.includes("textbook") ||
      combinedText.includes("learning")
    ) {
      return [
        { label: "₱20 - ₱100", value: "20-100" },
        { label: "₱100 - ₱300", value: "100-300" },
        { label: "₱300 - ₱800", value: "300-800" },
        { label: "₱800+", value: "800-999999" },
      ];
    }

    // Accessories/Small items - low price ranges
    if (
      combinedText.includes("umbrella") ||
      combinedText.includes("accessories") ||
      combinedText.includes("jewelry") ||
      combinedText.includes("watch") ||
      combinedText.includes("bag") ||
      combinedText.includes("wallet")
    ) {
      return [
        { label: "₱10 - ₱50", value: "10-50" },
        { label: "₱50 - ₱150", value: "50-150" },
        { label: "₱150 - ₱500", value: "150-500" },
        { label: "₱500+", value: "500-999999" },
      ];
    }

    // Tools/Equipment - medium-high price ranges
    if (
      combinedText.includes("tools") ||
      combinedText.includes("equipment") ||
      combinedText.includes("hardware") ||
      combinedText.includes("machinery")
    ) {
      return [
        { label: "₱300 - ₱1,000", value: "300-1000" },
        { label: "₱1,000 - ₱3,000", value: "1000-3000" },
        { label: "₱3,000 - ₱8,000", value: "3000-8000" },
        { label: "₱8,000+", value: "8000-999999" },
      ];
    }

    // Home & Garden - varied price ranges
    if (
      combinedText.includes("home") ||
      combinedText.includes("garden") ||
      combinedText.includes("furniture") ||
      combinedText.includes("appliances")
    ) {
      return [
        { label: "₱200 - ₱800", value: "200-800" },
        { label: "₱800 - ₱2,500", value: "800-2500" },
        { label: "₱2,500 - ₱8,000", value: "2500-8000" },
        { label: "₱8,000+", value: "8000-999999" },
      ];
    }

    // Return default ranges if no category matches
    return defaultRanges;
  };

  // Get dynamic price ranges based on current search and category
  const priceRanges = getDynamicPriceRanges(
    searchTerm || "",
    selectedFilters.categories || ""
  );

  // Reset price filter when category or search term changes (since price ranges change)
  useEffect(() => {
    if (selectedFilters.price) {
      // Check if current price selection is still valid in new price ranges
      const isValidPrice = priceRanges.some(
        (range) => range.label === selectedFilters.price
      );

      if (!isValidPrice) {
        const newFilters = {
          ...selectedFilters,
          price: "", // Reset price filter
        };
        setSelectedFilters(newFilters);
        onFilterChange(newFilters);
      }
    }
  }, [searchTerm, selectedFilters.categories]); // Dependencies: search term and category

  // --- End dynamic price ranges ---

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
            <span className="text-gray-900">
              {selectedFilters[filterKey] || "Price"}
            </span>
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
              {selectedFilters[filterKey] && (
                <button
                  onClick={() => resetFilter(filterKey)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-poppins text-gray-500 border-t border-gray-200"
                >
                  Reset
                </button>
              )}
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
