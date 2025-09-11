import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import { Link } from 'react-router-dom';

const Messages = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const messages = [
    { id: 1, type: 'rental', title: '[@eventshooter] DSLR Camera Rental', content: 'Hi, can I pick this up at 3 pm tomorrow?', time: '2 hours ago', status: 'unread' },
    { id: 2, type: 'rental', title: '[@janedoe] Laptop Rental', content: "Thanks! I'll return it by 6 pm today.", time: '8 hours ago', status: 'unread' },
    { id: 3, type: 'rental', title: '[@bikerentalsph] Mountain Bike', content: 'Hi, can I pick this up at 3 pm tomorrow?', time: '1 day ago', status: 'read' },
    { id: 4, type: 'rental', title: '[@musiklaver] Karaoke Set', content: 'Hi, can I pick this up at 3 pm tomorrow?', time: '3 days ago', status: 'read' },
    { id: 5, type: 'rental', title: '[@photogearhub] Tripod Rental', content: 'Hi, can I pick this up at 3 pm tomorrow?', time: '5 days ago', status: 'unread' },
    { id: 6, type: 'rental', title: '[@soundpro] Speaker System', content: 'Is this available for the weekend?', time: '1 week ago', status: 'read' },
    { id: 7, type: 'rental', title: '[@gamerig] Gaming PC', content: 'What are the specs for the GPU?', time: '1 week ago', status: 'unread' },
    { id: 8, type: 'rental', title: '[@bookworm] Book Collection', content: 'Can I rent just one book from the set?', time: '2 weeks ago', status: 'read' },
  ];

  const filteredMessages = activeTab === 'all'
    ? messages
    : messages.filter(m => m.status === activeTab);

  const renderIcon = (type) => {
    switch (type) {
      case 'rental':
      default:
        return (
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-[#6C4BF4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="Messages" onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-full mx-auto bg-white rounded-lg shadow-xl p-8">
            <div className="flex items-center space-x-12 text-lg font-semibold text-gray-700 border-b border-gray-200 -mx-8 px-8 pb-3">
              <button
                onClick={() => setActiveTab('all')}
                className={`relative ${
                  activeTab === 'all' ? 'text-[#6C4BF4] font-bold' : 'text-gray-700'
                }`}
              >
                All Messages
                {activeTab === 'all' && (
                  <span className="absolute left-0 -bottom-3 h-1 w-full bg-[#6C4BF4] rounded" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('read')}
                className={`relative ${
                  activeTab === 'read' ? 'text-[#6C4BF4] font-bold' : 'text-gray-700'
                }`}
              >
                Read
                {activeTab === 'read' && (
                  <span className="absolute left-0 -bottom-3 h-1 w-full bg-[#6C4BF4] rounded" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`relative ${
                  activeTab === 'unread' ? 'text-[#6C4BF4] font-bold' : 'text-gray-700'
                }`}
              >
                Unread
                {activeTab === 'unread' && (
                  <span className="absolute left-0 -bottom-3 h-1 w-full bg-[#6C4BF4] rounded" />
                )}
              </button>
            </div>

            <div className="mt-8 space-y-6">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-start px-6 py-3.5 bg-gray-50 rounded-xl shadow-lg transition-all duration-300 hover:bg-gray-100"
                  >
                    <div className="flex items-start space-x-6 w-full">
                      {renderIcon(m.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-lg text-gray-900 font-medium leading-relaxed">{m.title}</p>
                        <p className={`text-sm mt-1 ${m.status === 'unread' ? 'text-gray-900' : 'text-gray-500'}`}>{m.content}</p>
                        <p className={`text-xs mt-0.5 ${m.status === 'unread' ? 'text-gray-900' : 'text-gray-400'}`}>{m.time} &bull; {m.status.charAt(0).toUpperCase() + m.status.slice(1)}</p>
                      </div>
                      <div className={`w-3.5 h-3.5 ${m.status === 'read' ? 'bg-gray-400' : 'bg-blue-500'} rounded-full mt-3.5`}></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-lg py-12">No messages in this category. 🥳</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;
