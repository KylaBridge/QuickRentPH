import {
  IoClose,
  IoShieldCheckmark,
  IoArrowForward,
  IoWarning,
} from "react-icons/io5";

const VerificationRequiredModal = ({ isOpen, onClose, onGoToProfile }) => {
  if (!isOpen) return null;

  const handleGoToProfile = () => {
    onClose();
    onGoToProfile();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Verification Required
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IoWarning className="w-8 h-8 text-yellow-600" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            You're not verified yet
          </h3>

          <p className="text-gray-600 mb-6">
            To rent items on QuickRent, you need to verify your account first.
            This helps keep our community safe and trusted.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-semibold text-blue-900 mb-2">
              Verification includes:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Valid government-issued ID</li>
              <li>• Phone number verification</li>
              <li>• Email confirmation</li>
              <li>• Profile photo (optional)</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>

          <button
            onClick={handleGoToProfile}
            className="bg-[#6C4BF4] text-white px-6 py-2 rounded-md font-medium hover:bg-[#7857FD] flex items-center gap-2"
          >
            Get Verified
            <IoArrowForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationRequiredModal;
