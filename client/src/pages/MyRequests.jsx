import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';

const MyRequests = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return(
         <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <PageHeader title="My Requests" onToggleSidebar={toggleSidebar} />
            </div>
         </div>
    )

}
export default MyRequests;