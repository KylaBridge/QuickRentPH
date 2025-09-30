import { useState, useMemo } from "react";
import { paginateArray } from "../utils/itemUtils";

export const usePagination = (items = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when items change
  const resetPage = () => setCurrentPage(1);

  // Calculate pagination data using utility
  const paginationData = useMemo(() => {
    return paginateArray(items, currentPage, itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= paginationData.totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (paginationData.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (paginationData.hasPrevPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  return {
    ...paginationData,
    goToPage,
    goToNextPage,
    goToPrevPage,
    resetPage,
  };
};
