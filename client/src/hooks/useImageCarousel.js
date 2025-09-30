//Extracted from ItemDetailView to make it reusable and testable.

import { useState, useRef, useEffect } from "react";

export const useImageCarousel = (images = []) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);
  const isNavigatingRef = useRef(false);

  // Reset to first image when images change
  useEffect(() => {
    setCurrentImage(0);
    setImageLoaded(true);
  }, [images]);

  // Helper function to preload an image
  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  const navigateToImage = async (newIndex) => {
    if (isNavigatingRef.current || images.length <= 1 || newIndex === currentImage) return;
    
    isNavigatingRef.current = true;
    setIsTransitioning(true);
    setImageLoaded(false);

    try {
      // Start fade out
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Preload the new image
      await preloadImage(images[newIndex]);
      
      // Change to new image
      setCurrentImage(newIndex);
      setImageLoaded(true);
      
      // Complete fade in
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (error) {
      console.error('Error loading image:', error);
      // Fallback: change image anyway
      setCurrentImage(newIndex);
      setImageLoaded(true);
    } finally {
      setIsTransitioning(false);
      isNavigatingRef.current = false;
    }
  };

  const goToPrev = () => {
    const newIndex = currentImage === 0 ? images.length - 1 : currentImage - 1;
    navigateToImage(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentImage === images.length - 1 ? 0 : currentImage + 1;
    navigateToImage(newIndex);
  };

  const goToImage = (index) => {
    if (index >= 0 && index < images.length) {
      navigateToImage(index);
    }
  };

  return {
    currentImage,
    isTransitioning,
    imageLoaded,
    goToPrev,
    goToNext,
    goToImage,
    hasMultipleImages: images.length > 1,
    totalImages: images.length,
  };
};
