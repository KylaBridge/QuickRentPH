import { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Link, useLocation } from "react-router-dom";
import {
  IoGrid,
  IoCube,
  IoList,
  IoNotifications,
  IoChatbubbleEllipses,
  IoHelpCircle,
  IoChevronDown,
  IoPersonOutline,
  IoLogOut,
  IoMenu,
  IoClose,
} from "react-icons/io5";

const Sidebar = ({ isOpen, onToggle }) => {
  const { logoutUser } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  // Allow manual collapse of a submenu even when one of its routes is active
  const [collapsedOverrides, setCollapsedOverrides] = useState({});
  const location = useLocation();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    if (!collapsed) {
      setExpandedMenu(null); // Close expanded menu when collapsing
    }
  };

  const toggleSubmenu = (menuName) => {
    if (expandedMenu === menuName) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(menuName);
    }
  };

  const navigationItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <IoGrid className="w-6 h-6" />,
    },
    {
      name: "Items for Rent",
      path: "/items-for-rent",
      hasSubmenu: true,
      icon: <IoCube className="w-6 h-6" />,
      submenu: [
        { name: "My Requests", path: "/my-requests" },
        { name: "My Wishlist", path: "/my-wishlist" },
      ],
    },
    {
      name: "My Rentals",
      path: "/my-rentals",
      icon: <IoList className="w-6 h-6" />,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: <IoNotifications className="w-6 h-6" />,
    },
    {
      name: "Messages",
      path: "/messages",
      icon: <IoChatbubbleEllipses className="w-6 h-6" />,
    },
    {
      name: "Help",
      path: "/help",
      icon: <IoHelpCircle className="w-6 h-6" />,
    },
  ];

  const renderMenuItem = (item, index) => {
    const isActive = location.pathname === item.path;
    // Detect if any submenu route is active
    const isAnySubActive =
      item.hasSubmenu &&
      item.submenu?.some((s) => location.pathname === s.path);
    // Expanded if toggled open OR active sub route, unless manually collapsed
    const isExpanded =
      (expandedMenu === item.name || isAnySubActive) &&
      !collapsedOverrides[item.name];

    if (item.hasSubmenu) {
      return (
        <li key={item.name} className="relative">
          {/* Main menu item with submenu: clicking the row navigates; chevron toggles submenu */}
          <div className="w-full flex items-center group">
            <Link
              to={item.path}
              className={`
                flex-1 flex items-center px-3 py-3 rounded-lg transition-all duration-200
                ${
                  // Keep parent highlighted when a submenu route is active, even if manually collapsed
                  isActive || isAnySubActive
                    ? "bg[#977EFF] bg-[#977EFF] text-white border-r-2 border-white"
                    : "text-white hover:bg-[#7857FD] hover:text-white"
                }
              `}
            >
              <span className="text-white">{item.icon}</span>
              {!collapsed && (
                <span className="ml-3 font-medium">{item.name}</span>
              )}
            </Link>
            {!collapsed && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isAnySubActive) {
                    // Toggle manual collapse when a submenu route is active
                    setCollapsedOverrides((prev) => ({
                      ...prev,
                      [item.name]: !prev[item.name],
                    }));
                  } else {
                    // Clear any previous override when manually toggling
                    setCollapsedOverrides((prev) => ({
                      ...prev,
                      [item.name]: false,
                    }));
                    toggleSubmenu(item.name);
                  }
                }}
                className="ml-2 p-2 rounded-lg text-white hover:bg-[#7857FD]"
                title={isExpanded ? "Hide menu" : "Show menu"}
                aria-expanded={isExpanded}
              >
                <IoChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </div>

          {/* Submenu */}
          {isExpanded && !collapsed && (
            <ul className="mt-1 ml-6 space-y-1">
              {item.submenu.map((subItem) => {
                const isSubActive = location.pathname === subItem.path;
                return (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`
                        block px-3 py-2 rounded-lg transition-all duration-200 text-sm
                        ${
                          isSubActive
                            ? "bg-[#977EFF] text-white border-l-2 border-white"
                            : "text-white hover:bg-[#7857FD] hover:text-white"
                        }
                      `}
                      aria-current={isSubActive ? "page" : undefined}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Tooltip for collapsed mode */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {item.name}
            </div>
          )}
        </li>
      );
    }

    // Regular menu item
    return (
      <li key={item.name} className="relative group">
        <Link
          to={item.path}
          className={`
            flex items-center px-3 py-3 rounded-lg transition-all duration-200
            ${
              isActive
                ? "bg-[#977EFF] text-white border-r-2 border-white"
                : "text-white hover:bg-[#7857FD] hover:text-white"
            }
          `}
        >
          {item.icon && <span className="text-white">{item.icon}</span>}
          {!collapsed && (
            <span className={`font-medium ${item.icon ? "ml-3" : ""}`}>
              {item.name}
            </span>
          )}
        </Link>

        {/* Tooltip for collapsed mode */}
        {collapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {item.name}
          </div>
        )}
      </li>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-[1px] bg-white/5 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full bg-[#6C4BF4] shadow-lg z-50 transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${collapsed ? "w-16" : "w-64"}
        lg:translate-x-0 lg:relative lg:z-auto
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#7857FD]">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <img
                src="/quickRentLogo.svg"
                alt="QuickRent"
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-white">Quick Rent</span>
            </div>
          )}

          {/* Collapse toggle button */}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg hover:bg-[#977EFF] transition-colors duration-200"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <IoMenu
              className={`w-5 h-5 text-white transition-transform duration-200 ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <ul className="space-y-2">{navigationItems.map(renderMenuItem)}</ul>
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 p-4">
          <button
            onClick={async () => {
              await logoutUser();
              console.log("Logout clicked");
            }}
            className={`
              w-full flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-200
              text-white hover:bg-[#977EFF] hover:text-white
              ${collapsed ? "px-2" : "px-3"}
            `}
          >
            <IoLogOut className="w-5 h-5" />
            {!collapsed && <span className="ml-2 font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
