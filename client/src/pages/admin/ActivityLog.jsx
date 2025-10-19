import { useState, useContext } from "react";
import ActivityLogModule from "../../components/admin/ActivityLogModule";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { AuthContext } from "../../context/authContext";

const ActivityLog = () => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          title="Activity Log"
          onToggleSidebar={toggleSidebar}
          user={user}
        />
        <main className="flex-1 overflow-y-auto">
          <ActivityLogModule />
        </main>
      </div>
    </div>
  );
};

export default ActivityLog;
