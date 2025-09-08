import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

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
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v14" />
        </svg>
      )
    },
    {
      name: 'Items for Rent',
      path: '/items-for-rent',
      hasSubmenu: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      submenu: [
        { name: 'My Requests', path: '/my-requests' },
        { name: 'My Wishlist', path: '/my-wishlist' },
      ]
    },
    {
      name: 'My Rentals',
      path: '/my-rentals',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    }
  ];

  const renderMenuItem = (item, index) => {
    const isActive = location.pathname === item.path;
    const isExpanded = expandedMenu === item.name;
    
    if (item.hasSubmenu) {
      return (
        <li key={item.name} className="relative">
          {/* Main menu item with submenu: clicking the row navigates; chevron toggles submenu */}
          <div className="w-full flex items-center group">
            <Link
              to={item.path}
              className={`
                flex-1 flex items-center px-3 py-3 rounded-lg transition-all duration-200
                ${isActive || isExpanded
                  ? 'bg[#977EFF] bg-[#977EFF] text-white border-r-2 border-white' 
                  : 'text-white hover:bg-[#7857FD] hover:text-white'}
              `}
            >
              <span className="text-white">{item.icon}</span>
              {!collapsed && (
                <span className="ml-3 font-medium">{item.name}</span>
              )}
            </Link>
            {!collapsed && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSubmenu(item.name); }}
                className="ml-2 p-2 rounded-lg text-white hover:bg-[#7857FD]"
                title={isExpanded ? 'Hide menu' : 'Show menu'}
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
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
                        ${isSubActive
                          ? 'bg-[#977EFF] text-white border-l-2 border-white'
                          : 'text-white hover:bg-[#7857FD] hover:text-white'}
                      `}
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
            ${isActive 
              ? 'bg-[#977EFF] text-white border-r-2 border-white' 
              : 'text-white hover:bg-[#7857FD] hover:text-white'
            }
          `}
        >
          {item.icon && (
            <span className="text-white">
              {item.icon}
            </span>
          )}
          {!collapsed && (
            <span className={`font-medium ${item.icon ? 'ml-3' : ''}`}>
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
      <div className={`
        fixed top-0 left-0 h-full bg-[#6C4BF4] shadow-lg z-50 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${collapsed ? 'w-16' : 'w-64'}
        lg:translate-x-0 lg:relative lg:z-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#7857FD]">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <img 
                src="/quickRentLogo.svg" 
                alt="QuickRent" 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-white">QuickRent</span>
            </div>
          )}
          
          {/* Collapse toggle button */}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg hover:bg-[#977EFF] transition-colors duration-200"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg 
              className={`w-5 h-5 text-white transition-transform duration-200 ${
                collapsed ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            {navigationItems.map(renderMenuItem)}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 p-4">
          <button
            onClick={() => {
              // Add logout logic here
              // console.log('Logout clicked');
              navigate('/landing');
            }}
            className={`
              w-full flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-200
              text-white hover:bg-[#977EFF] hover:text-white
              ${collapsed ? 'px-2' : 'px-3'}
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!collapsed && (
              <span className="ml-2 font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
