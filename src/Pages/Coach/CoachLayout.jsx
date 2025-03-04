import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';

const CoachLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex pt-12">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-40 bg-slate-800 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:translate-x-0 md:w-40`}
      >
        <div className="p-4">
          <button onClick={toggleSidebar} className="md:hidden text-white">
            Close
          </button>
          <div className="flex flex-col gap-4 mt-4">
            <Link to="chat" className="hover:underline">Chat</Link>
            <Link to="settings" className="hover:underline">Settings</Link>
            <Link to="daily-checkin" className="hover:underline">Daily Check-In</Link>
            <Link to="blog" className="hover:underline">Blog</Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4 pt-12">
        <button onClick={toggleSidebar} className="md:hidden mb-4 text-white">
          Menu
        </button>
        {location.pathname === '/coach' && <Navigate to="chat" replace />}
        <Outlet />
      </div>
    </div>
  );
};

export default CoachLayout;