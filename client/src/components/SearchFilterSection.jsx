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
    // Default price ranges (adjusted for final prices that include 12% tax)
    const defaultRanges = [
      { label: "₱1 - ₱167", value: "1-167" }, // ~149 base + 12%
      { label: "₱167 - ₱336", value: "167-336" }, // ~300 base + 12%
      { label: "₱336 - ₱6,720", value: "336-6720" }, // ~6000 base + 12%
    ];

    // Combine search term and category for analysis
    const combinedText = `${searchTerm} ${category}`.toLowerCase();

    // Electronics/Tech categories - higher price ranges (adjusted for final prices)
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
        { label: "₱560 - ₱1,120", value: "560-1120" }, // ~500-1000 base + 12%
        { label: "₱1,120 - ₱3,360", value: "1120-3360" }, // ~1000-3000 base + 12%
        { label: "₱3,360 - ₱11,200", value: "3360-11200" }, // ~3000-10000 base + 12%
        { label: "₱11,200+", value: "11200-999999" }, // ~10000+ base + 12%
      ];
    }

    // Vehicles - very high price ranges (adjusted for final prices)
    if (
      combinedText.includes("car") ||
      combinedText.includes("motorcycle") ||
      combinedText.includes("bike") ||
      combinedText.includes("vehicle") ||
      combinedText.includes("transportation")
    ) {
      return [
        { label: "₱1,120 - ₱5,600", value: "1120-5600" }, // ~1000-5000 base + 12%
        { label: "₱5,600 - ₱16,800", value: "5600-16800" }, // ~5000-15000 base + 12%
        { label: "₱16,800 - ₱56,000", value: "16800-56000" }, // ~15000-50000 base + 12%
        { label: "₱56,000+", value: "56000-999999" }, // ~50000+ base + 12%
      ];
    }

    // Formal wear/suits - medium-high price ranges (adjusted for final prices)
    if (
      combinedText.includes("suit") ||
      combinedText.includes("formal") ||
      combinedText.includes("tuxedo") ||
      combinedText.includes("dress") ||
      combinedText.includes("gown") ||
      combinedText.includes("wedding")
    ) {
      return [
        { label: "₱224 - ₱560", value: "224-560" }, // ~200-500 base + 12%
        { label: "₱560 - ₱1,680", value: "560-1680" }, // ~500-1500 base + 12%
        { label: "₱1,680 - ₱5,600", value: "1680-5600" }, // ~1500-5000 base + 12%
        { label: "₱5,600+", value: "5600-999999" }, // ~5000+ base + 12%
      ];
    }

    // Sports equipment - medium price ranges (adjusted for final prices)
    if (
      combinedText.includes("sports") ||
      combinedText.includes("equipment") ||
      combinedText.includes("racket") ||
      combinedText.includes("ball") ||
      combinedText.includes("gym") ||
      combinedText.includes("fitness")
    ) {
      return [
        { label: "₱112 - ₱336", value: "112-336" }, // ~100-300 base + 12%
        { label: "₱336 - ₱896", value: "336-896" }, // ~300-800 base + 12%
        { label: "₱896 - ₱2,240", value: "896-2240" }, // ~800-2000 base + 12%
        { label: "₱2,240+", value: "2240-999999" }, // ~2000+ base + 12%
      ];
    }

    // Books/Educational - low price ranges (adjusted for final prices)
    if (
      combinedText.includes("book") ||
      combinedText.includes("educational") ||
      combinedText.includes("study") ||
      combinedText.includes("textbook") ||
      combinedText.includes("learning")
    ) {
      return [
        { label: "₱22 - ₱112", value: "22-112" }, // ~20-100 base + 12%
        { label: "₱112 - ₱336", value: "112-336" }, // ~100-300 base + 12%
        { label: "₱336 - ₱896", value: "336-896" }, // ~300-800 base + 12%
        { label: "₱896+", value: "896-999999" }, // ~800+ base + 12%
      ];
    }

    // Accessories/Small items - low price ranges (adjusted for final prices)
    if (
      combinedText.includes("umbrella") ||
      combinedText.includes("accessories") ||
      combinedText.includes("jewelry") ||
      combinedText.includes("watch") ||
      combinedText.includes("bag") ||
      combinedText.includes("wallet")
    ) {
      return [
        { label: "₱11 - ₱56", value: "11-56" }, // ~10-50 base + 12%
        { label: "₱56 - ₱168", value: "56-168" }, // ~50-150 base + 12%
        { label: "₱168 - ₱560", value: "168-560" }, // ~150-500 base + 12%
        { label: "₱560+", value: "560-999999" }, // ~500+ base + 12%
      ];
    }

    // Tools/Equipment - medium-high price ranges (adjusted for final prices)
    if (
      combinedText.includes("tools") ||
      combinedText.includes("equipment") ||
      combinedText.includes("hardware") ||
      combinedText.includes("machinery")
    ) {
      return [
        { label: "₱336 - ₱1,120", value: "336-1120" }, // ~300-1000 base + 12%
        { label: "₱1,120 - ₱3,360", value: "1120-3360" }, // ~1000-3000 base + 12%
        { label: "₱3,360 - ₱8,960", value: "3360-8960" }, // ~3000-8000 base + 12%
        { label: "₱8,960+", value: "8960-999999" }, // ~8000+ base + 12%
      ];
    }

    // Home & Garden - varied price ranges (adjusted for final prices)
    if (
      combinedText.includes("home") ||
      combinedText.includes("garden") ||
      combinedText.includes("furniture") ||
      combinedText.includes("appliances")
    ) {
      return [
        { label: "₱224 - ₱896", value: "224-896" }, // ~200-800 base + 12%
        { label: "₱896 - ₱2,800", value: "896-2800" }, // ~800-2500 base + 12%
        { label: "₱2,800 - ₱8,960", value: "2800-8960" }, // ~2500-8000 base + 12%
        { label: "₱8,960+", value: "8960-999999" }, // ~8000+ base + 12%
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
