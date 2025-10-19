import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IoClose,
  IoHome,
  IoPeople,
  IoCube,
  IoDocumentText,
  IoStatsChart,
  IoSettings,
  IoLogOut,
  IoShield,
  IoNotifications,
  IoCard,
  IoCheckmarkCircle,
  IoTime,
  IoWarning,
} from "react-icons/io5";

const AdminSidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: IoHome,
      path: "/admin/dashboard",
      description: "Overview and statistics",
    },
    {
      id: "users",
      label: "User Management",
      icon: IoPeople,
      path: "/admin/users",
      description: "Manage users, verification and actions",
      subItems: [{ label: "All Users", path: "/admin/users", icon: IoPeople }],
    },
    {
      id: "items",
      label: "Item Management",
      icon: IoCube,
      path: "/admin/items",
      description: "Manage and review rental items",
      subItems: [{ label: "All Items", path: "/admin/items", icon: IoCube }],
    },
    {
      id: "activitylog",
      label: "Activity Log",
      icon: IoTime,
      path: "/admin/activity-log",
      description: "View and export activity log",
    },
  ];

  const handleMenuClick = (item) => {
    if (item.subItems) {
      // If there's only one submenu item, navigate directly to it
      if (item.subItems.length === 1) {
        navigate(item.subItems[0].path);
        if (window.innerWidth < 1024) {
          onToggle();
        }
      } else {
        // Multiple subitems, show/hide dropdown
        setExpandedMenu(expandedMenu === item.id ? null : item.id);
      }
    } else {
      navigate(item.path);
      if (window.innerWidth < 1024) {
        onToggle();
      }
    }
  };

  const handleSubItemClick = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  const isActiveRoute = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#6C4BF4] rounded-lg flex items-center justify-center">
              <IoShield className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-left transition-colors ${
                    isActiveRoute(item.path)
                      ? "bg-[#6C4BF4] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon
                      className={`w-5 h-5 ${
                        isActiveRoute(item.path)
                          ? "text-white"
                          : "text-gray-500"
                      }`}
                    />
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div
                        className={`text-xs ${
                          isActiveRoute(item.path)
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>
                  {item.subItems && item.subItems.length > 1 && (
                    <div
                      className={`transform transition-transform ${
                        expandedMenu === item.id ? "rotate-180" : ""
                      }`}
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
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Sub-menu items - only show for multi-item submenus */}
                {item.subItems &&
                  item.subItems.length > 1 &&
                  expandedMenu === item.id && (
                    <div className="mt-2 ml-6 space-y-1">
                      {item.subItems.map((subItem, index) => (
                        <button
                          key={index}
                          onClick={() => handleSubItemClick(subItem.path)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                            isActiveRoute(subItem.path)
                              ? "bg-blue-50 text-[#6C4BF4] border-l-2 border-[#6C4BF4]"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <subItem.icon className="w-4 h-4" />
                          <span className="text-sm">{subItem.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <IoLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
