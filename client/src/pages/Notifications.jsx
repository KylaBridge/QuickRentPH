import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const notifications = [
    { id: 1, type: 'info', title: 'New rental request to DSLR Camera from @holygram', time: '2 hours ago', status: 'unread', category: 'requests' },
    { id: 2, type: 'success', title: 'Your rental request for Laptop was approved by @giksjar', time: '8 hours ago', status: 'read', category: 'requests' },
    { id: 3, type: 'warning', title: 'Reminder to return the Mountain Bike tomorrow to @winsykal', time: '1 day ago', status: 'unread', category: 'reminders' },
    { id: 4, type: 'message', title: 'You have a new message from @janedoe', time: '3 days ago', status: 'unread', category: 'messages' },
    { id: 5, type: 'payment', title: 'Payment for Karaoke Set already transferred by @2hollis', time: '1 week ago', status: 'unread', category: 'payments' },
    { id: 6, type: 'message', title: 'You have a new message from @2hollis', time: '2 weeks ago', status: 'unread', category: 'messages' },
    { id: 7, type: 'info', title: 'New rental request to Electric Guitar from @lolibahia', time: '1 month ago', status: 'unread', category: 'requests' },
    { id: 8, type: 'success', title: 'Your rental request for Grand Piano was approved by @musikan', time: '4 months ago', status: 'read', category: 'requests' },
    { id: 9, type: 'payment', title: 'Deposit for Projector rental already transferred by @jigshall', time: '2 months ago', status: 'unread', category: 'payments' },
    { id: 10, type: 'payment', title: 'Downpayment for DSLR Camera received', time: '5 months ago', status: 'unread', category: 'payments' },
    { id: 11, type: 'warning', title: 'Reminder to return the Sound System Set tomorrow to @jackdoe', time: '3 weeks ago', status: 'unread', category: 'reminders' },
    { id: 12, type: 'warning', title: 'Reminder to return the Karaoke Set today to @sidlilly', time: '2 months ago', status: 'unread', category: 'reminders' },
  ];

  const sortNotificationsByTime = (notifications) => {
    const timeToMinutes = (timeStr) => {
      const [value, unit] = timeStr.split(' ');
      const numValue = parseInt(value);
      switch (unit) {
        case 'minute':
        case 'minutes':
          return numValue;
        case 'hour':
        case 'hours':
          return numValue * 60;
        case 'day':
        case 'days':
          return numValue * 60 * 24;
        case 'week':
        case 'weeks':
          return numValue * 60 * 24 * 7;
        case 'month':
        case 'months':
          return numValue * 60 * 24 * 30; // Approximation
        case 'year':
        case 'years':
          return numValue * 60 * 24 * 365; // Approximation
        default:
          return 0;
      }
    };
    return notifications.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  };

  const filteredNotifications = sortNotificationsByTime(
    activeTab === 'all'
      ? notifications
      : notifications.filter(n => n.category === activeTab)
  );

  const renderIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'message':
        return (
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
      case 'payment':
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.115.541 3 1.342M12 8c-1.11 0-2.115.541-3 1.342M12 8V4m0 8v4m0 4v-4m-6-4h12M6 16h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="Notifications" onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto px-10 py-6">
          <div className="max-w-full mx-auto bg-white rounded-lg shadow-xl p-8">
            <div className="flex items-center space-x-12 text-lg font-semibold text-gray-700 border-b border-gray-200 -mx-8 px-8 pb-3">
              <button
                onClick={() => setActiveTab('all')}
                className={`relative ${
                  activeTab === 'all' ? 'text-[#6C4BF4] font-bold' : 'text-gray-700'
                }`}
              >
                All Notifications
                {activeTab === 'all' && (
                  <span className="absolute left-0 -bottom-3 h-1 w-full bg-[#6C4BF4] rounded" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`relative ${
                  activeTab === 'requests' ? 'text-[#6C4BF4] font-bold' : 'text-gray-700'
                }`}
              >
                Requests
                {activeTab === 'requests' && (
                  <span className="absolute left-0 -bottom-3 h-1 w-full bg-[#6C4BF4] rounded" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`relative ${
                  activeTab === 'payments' ? 'text-[#6C4BF4] font-bold' : 'text-gray-700'
                }`}
              >
                Payments
                {activeTab === 'payments' && (
                  <span className="absolute left-0 -bottom-3 h-1 w-full bg-[#6C4BF4] rounded" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('reminders')}
                className={`relative ${
                  activeTab === 'reminders' ? 'text-[#6C4BF4] font-bold' : 'text-gray-700'
                }`}
              >
                Reminders
                {activeTab === 'reminders' && (
                  <span className="absolute left-0 -bottom-3 h-1 w-full bg-[#6C4BF4] rounded" />
                )}
              </button>
            </div>

            <div className="mt-8 space-y-6">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start p-6 bg-gray-50 rounded-xl shadow-lg transition-all duration-300 hover:bg-gray-100"
                  >
                    <div className="flex items-start space-x-6 w-full">
                      {renderIcon(n.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-lg text-gray-900 font-medium leading-relaxed">{n.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{n.time}</p>
                      </div>
                      <div className={`w-3.5 h-3.5 ${n.type === 'warning' ? 'bg-orange-500' : (n.status === 'read' ? 'bg-green-500' : 'bg-blue-500')} rounded-full mt-3.5`}></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-lg py-12">No notifications in this category. 🥳</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
