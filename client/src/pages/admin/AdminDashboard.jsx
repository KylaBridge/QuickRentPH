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
      title: "Total Items",
      value: dashboardStats.totalItems,
      icon: IoCubeOutline,
      color: "bg-green-500",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Pending Requests",
      value: dashboardStats.pendingRequests,
      icon: IoTime,
      color: "bg-yellow-500",
      trend: "-3%",
      trendUp: false,
    },
    {
      title: "Active Rentals",
      value: dashboardStats.activeRentals,
      icon: IoDocumentTextOutline,
      color: "bg-purple-500",
      trend: "+15%",
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
    {
      title: "Completed Rentals",
      value: dashboardStats.completedRentals,
      icon: IoCheckmarkCircle,
      color: "bg-emerald-500",
      trend: "+18%",
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

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
              {statsCards.map((stat, index) => (
                <StatsCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                  trend={stat.trend}
                  trendUp={stat.trendUp}
                  loading={loading}
                />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="xl:col-span-1">
                <QuickActions />
              </div>

              {/* Recent Activity */}
              <div className="xl:col-span-2">
                <RecentActivity />
              </div>
            </div>

            {/* Additional Dashboard Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Revenue Chart Placeholder */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Revenue Overview
                </h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <IoStatsChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">
                      Revenue chart will be implemented here
                    </p>
                  </div>
                </div>
              </div>

              {/* Popular Items Placeholder */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Popular Items
                </h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <IoCubeOutline className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">
                      Popular items list will be implemented here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
