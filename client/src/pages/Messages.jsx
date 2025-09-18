
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import MessageWindow from '../components/messages/MessageWindow';

const Messages = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const messages = [
    { id: 1, type: 'rental', username: '@eventshooter', category: 'Rental', content: 'Hi, can I pick the DSLR Camera up at 3 pm tomorrow?', time: '2 hours ago', status: 'unread' },
    { id: 2, type: 'rental', username: '@janedoe', category: 'Rental', content: "Thanks! I'll return the Laptop by 6 pm today.", time: '8 hours ago', status: 'unread' },
    { id: 3, type: 'rental', username: '@bikerentalsph', category: '', content: 'Hi, can I pick the Mountain Bike up at 3 pm tomorrow?', time: '1 day ago', status: 'read' },
    { id: 4, type: 'rental', username: '@musiklaver', category: '', content: 'Hi, can I pick the Karaoke Set up at 3 pm tomorrow?', time: '3 days ago', status: 'read' },
    { id: 5, type: 'rental', username: '@photogearhub', category: 'Rental', content: 'Hi, can I pick the Tripod up at 3 pm tomorrow?', time: '5 days ago', status: 'unread' },
    { id: 6, type: 'rental', username: '@soundpro', category: '', content: 'Is the Speaker System available for the weekend?', time: '1 week ago', status: 'read' },
    { id: 7, type: 'rental', username: '@gamerig', category: '', content: 'What are the specs for the Gaming PC GPU?', time: '1 week ago', status: 'unread' },
    { id: 8, type: 'rental', username: '@bookworm', category: '', content: 'Can I rent just one book from the Book Collection set?', time: '2 weeks ago', status: 'read' },
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
            <svg className="w-7 h-7 text-[#6C4BF4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
    }
  };

  const selectedMessage = messages.find(m => m.id === selectedConversationId);

  if (selectedConversationId) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <PageHeader title="Messages" onToggleSidebar={toggleSidebar} />
          <main className="flex-1 p-4 flex flex-col overflow-hidden">
            <div className="w-full bg-white rounded-lg shadow-xl pt-4 pl-8 pr-4 pb-8 flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
              <MessageWindow id={selectedConversationId} message={selectedMessage} onBack={() => setSelectedConversationId(null)} />
            </div>
          </main>
        </div>
      </div>
    );
  }

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
        <PageHeader title="Messages" onToggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 flex flex-col overflow-hidden">
          <div className="w-full bg-white rounded-lg shadow-xl pt-4 pl-8 pr-4 pb-8 flex-1 flex flex-col overflow-y-auto overflow-x-hidden scrollable">
            <div className="flex items-center text-sm space-x-12 text-lg font-semibold text-gray-700 border-b border-gray-200 -mx-8 px-8 pb-3 sticky top-0 bg-white z-10">
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

            <div className="mt-4 pr-6 flex-1 flex flex-col overflow-y-auto">
              {filteredMessages.length > 0 ? (
                <div className="space-y-2">
                  {filteredMessages.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedConversationId(m.id)}
                      className="flex items-start px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                    >
                      <div className="flex items-start space-x-4 w-full">
                        {renderIcon(m.type)}
                        <div className="flex-1 min-w-0">
                          {/* Username above content */}
                          <p className="text-sm text-purple-700 font-semibold">{m.username}</p>
                          <p className={`text-xs mt-0.5 ${m.status === 'unread' ? 'text-gray-900' : 'text-gray-500'}`}>{m.content}</p>
                          <p className={`text-xs mt-0.5 ${m.status === 'unread' ? 'text-gray-900' : 'text-gray-400'}`}>{m.time} &bull; {m.status.charAt(0).toUpperCase() + m.status.slice(1)}</p>
                        </div>
                        <div className={`w-2.5 h-2.5 ${m.status === 'read' ? 'bg-gray-400' : 'bg-blue-500'} rounded-full mt-1`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">No messages in this category. 🥳</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;
