import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const PageHeader = ({ title, onToggleSidebar, centerContent, hideUserInfo }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const getInitial = (name) => {
    if (!name) return "";
    return name.trim()[0].toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

        <div className="flex-1 flex items-center justify-center">
          {centerContent}
        </div>

        {!hideUserInfo && (
          <div className="flex items-center space-x-3">
            <div
              className="text-right hidden sm:block cursor-pointer"
              onClick={handleProfileClick}
              title="Edit Profile"
            >
              <p className="text-sm font-medium text-gray-900">{`${user?.firstName} ${user?.lastName}`}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div
              className="w-8 h-8 bg-[#6C4BF4] rounded-full flex items-center justify-center cursor-pointer"
              onClick={handleProfileClick}
              title="Edit Profile"
            >
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {getInitial(user?.firstName + " " + user?.lastName)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
