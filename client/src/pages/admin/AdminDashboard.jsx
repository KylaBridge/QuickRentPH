import { useState, useContext, useEffect } from "react";
import {
  IoStatsChart,
  IoPersonOutline,
  IoCubeOutline,
  IoDocumentTextOutline,
  IoTrendingUp,
  IoTrendingDown,
  IoTime,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { AuthContext } from "../../context/authContext";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import StatsCard from "../../components/admin/StatsCard";
import RecentActivity from "../../components/admin/RecentActivity";
import QuickActions from "../../components/admin/QuickActions";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    pendingRequests: 0,
    totalRevenue: 0,
    activeRentals: 0,
    completedRentals: 0,
  });
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API calls
        // Simulated data for now
        setDashboardStats({
          totalUsers: 156,
          totalItems: 89,
          pendingRequests: 12,
          totalRevenue: 45750,
          activeRentals: 23,
          completedRentals: 167,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = [
    {
      title: "Total Users",
      value: dashboardStats.totalUsers,
      icon: IoPersonOutline,
      color: "bg-blue-500",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Total Revenue",
      value: `₱${dashboardStats.totalRevenue.toLocaleString()}`,
      icon: IoStatsChart,
      color: "bg-[#6C4BF4]",
      trend: "+22%",
      trendUp: true,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          title="Admin Dashboard"
          onToggleSidebar={toggleSidebar}
          user={user}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.firstName || "Admin"}! 👋
              </h1>
              <p className="text-gray-600">
                Here's what's happening with QuickRent today.
              </p>
            </div>

            {/* Statistics Cards + Revenue Chart Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard
                title={statsCards[0].title}
                value={statsCards[0].value}
                icon={statsCards[0].icon}
                color={statsCards[0].color}
                trend={statsCards[0].trend}
                trendUp={statsCards[0].trendUp}
                loading={loading}
              />
              <StatsCard
                title={statsCards[1].title}
                value={statsCards[1].value}
                icon={statsCards[1].icon}
                color={statsCards[1].color}
                trend={statsCards[1].trend}
                trendUp={statsCards[1].trendUp}
                loading={loading}
              />
              {/* Revenue Chart beside Revenue Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Revenue Overview
                </h3>
                <div className="h-40 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <IoStatsChart className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">
                      Revenue chart will be implemented here
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions - 1/3 width */}
              <div className="lg:col-span-1 flex flex-col">
                <QuickActions />
              </div>

              {/* Recent Activity Placeholder - 2/3 width */}
              <div className="lg:col-span-2 flex flex-col">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex flex-col justify-center items-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="flex flex-col items-center justify-center flex-1">
                    <IoTime className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">
                      Recent activity feed will be shown here.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End .p-6 */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
