//Extracted from ItemDetailView to make it reusable and testable.

import { useState, useRef, useEffect } from "react";

export const useImageCarousel = (images = []) => {
  const [currentImage, setCurrentImage] = useState(0);
  const autoSlideRef = useRef();

  // Reset to first image when images change
  useEffect(() => {
    setCurrentImage(0);
  }, [images]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, []);

  const goToPrev = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index) => {
    if (index >= 0 && index < images.length) {
      setCurrentImage(index);
    }
  };

  const startAutoSlide = (direction, interval = 300) => {
    stopAutoSlide();
    autoSlideRef.current = setInterval(() => {
      direction === "next" ? goToNext() : goToPrev();
    }, interval);
  };

  const stopAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
  };

  return {
    currentImage,
    goToPrev,
    goToNext,
    goToImage,
    startAutoSlide,
    stopAutoSlide,
    hasMultipleImages: images.length > 1,
    totalImages: images.length,
  };
};
