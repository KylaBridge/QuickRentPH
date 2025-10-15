import { useState, useEffect } from "react";
import { IoCheckmarkCircle, IoCloseCircle, IoHeart } from "react-icons/io5";

const Toast = ({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <IoCheckmarkCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <IoCloseCircle className="w-5 h-5 text-red-500" />;
      case "wishlist":
        return <IoHeart className="w-5 h-5 text-pink-500" />;
      default:
        return <IoCheckmarkCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "wishlist":
        return "bg-pink-50 border-pink-200";
      default:
        return "bg-green-50 border-green-200";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "wishlist":
        return "text-pink-800";
      default:
        return "text-green-800";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[10000] animate-slide-in">
      <div
        className={`${getBgColor()} border rounded-lg p-4 shadow-lg max-w-sm`}
      >
        <div className="flex items-center">
          {getIcon()}
          <p className={`ml-3 ${getTextColor()} font-medium`}>{message}</p>
          <button onClick={onClose} className="ml-auto pl-3">
            <IoCloseCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
