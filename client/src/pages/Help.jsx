import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';

const guides = [
  { id: 1, title: 'Getting started with QuickRent', content: 'Learn how to create an account, set up your profile, and start renting.' },
  { id: 2, title: 'Posting an item for rent', content: 'Step-by-step guide to list your item, set pricing, and manage requests.' },
  { id: 3, title: 'Requesting to rent an item', content: 'How to search, filter, and request items from other users.' },
  { id: 4, title: 'Payments and withdrawals', content: 'Understand deposits, payments, and how to withdraw your earnings.' },
  { id: 5, title: 'Account and security', content: 'Reset password, enable 2FA, and keep your account secure.' },
];

const Help = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const filtered = guides.filter(g => g.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="Help Center" onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-6">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search help articles..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4]"
                />
              </div>
              <div className="space-y-4">
                {filtered.length ? (
                  filtered.map(g => (
                    <article key={g.id} className="p-4 border border-gray-200 rounded-md hover:bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-900">{g.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{g.content}</p>
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No guides matched your search.</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Help;
