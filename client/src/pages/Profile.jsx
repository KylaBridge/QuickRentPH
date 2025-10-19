import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProfileVerificationSection from "../components/ProfileVerificationSection";
import { AuthContext } from "../context/authContext";
import { UserContext } from "../context/userContext";

const genderOptions = ["male", "female", "other"];

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { changeProfile } = useContext(UserContext);
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");

  // Helper to safely format birthDate for input value
  const formatBirthDate = (bd) => {
    if (!bd) return "";
    try {
      if (typeof bd === "string") return bd.slice(0, 10);
      const d = new Date(bd);
      if (!isNaN(d)) return d.toISOString().slice(0, 10);
    } catch (e) {
      // fall-through
    }
    return "";
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(
    section === "verification" ? "verification" : "profile"
  );

  // Use user context for initial values
  const initialProfile = {
    profilePic: user?.profilePic || "",
    quickRentId: user?._id,
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    email: user?.email || "",
    gender: user?.gender || "",
    birthDate: formatBirthDate(user?.birthDate) || "",
  };

  const [profile, setProfile] = useState(initialProfile);
  const [editProfile, setEditProfile] = useState(initialProfile);
  const [changed, setChanged] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showGender, setShowGender] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const fileInputRef = useRef();
  const navigate = useNavigate();

  // Validation
  const validate = (field, value) => {
    let err = "";
    // Required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "username",
      "gender",
      "birthDate",
    ];
    if (requiredFields.includes(field)) {
      if (!value || String(value).trim() === "")
        return "This field is required";
    }
    if (field === "email") {
      if (value && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
        err = "Invalid email address";
    }
    return err;
  };

  const validateAll = (profileObj) => {
    const errs = {};
    const fieldsToCheck = [
      "firstName",
      "lastName",
      "username",
      "gender",
      "birthDate",
      "email",
    ];
    fieldsToCheck.forEach((f) => {
      errs[f] = validate(f, profileObj[f]);
    });
    return errs;
  };

  // Show notification helper
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      4000
    );
  };

  const handleChange = (field, value) => {
    setEditProfile((prev) => ({ ...prev, [field]: value }));
    setChanged(true);
    setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(editProfile.quickRentId);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditProfile((prev) => ({ ...prev, profilePic: url }));
      setChanged(true);
    }
  };

  const handleSave = async () => {
    try {
      // Prepare data for saving
      const saveData = { ...editProfile };
      await changeProfile(saveData);
      setProfile(editProfile);
      setChanged(false);
      showNotification("Profile updated successfully!", "success");
    } catch (error) {
      console.error("Profile save error:", error);
      showNotification(
        error || "Failed to update profile. Please try again.",
        "error"
      );
    }
  };

  const openFilePicker = () => fileInputRef.current.click();

  // Keep local state in sync when `user` becomes available/changes
  useEffect(() => {
    const updated = {
      profilePic: user?.profilePic || "",
      quickRentId: user?._id,
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: user?.username || "",
      email: user?.email || "",
      gender: user?.gender || "",
      birthDate: formatBirthDate(user?.birthDate) || "",
    };
    setProfile(updated);
    setEditProfile(updated);
    // initialize errors for required fields
    setErrors(validateAll(updated));
  }, [user]);

  // Helper for initial letter
  const getInitial = (first, last) => {
    if (first && last) return (first[0] + last[0]).toUpperCase();
    if (first) return first[0].toUpperCase();
    if (last) return last[0].toUpperCase();
    return "";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Custom header with back arrow and Edit Profile text */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center">
          <button
            className="mr-2 p-2 rounded-full hover:bg-gray-100 text-[#6C4BF4] focus:outline-none"
            onClick={() => navigate(-1)}
            aria-label="Go Back"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="text-xl font-semibold text-gray-900">
            Profile Settings
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-[#6C4BF4] text-[#6C4BF4]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("verification")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "verification"
                  ? "border-[#6C4BF4] text-[#6C4BF4]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Verification & Addresses
            </button>
          </nav>
        </div>

        <main className="flex-1 overflow-y-auto">
          {activeTab === "profile" ? (
            // Existing Profile Edit Content
            <div className="flex justify-center items-start py-10 px-2 sm:px-6">
              <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8 relative">
                {/* Toast */}
                {showToast && (
                  <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#6C4BF4] text-white px-4 py-2 rounded shadow z-50 transition">
                    QuickRent ID copied!
                  </div>
                )}

                {/* Notification */}
                {notification.show && (
                  <div
                    className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 max-w-md text-center ${
                      notification.type === "success"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      {notification.type === "success" ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                      <span className="text-sm font-medium">
                        {notification.message}
                      </span>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <button
                  className={`absolute top-6 right-8 px-6 py-2 rounded-full text-base font-bold shadow transition ${
                    changed && Object.values(errors).every((e) => !e)
                      ? "bg-[#6C4BF4] text-white hover:bg-[#7857FD]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={
                    !changed ||
                    Object.values(errors).some((e) => e) ||
                    // also disable when required fields are empty
                    [
                      "firstName",
                      "lastName",
                      "username",
                      "gender",
                      "birthDate",
                    ].some(
                      (f) =>
                        !editProfile[f] || String(editProfile[f]).trim() === ""
                    )
                  }
                  onClick={handleSave}
                >
                  Save
                </button>

                {/* Left: Profile Picture and QuickRent ID */}
                <div className="flex flex-col items-center md:items-start md:w-1/3 gap-4">
                  <div className="relative">
                    {editProfile.profilePic ? (
                      <img
                        src={editProfile.profilePic}
                        alt="Profile"
                        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-full bg-[#6C4BF4] flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow">
                        {getInitial(
                          editProfile.firstName,
                          editProfile.lastName
                        )}
                      </div>
                    )}
                    <button
                      className="absolute bottom-1 right-1 bg-[#6C4BF4] hover:bg-[#7857FD] text-white rounded-full p-2 shadow"
                      onClick={openFilePicker}
                      aria-label="Change profile picture"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536M9 13l6-6M7 17h8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleProfilePicChange}
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-semibold">
                      QuickRent ID:
                    </span>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                      {editProfile.quickRentId}
                    </span>
                    <button
                      className="ml-1 p-1 rounded hover:bg-gray-200"
                      onClick={handleCopyId}
                      aria-label="Copy QuickRent ID"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16h8a2 2 0 002-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 8V6a2 2 0 00-2-2H8a2 2 0 00-2 2v2"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Right: Editable Info */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full border-b border-gray-200 focus:border-[#6C4BF4] outline-none py-2 text-gray-900 text-base bg-transparent"
                      value={editProfile.firstName}
                      onChange={(e) =>
                        handleChange("firstName", e.target.value)
                      }
                      placeholder="First Name"
                    />
                  </div>
                  {/* Last Name */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full border-b border-gray-200 focus:border-[#6C4BF4] outline-none py-2 text-gray-900 text-base bg-transparent"
                      value={editProfile.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      placeholder="Last Name"
                    />
                  </div>
                  {/* Username */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      className="w-full border-b border-gray-200 focus:border-[#6C4BF4] outline-none py-2 text-gray-900 text-base bg-transparent"
                      value={editProfile.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      placeholder="Username"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        className="flex-1 border-b border-gray-200 focus:border-[#6C4BF4] outline-none py-2 text-gray-900 text-base bg-transparent"
                        value={editProfile.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="Email Address"
                      />
                    </div>
                    {errors.email && (
                      <div className="text-xs text-red-500 mt-1">
                        {errors.email}
                      </div>
                    )}
                  </div>
                  {/* Gender */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Gender
                    </label>
                    <div className="relative">
                      <button
                        className="w-full text-left border-b border-gray-200 focus:border-[#6C4BF4] outline-none py-2 text-gray-900 text-base bg-transparent"
                        onClick={() => setShowGender(true)}
                      >
                        {editProfile.gender}
                      </button>
                      {showGender && (
                        <div className="absolute left-0 top-12 z-10 bg-white border border-gray-200 rounded-lg shadow w-48 animate-fade-in">
                          {genderOptions.map((opt) => (
                            <button
                              key={opt}
                              className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                                editProfile.gender === opt
                                  ? "text-[#6C4BF4] font-semibold"
                                  : ""
                              }`}
                              onClick={() => {
                                handleChange("gender", opt);
                                setShowGender(false);
                              }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Birthday */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Birthday
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full border-b border-gray-200 focus:border-[#6C4BF4] outline-none py-2 text-gray-900 text-base bg-transparent"
                        value={editProfile.birthDate}
                        readOnly
                        onClick={() => setShowDate(true)}
                        placeholder="Birth Date"
                      />
                      {showDate && (
                        <input
                          type="date"
                          className="absolute left-0 top-10 z-10 border border-gray-200 rounded-lg shadow px-3 py-2"
                          value={editProfile.birthDate}
                          onChange={(e) => {
                            handleChange("birthDate", e.target.value);
                            setShowDate(false);
                          }}
                          onBlur={() => setShowDate(false)}
                          autoFocus
                        />
                      )}
                    </div>
                  </div>
                  {/* Security Section */}
                  <div className="col-span-2 mt-4">
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                      <span className="text-base text-gray-900 font-semibold flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-[#6C4BF4]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <rect width="18" height="11" x="3" y="11" rx="2" />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 11V7a5 5 0 0110 0v4"
                          />
                        </svg>
                        Security
                      </span>
                      <button className="bg-[#6C4BF4] hover:bg-[#7857FD] text-white rounded px-4 py-2 font-semibold text-sm shadow">
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Verification & Addresses Content
            <div className="py-6 px-4 sm:px-6">
              <ProfileVerificationSection />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
