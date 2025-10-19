import { useContext, useState } from "react";
import {
  IoShieldCheckmark,
  IoShield,
  IoCamera,
  IoDocument,
  IoCheckmark,
  IoWarning,
  IoLocationOutline,
  IoAdd,
  IoCreate,
  IoTrash,
} from "react-icons/io5";
import { AuthContext } from "../context/authContext";
import { useModal } from "../context/modalContext";

const ProfileVerificationSection = () => {
  const { user } = useContext(AuthContext);
  const { openAccountVerificationModal, openAddressEditorModal } = useModal();

  // Local address state for form handling
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: "",
    fullAddress: "",
    recipientName: "",
    recipientPhone: "",
    isDefault: false,
  });

  // Use actual user addresses from context
  const addresses = user?.addresses || [];

  // Modal handlers
  const handleVerificationComplete = (data) => {
    console.log("Verification completed:", data);
    // TODO: Update user verification status via API
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    const newAddressForm = {
      label: "",
      fullAddress: "",
      recipientName: user?.firstName + " " + user?.lastName || "",
      recipientPhone: user?.mobileNumber || "",
      isDefault: false,
    };
    setAddressForm(newAddressForm);
    openAddressEditorModal(newAddressForm, setAddressForm, handleSaveAddress);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm(address);
    openAddressEditorModal(address, setAddressForm, handleSaveAddress);
  };

  const handleSaveAddress = (addressData) => {
    console.log("Saving address:", addressData);
    // TODO: Implement address save via API
  };

  const handleDeleteAddress = (addressId) => {
    console.log("Deleting address:", addressId);
    // TODO: Implement address delete via API
  };

  const handleSetDefaultAddress = (addressId) => {
    console.log("Setting default address:", addressId);
    // TODO: Implement set default address via API
  };

  return (
    <div className="space-y-6">
      {/* Account Verification Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <IoShield className="w-6 h-6 text-[#6C4BF4]" />
            Account Verification
          </h2>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              user?.isVerified
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {user?.isVerified ? "Verified" : "Not Verified"}
          </div>
        </div>

        {user?.isVerified ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <IoShieldCheckmark className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">
                  Account Verified
                </h3>
                <p className="text-sm text-green-700">
                  Your account has been successfully verified. You can now rent
                  items on QuickRent.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <IoWarning className="w-6 h-6 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-2">
                    Verification Required
                  </h3>
                  <p className="text-sm text-yellow-800 mb-3">
                    Complete your account verification to start renting items.
                    This helps keep our community safe and trusted.
                  </p>
                  <button
                    onClick={() =>
                      openAccountVerificationModal(
                        handleVerificationComplete,
                        user
                      )
                    }
                    className="bg-[#6C4BF4] text-white px-4 py-2 rounded-md font-medium hover:bg-[#7857FD] transition-colors"
                  >
                    Get Verified
                  </button>
                </div>
              </div>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <IoDocument className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Government ID</span>
                  <span className="text-xs text-gray-400 ml-auto">Required</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <IoCamera className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Selfie with ID</span>
                  <span className="text-xs text-gray-400 ml-auto">Optional</span>
                </div>
              </div>
          </div>
        )}
      </div>

      {/* Address Management Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <IoLocationOutline className="w-6 h-6 text-[#6C4BF4]" />
            Manage Addresses
          </h2>
          <button
            onClick={handleAddAddress}
            className="bg-[#6C4BF4] text-white px-4 py-2 rounded-md font-medium hover:bg-[#7857FD] transition-colors flex items-center gap-2"
          >
            <IoAdd className="w-4 h-4" />
            Add Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <IoLocationOutline className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No addresses saved</p>
            <button
              onClick={handleAddAddress}
              className="text-[#6C4BF4] text-sm font-medium hover:underline mt-2"
            >
              Add your first address
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {address.label}
                      </h3>
                      {address.isDefault && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {address.fullAddress}
                    </p>
                    <p className="text-xs text-gray-500">
                      {address.recipientName} • {address.recipientPhone}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefaultAddress(address.id)}
                        className="text-xs text-[#6C4BF4] hover:underline"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <IoCreate className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-gray-400 hover:text-red-600 p-1"
                    >
                      <IoTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileVerificationSection;
