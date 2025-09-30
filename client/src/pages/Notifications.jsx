import { useState } from "react";
import {
  IoCheckmarkCircle,
  IoWarning,
  IoChatbubbleEllipses,
  IoCash,
  IoDocument,
} from "react-icons/io5";
import {
  notificationData,
  sortNotificationsByTime,
} from "../utils/notificationUtils";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import { Link } from "react-router-dom";

const Notifications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Use shared notification data
  const notifications = notificationData;

  const filteredNotifications = sortNotificationsByTime(
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.category === activeTab)
  );

  const renderIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <IoCheckmarkCircle className="w-6 h-6 text-green-600" />
          </div>
        );
      case "warning":
        return (
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <IoWarning className="w-6 h-6 text-orange-600" />
          </div>
        );
      case "message":
        return (
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <IoChatbubbleEllipses className="w-6 h-6 text-purple-600" />
          </div>
        );
      case "payment":
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <IoCash className="w-6 h-6 text-blue-600" />
          </div>
        );
      case "info":
      default:
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <IoDocument className="w-6 h-6 text-blue-600" />
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <style>
        {`
          .scrollable::-webkit-scrollbar {
            width: 8px;
          }
          .scrollable::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          .scrollable::-webkit-scrollbar-thumb {
            background: #6C4BF4;
            border-radius: 4px;
          }
          .scrollable::-webkit-scrollbar-button {
            display: none;
          }
          .scrollable::-webkit-scrollbar-button:vertical:decrement {
            display: none;
          }
          .scrollable::-webkit-scrollbar-button:vertical:increment {
            display: none;
          }
        `}
      </style>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="Notifications" onToggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 flex flex-col overflow-hidden">
          <div className="w-full bg-white rounded-lg shadow-xl pt-4 pl-8 pr-4 pb-8 flex-1 flex flex-col overflow-y-auto overflow-x-hidden scrollable">
            <div className="flex items-center text-sm space-x-12 text-lg font-semibold text-gray-700 border-b border-gray-200 -mx-8 px-8 pb-3 sticky top-0 bg-white z-10">
              <button
                onClick={() => setActiveTab("all")}
                className={`relative ${
                  activeTab === "all"
                    ? "text-[#6C4BF4] font-bold"
                    : "text-gray-700"
                }`}
              >
                All Notifications
                {activeTab === "all" && (
                  <span className="absolute left-0 -bottom-3 h-1 w-full bg-[#6C4BF4] rounded" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("requests")}
                className={`relative ${
                  activeTab === "requests"
                    ? "text-[#6C4BF4] font-bold"
                    : "text-gray-700"
                }`}
              >
                Priority
                {activeTab === "requests" && (
                  <span className="absolute left-0 -bottom-3 h-1 w-full bg-[#6C4BF4] rounded" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("payments")}
                className={`relative ${
                  activeTab === "payments"
                    ? "text-[#6C4BF4] font-bold"
                    : "text-gray-700"
                }`}
              >
                Payments
                {activeTab === "payments" && (
                  <span className="absolute left-0 -bottom-3 h-1 w-full bg-[#6C4BF4] rounded" />
                )}
              </button>
            </div>

            <div className="mt-4 pr-6 flex-1 flex flex-col overflow-y-auto">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                  >
                    <div className="flex items-start space-x-4 w-full">
                      {renderIcon(n.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 font-medium">
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{n.time}</p>
                      </div>
                      <div
                        className={`w-2.5 h-2.5 ${
                          n.type === "warning"
                            ? "bg-orange-500"
                            : n.status === "read"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        } rounded-full mt-1`}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">
                    No notifications in this category. 🥳
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
