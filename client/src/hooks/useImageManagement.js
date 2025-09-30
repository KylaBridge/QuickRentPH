/**
 * IMAGE MANAGEMENT HOOK - Handles Complex Image Upload/Management Logic
 *
 * This custom hook encapsulates all the complex logic for:
 * - Image upload and validation
 * - Drag & drop functionality
 * - Image pagination and viewport management
 * - Replace/remove operations
 * - Memory management (URL cleanup)
 * - Change detection for edit mode
 */

import { useState, useEffect, useRef } from "react";

const MIN_BOX_WIDTH = 160;
const BOX_GAP = 16;
const UPLOAD_BOX_WIDTH = 160;

export const useImageManagement = (editingItem = null) => {
  const containerRef = useRef();
  const fileInputRef = useRef();
  const replaceInputRefs = useRef([]);
  const cleanupUrlsRef = useRef(new Set()); // Track blob URLs for cleanup

  const [images, setImages] = useState([]);
  const [originalImages, setOriginalImages] = useState([]);
  const [page, setPage] = useState(0);
  const [maxVisible, setMaxVisible] = useState(2);
  const [fileErrors, setFileErrors] = useState([]);
  const [hoverIdx, setHoverIdx] = useState(null);
  const [hasImageChanges, setHasImageChanges] = useState(false);

  // Initialize images when editing
  useEffect(() => {
    if (editingItem) {
      let existingImages = [];
      if (editingItem.images && editingItem.images.length > 0) {
        existingImages = editingItem.images.map((imageUrl) => ({
          url: imageUrl.startsWith("http")
            ? imageUrl
            : `${import.meta.env.VITE_API_URL}/user_rentals/${imageUrl.replace(/^.*[\\\/]/, '')}`,
          file: null,
          isExisting: true,
        }));
        setImages(existingImages);
      } else {
        setImages([]);
      }
      setOriginalImages(existingImages);
      setHasImageChanges(false);
    } else {
      setImages([]);
      setOriginalImages([]);
      setHasImageChanges(false);
    }
  }, [editingItem]);

  // Detect image changes
  useEffect(() => {
    if (!editingItem || originalImages.length === 0) {
      setHasImageChanges(images.length > 0);
      return;
    }

    const imagesChanged = () => {
      if (originalImages.length !== images.length) return true;

      return originalImages.some((originalImg, index) => {
        const currentImg = images[index];
        if (!currentImg) return true;

        if (originalImg.isExisting && currentImg.isExisting) {
          return originalImg.url !== currentImg.url;
        }

        if (originalImg.isExisting !== currentImg.isExisting) return true;

        return false;
      });
    };

    setHasImageChanges(imagesChanged());
  }, [images, originalImages, editingItem]);

  // Manage replace input refs array size
  useEffect(() => {
    // Ensure the refs array has the right length
    replaceInputRefs.current = replaceInputRefs.current.slice(0, images.length);
    while (replaceInputRefs.current.length < images.length) {
      replaceInputRefs.current.push(null);
    }
  }, [images.length]);

  // Calculate visible boxes dynamically
  useEffect(() => {
    if (!containerRef.current) return;

    const calcBoxes = () => {
      // Add null check to prevent error when component unmounts
      if (!containerRef.current) return;
      
      const width = containerRef.current.offsetWidth;
      let calculatedMax = 2;

      if (width >= 600) {
        const available = width - UPLOAD_BOX_WIDTH - BOX_GAP;
        calculatedMax = Math.max(
          1,
          Math.floor((available + BOX_GAP) / (MIN_BOX_WIDTH + BOX_GAP))
        );
      }

      setMaxVisible(calculatedMax);
    };

    calcBoxes();
    const resizeObserver = new ResizeObserver(calcBoxes);
    const currentContainer = containerRef.current;
    
    if (currentContainer) {
      resizeObserver.observe(currentContainer);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      // Cleanup all tracked blob URLs on unmount
      cleanupUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      cleanupUrlsRef.current.clear();
    };
  }, []);

  // Handle file input (click or drag)
  const handleFiles = (files) => {
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    const validFiles = [];
    const errors = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name}: Only image files are allowed`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File size exceeds 2MB limit`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      setFileErrors(errors);
      setTimeout(() => setFileErrors([]), 5000);
    }

    if (validFiles.length > 0) {
      const newImages = validFiles.map((file) => {
        const url = URL.createObjectURL(file);
        // Track blob URL for cleanup
        cleanupUrlsRef.current.add(url);
        return {
          url,
          file,
          isExisting: false,
        };
      });
      setImages((prev) => [...prev, ...newImages]);
      // If we're adding images and current page would be empty, go to last page
      setPage((currentPage) => {
        const totalImagesAfterAdd = images.length + newImages.length;
        const newTotalPages = Math.ceil(totalImagesAfterAdd / maxVisible);
        return Math.min(currentPage, newTotalPages - 1);
      });
    }
  };

  // Drag & drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  // Remove image
  const handleRemove = (idx) => {
    const imageToRemove = images[idx];
    if (
      imageToRemove &&
      !imageToRemove.isExisting &&
      imageToRemove.url.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imageToRemove.url);
      // Remove from cleanup tracking
      cleanupUrlsRef.current.delete(imageToRemove.url);
    }

    setImages((prev) => prev.filter((_, i) => i !== idx));
    
    // Adjust page if necessary after removal
    setPage((currentPage) => {
      const remainingImages = images.length - 1;
      if (remainingImages === 0) return 0;
      
      const newTotalPages = Math.ceil(remainingImages / maxVisible);
      return Math.min(currentPage, newTotalPages - 1);
    });
  };

  // Replace image
  const handleReplace = (idx, file) => {
    if (!file || !file.type.startsWith("image/")) return;

    const oldImage = images[idx];
    if (oldImage && !oldImage.isExisting && oldImage.url.startsWith("blob:")) {
      URL.revokeObjectURL(oldImage.url);
      // Remove old URL from cleanup tracking
      cleanupUrlsRef.current.delete(oldImage.url);
    }

    const url = URL.createObjectURL(file);
    // Track new blob URL for cleanup
    cleanupUrlsRef.current.add(url);
    
    setImages((prev) =>
      prev.map((img, i) => (i === idx ? { url, file, isExisting: false } : img))
    );
  };

  // Pagination
  const totalPages = Math.ceil(images.length / maxVisible) || 1;
  const canNext = page < totalPages - 1;
  const canPrev = page > 0;
  const startIdx = page * maxVisible;
  const visibleImages = images.slice(startIdx, startIdx + maxVisible);
  const placeholders = Array.from({
    length: Math.max(0, maxVisible - visibleImages.length),
  });

  return {
    // Refs
    containerRef,
    fileInputRef,
    replaceInputRefs,

    // State
    images,
    originalImages,
    hasImageChanges,
    fileErrors,
    page,
    maxVisible,
    hoverIdx,
    visibleImages,
    placeholders,
    totalPages,
    canNext,
    canPrev,
    startIdx,

    // Handlers
    handleFiles,
    handleDrop,
    handleDragOver,
    handleRemove,
    handleReplace,
    setPage,
    setHoverIdx,
  };
};
