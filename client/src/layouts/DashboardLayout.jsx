import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-900 text-dark-100 flex overflow-hidden">
      {/* Dynamic Left Sidebar Menu */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64 min-h-screen transition-all duration-300">
        {/* Dynamic Top Bar */}
        <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Dynamic Page Router Container */}
        <main className="flex-1 overflow-y-auto pt-20 px-6 pb-8">
          <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
