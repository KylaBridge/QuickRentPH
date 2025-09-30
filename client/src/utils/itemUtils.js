/*This file contains all the business logic related to item sorting, filtering,
 * searching, and pagination. These functions were extracted from components
 * to eliminate code duplication and improve maintainability.
 *
 * Used by: ItemList.jsx and other components that need item processing
 */
export const parsePriceRange = (priceRange) => {
  if (!priceRange || priceRange === "Price") return null;

  const [min, max] = priceRange.split("-").map((p) => parseFloat(p));
  return { min: min || 0, max: max || Infinity };
};

export const sortItems = (items, sortOption) => {
  if (!sortOption || sortOption === "Sort by") return items;

  const sortedItems = [...items];

  switch (sortOption) {
    case "Price: Low to High":
      return sortedItems.sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return priceA - priceB;
      });

    case "Price: High to Low":
      return sortedItems.sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return priceB - priceA;
      });

    case "Newest First":
      return sortedItems.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });

    case "Oldest First":
      return sortedItems.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateA - dateB;
      });

    case "Most Popular":
      return sortedItems.sort((a, b) => {
        const popularityA = a.popularity || 0;
        const popularityB = b.popularity || 0;
        return popularityB - popularityA;
      });

    default:
      return sortedItems;
  }
};

// Filter items based on multiple criteria
export const filterItems = (items, filters) => {
  return items.filter((item) => {
    // Category filter
    if (
      filters.categories &&
      filters.categories.trim() &&
      filters.categories !== "Categories"
    ) {
      if (item.category !== filters.categories) return false;
    }

    // Price range filter
    if (filters.price && filters.price !== "Price") {
      const priceRange = parsePriceRange(filters.price);
      if (priceRange) {
        const itemPrice = parseFloat(item.price) || 0;
        if (itemPrice < priceRange.min || itemPrice > priceRange.max)
          return false;
      }
    }

    // Deal option filter
    if (
      filters.dealOption &&
      filters.dealOption.trim() &&
      filters.dealOption !== "Deal Option"
    ) {
      if (item.dealOption !== filters.dealOption) return false;
    }

    // Location filter
    if (
      filters.location &&
      filters.location.trim() &&
      filters.location !== "Location"
    ) {
      const itemLocation = (item.location || "").toLowerCase();
      const filterLocation = filters.location.toLowerCase();
      if (!itemLocation.includes(filterLocation)) return false;
    }

    // Availability filter
    if (
      filters.availability &&
      filters.availability.trim() &&
      filters.availability !== "Availability"
    ) {
      const itemAvailability = item.availability || "Available";
      if (itemAvailability !== filters.availability) return false;
    }

    // Condition filter (if needed)
    if (
      filters.condition &&
      filters.condition.trim() &&
      filters.condition !== "Condition"
    ) {
      if (item.condition !== filters.condition) return false;
    }

    return true;
  });
};

// Combined filter and sort function
export const filterAndSortItems = (items, filters) => {
  let processedItems = filterItems(items, filters);

  if (filters.sort) {
    processedItems = sortItems(processedItems, filters.sort);
  }

  return processedItems;
};

// Search items by text
export const searchItems = (items, searchText) => {
  if (!searchText || !searchText.trim()) return items;

  const searchLower = searchText.toLowerCase().trim();

  return items.filter((item) => {
    const searchableFields = [
      item.name,
      item.description,
      item.category,
      item.location,
      item.color,
      item.size,
      item.includedAccessories,
    ].filter(Boolean);

    return searchableFields.some((field) =>
      field.toLowerCase().includes(searchLower)
    );
  });
};

// Get unique values for filter options (useful for dynamic filters)
export const getUniqueFilterValues = (items, field) => {
  const values = items
    .map((item) => item[field])
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index);

  return values.sort();
};

// Pagination utility
export const paginateItems = (items, currentPage, itemsPerPage) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  return {
    currentItems,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

export const paginateArray = (items, currentPage, itemsPerPage) => {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  return {
    currentItems,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
  };
};
