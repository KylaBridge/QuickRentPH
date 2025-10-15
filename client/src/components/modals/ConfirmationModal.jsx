import React from "react";
import { IoTrash, IoInformationCircle, IoWarning } from "react-icons/io5";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // "warning", "danger", "info"
  itemName = null,
}) => {
  if (!isOpen) return null;

  const getIconColor = () => {
    switch (type) {
      case "danger":
        return "text-red-600";
      case "info":
        return "text-blue-600";
      case "warning":
      default:
        return "text-yellow-600";
    }
  };

  const getIconBg = () => {
    switch (type) {
      case "danger":
        return "bg-red-100";
      case "info":
        return "bg-blue-100";
      case "warning":
      default:
        return "bg-yellow-100";
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700";
      case "info":
        return "bg-blue-600 hover:bg-blue-700";
      case "warning":
      default:
        return "bg-yellow-600 hover:bg-yellow-700";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <IoTrash className="w-6 h-6" />;
      case "info":
        return <IoInformationCircle className="w-6 h-6" />;
      case "warning":
      default:
        return <IoWarning className="w-6 h-6" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div
              className={`w-10 h-10 ${getIconBg()} rounded-full flex items-center justify-center mr-3`}
            >
              <div className={getIconColor()}>{getIcon()}</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">
              {message}
              {itemName && (
                <span className="font-medium text-gray-900"> "{itemName}"</span>
              )}
              {type === "danger" && (
                <span className="block mt-2 text-sm text-red-600">
                  This action cannot be undone.
                </span>
              )}
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 font-medium ${getConfirmButtonStyle()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
