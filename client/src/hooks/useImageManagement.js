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
            : `http://localhost:8000/${imageUrl}`,
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

  // Calculate visible boxes dynamically
  useEffect(() => {
    if (!containerRef.current) return;

    const calcBoxes = () => {
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
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (!img.isExisting && img.url.startsWith("blob:")) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [images]);

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
      const newImages = validFiles.map((file) => ({
        url: URL.createObjectURL(file),
        file,
        isExisting: false,
      }));
      setImages((prev) => [...newImages, ...prev]);
      setPage(0);
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
    }

    setImages((prev) => prev.filter((_, i) => i !== idx));
    if (page > 0 && page * maxVisible >= images.length - 1) {
      setPage(page - 1);
    }
  };

  // Replace image
  const handleReplace = (idx, file) => {
    if (!file || !file.type.startsWith("image/")) return;

    const oldImage = images[idx];
    if (oldImage && !oldImage.isExisting && oldImage.url.startsWith("blob:")) {
      URL.revokeObjectURL(oldImage.url);
    }

    const url = URL.createObjectURL(file);
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
