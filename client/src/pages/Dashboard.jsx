import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import BarChart from '../components/BarChart';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [earningsActiveTab, setEarningsActiveTab] = useState('earnings');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const user = {
    name: 'John Doe',
  };

  // Example dynamic data. Wire these to real API data later.
  const summaryData = {
    earnings: {
      amount: '₱ 4, 444.00',
      description: 'Your total earnings available for withdrawal.',
      chart: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Earnings',
            data: [500, 650, 420, 800, 720, 300, 1054],
            backgroundColor: '#7C5CFF'
          }
        ]
      }
    },
    rentalPayments: {
      amount: '₱ 3, 210.00',
      description: 'Payments collected from active and recent rentals.',
      chart: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Rental Payments',
            data: [300, 420, 380, 520, 610, 250, 730],
            backgroundColor: '#34D399'
          }
        ]
      }
    }
  };

  const paymentsSummary = [
    { label: 'Upcoming Payments', value: 1, bg: 'bg-orange-500' },
    { label: 'Completed Payments', value: 4, bg: 'bg-purple-600' },
    { label: 'Pending Earnings', value: 2, bg: 'bg-red-600' },
    { label: 'Released Earnings', value: 3, bg: 'bg-green-600' }
  ];

  const notifications = [
    { id: 1, type: 'info', title: 'New rental request to DSLR Camera', time: '2 hours ago', color: 'bg-blue-500' },
    { id: 2, type: 'success', title: 'Your rental request for Laptop was approved', time: '8 hours ago', color: 'bg-green-500' },
    { id: 3, type: 'warning', title: 'Reminder to return the Mountain Bike tomorrow', time: '1 day ago', color: 'bg-orange-500' },
    { id: 4, type: 'message', title: 'You have a new message from @janedoe', time: '3 days ago', color: 'bg-blue-500' },
    { id: 5, type: 'payment', title: 'Payment for Karaoke Set already transferred', time: '1 week ago', color: 'bg-blue-500' }
  ];

  const currentSummary =
    earningsActiveTab === 'earnings' ? summaryData.earnings : summaryData.rentalPayments;

  const renderIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'message':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
      case 'payment':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
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
                      onClick={() => setEarningsActiveTab('earnings')}
                      className={`relative ${
                        earningsActiveTab === 'earnings' ? 'text-[#6C4BF4]' : 'text-gray-700'
                      }`}
                    >
                      Earnings
                      {earningsActiveTab === 'earnings' && (
                        <span className="absolute left-0 -bottom-3 h-1 w-full bg-[#6C4BF4] rounded" />
                      )}
                    </button>
                    <button
                      onClick={() => setEarningsActiveTab('rental')}
                      className={`relative ${
                        earningsActiveTab === 'rental' ? 'text-[#6C4BF4]' : 'text-gray-700'
                      }`}
                    >
                      Rental Payments
                      {earningsActiveTab === 'rental' && (
                        <span className="absolute left-0 -bottom-3 h-1 w-full bg-[#6C4BF4] rounded" />
                      )}
                    </button>
                  </div>

                  {/* Content: responsive two-column; stack on small screens */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{currentSummary.amount}</p>
                      <p className="text-sm text-gray-500 mt-1">{currentSummary.description}</p>
                    </div>
                    <div className="flex md:justify-end">
                      <div className="w-full md:w-56 lg:w-72 h-40 md:h-48 lg:h-56">
                        <BarChart labels={currentSummary.chart.labels} datasets={currentSummary.chart.datasets} height={224} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payments Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payments</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                    {paymentsSummary.map((item) => (
                      <div key={item.label} className={`${item.bg} text-white p-5 rounded-lg flex flex-col items-center justify-center`}>
                        <p className="text-3xl font-bold leading-none">{item.value}</p>
                        <p className="text-xs mt-1 opacity-90 text-center">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column - Notifications */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                  <div className="space-y-4">
                    {notifications.map((n) => (
                      <div key={n.id} className="flex items-start space-x-3">
                        {renderIcon(n.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{n.title}</p>
                          <p className="text-xs text-gray-500">{n.time}</p>
                        </div>
                        <div className={`w-2 h-2 ${n.color} rounded-full mt-2`}></div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link to="/notifications" className="text-[#6C4BF4] hover:text-[#7857FD] text-sm font-medium">
                      See All Notifications
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'rental-payments':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rental Payments</h3>
            <p className="text-gray-600">Rental payments content will go here...</p>
          </div>
        );

      case 'earnings':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings</h3>
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
        <PageHeader title="Dashboard"  onToggleSidebar={toggleSidebar} />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user.name}</h2>
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
