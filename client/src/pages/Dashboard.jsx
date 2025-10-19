import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import {
  IoCheckmarkCircle,
  IoWarning,
  IoChatbubbleEllipses,
  IoCash,
  IoDocument,
} from "react-icons/io5";
import { getRecentNotifications, getNotificationTypeColor } from "../utils/notificationUtils";
import api from "../axios";
import Sidebar from "../components/Sidebar";
import BarChart from "../components/BarChart";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [earningsActiveTab, setEarningsActiveTab] = useState("earnings");

  const [earningsData, setEarningsData] = useState([]);
  const [paymentsData, setPaymentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  // Owner payments and earnings
  const ownerRes = await api.get("/api/payments/owner");
  setEarningsData(ownerRes.data.payments || []);
  setPaymentsData(ownerRes.data.payments || []);
      } catch (err) {
        setEarningsData([]);
        setPaymentsData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const dashboardName = () => {
    const fullName = `${user.firstName + " " + user.lastName}`;
    if (!user.username) {
      return fullName;
    } else {
      return user.username;
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Calculate summary data from API results
  // Earnings summary
  const totalEarnings = earningsData.reduce(
    (sum, p) => p.status === "completed" ? sum + (p.amount || 0) : sum,
    0
  );
  // Rental payments summary
  const totalPayments = paymentsData.reduce(
    (sum, p) => p.status === "completed" ? sum + (p.totalPaid || 0) : sum,
    0
  );

  // Chart data: group by day of week
  const getDayOfWeek = (dateStr) => {
    const date = new Date(dateStr);
    return date.getDay(); // 0=Sun, 1=Mon, ...
  };
  const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const earningsByDay = Array(7).fill(0);
  earningsData.forEach((p) => {
    if (p.status === "completed" && p.paymentDate) {
      const day = getDayOfWeek(p.paymentDate);
      earningsByDay[day] += p.amount || 0;
    }
  });
  const paymentsByDay = Array(7).fill(0);
  paymentsData.forEach((p) => {
    if (p.status === "completed" && p.paymentDate) {
      const day = getDayOfWeek(p.paymentDate);
      paymentsByDay[day] += p.totalPaid || 0;
    }
  });

  const summaryData = {
    earnings: {
      amount: `₱ ${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      description: "Your total earnings available for withdrawal.",
      chart: {
        labels: weekLabels,
        datasets: [
          {
            label: "Earnings",
            data: earningsByDay,
            backgroundColor: "#7C5CFF",
          },
        ],
      },
    },
    rentalPayments: {
      amount: `₱ ${totalPayments.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      description: "Payments collected from active and recent rentals.",
      chart: {
        labels: weekLabels,
        datasets: [
          {
            label: "Rental Payments",
            data: paymentsByDay,
            backgroundColor: "#34D399",
          },
        ],
      },
    },
  };

  // Payments summary cards using payment status enums
  const paymentStatusEnums = [
    { key: "completed", label: "Completed", bg: "bg-green-600" },
    { key: "pending", label: "Pending", bg: "bg-orange-500" },
    { key: "failed", label: "Failed", bg: "bg-red-600" },
    { key: "refunded", label: "Refunded", bg: "bg-blue-600" },
    { key: "processing", label: "Processing", bg: "bg-purple-600" },
  ];

  const paymentsSummary = paymentStatusEnums.map((status) => ({
    label: `${status.label} Payments`,
    value: paymentsData.filter((p) => p.status === status.key).length,
    bg: status.bg,
  }));

  // Get recent notifications from shared data
  const notifications = getRecentNotifications(5);

  const currentSummary = summaryData.earnings;

  const renderIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <IoCheckmarkCircle className="w-5 h-5 text-green-600" />
          </div>
        );
      case "warning":
        return (
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <IoWarning className="w-5 h-5 text-orange-600" />
          </div>
        );
      case "message":
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <IoChatbubbleEllipses className="w-5 h-5 text-purple-600" />
          </div>
        );
      case "payment":
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <IoCash className="w-5 h-5 text-blue-600" />
          </div>
        );
      case "info":
      default:
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <IoDocument className="w-5 h-5 text-blue-600" />
          </div>
        );
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96 text-gray-500 text-lg">
          Loading dashboard data...
        </div>
      );
    }
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Grid: Left (Earnings + Payments), Right (Notifications) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Earnings Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  {/* Internal tabs */}
                  <div className="flex items-center space-x-6 text-sm font-semibold text-gray-700 border-b border-gray-200 -mx-6 px-6 pb-3">
                    <button
                      onClick={() => setEarningsActiveTab("earnings")}
                      className={`relative ${
                        earningsActiveTab === "earnings"
                          ? "text-[#6C4BF4]"
                          : "text-gray-700"
                      }`}
                    >
                      Earnings
                      {earningsActiveTab === "earnings" && (
                        <span className="absolute left-0 -bottom-3 h-1 w-full bg-[#6C4BF4] rounded" />
                      )}
                    </button>
                  </div>

                  {/* Content: responsive two-column; stack on small screens */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        {totalEarnings === 0 ? "No earnings yet" : currentSummary.amount}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {currentSummary.description}
                      </p>
                    </div>
                    <div className="flex md:justify-end">
                      <div className="w-full md:w-56 lg:w-72 h-40 md:h-48 lg:h-56">
                        <BarChart
                          labels={currentSummary.chart.labels}
                          datasets={currentSummary.chart.datasets}
                          height={224}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payments Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Payments
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                    {paymentsSummary.filter((item) => item.value >= 1).length === 0 ? (
                      <div className="col-span-2 flex items-center justify-center text-gray-500 text-lg py-8">No payments yet</div>
                    ) : (
                      paymentsSummary
                        .filter((item) => item.value >= 1)
                        .map((item) => (
                          <div
                            key={item.label}
                            className={`${item.bg} text-white p-5 rounded-lg flex flex-col items-center justify-center`}
                          >
                            <p className="text-3xl font-bold leading-none">
                              {item.value}
                            </p>
                            <p className="text-xs mt-1 opacity-90 text-center">
                              {item.label}
                            </p>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right column - Notifications */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    {notifications.map((n) => (
                      <div key={n.id} className="flex items-start space-x-3">
                        {renderIcon(n.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{n.title}</p>
                          <p className="text-xs text-gray-500">{n.time}</p>
                        </div>
                        <div
                          className={`w-2 h-2 ${getNotificationTypeColor(
                            n.type
                          )} rounded-full mt-2`}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link
                      to="/notifications"
                      className="text-[#6C4BF4] hover:text-[#7857FD] text-sm font-medium"
                    >
                      See All Notifications
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "earnings":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Earnings
            </h3>
            <p className="text-gray-600">Earnings content will go here...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="Dashboard" onToggleSidebar={toggleSidebar} />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome, {dashboardName()}
              </h2>
            </div>

            {/* Tab content */}
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
