import { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import AllUsersTab from "../../components/admin/tabs/AllUsersTab";
import VerificationTab from "../../components/admin/tabs/VerificationTab";
import ReportedUsersTab from "../../components/admin/tabs/ReportedUsersTab";

const UserManagement = () => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const addActivity = (text) => {
    setActivityLog((prev) => [
      { id: Date.now(), text, time: new Date().toLocaleString() },
      ...prev,
    ]);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          title="User Management"
          onToggleSidebar={toggleSidebar}
          user={user}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Users</h1>
                <p className="text-gray-600">
                  Manage users, verifications and actions
                </p>
              </div>

              <div className="w-full sm:w-auto flex items-center gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Search user by name or email"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full sm:w-64 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4]"
                />
                <div className="ml-2">
                  <button
                    onClick={() => setQuery("")}
                    className="px-3 py-2 bg-gray-100 rounded-md text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-4">
              <div className="flex space-x-2">
                {[
                  { id: "all", label: "All" },
                  { id: "verification", label: "Verification" },
                  { id: "reported", label: "Reported Users" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === t.id
                        ? "bg-[#6C4BF4] text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden text-xs">
              {activeTab === "all" && (
                <AllUsersTab query={query} onUserAction={addActivity} />
              )}
              {activeTab === "verification" && (
                <VerificationTab query={query} onUserAction={addActivity} />
              )}
              {activeTab === "reported" && (
                <ReportedUsersTab query={query} onUserAction={addActivity} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserManagement;
