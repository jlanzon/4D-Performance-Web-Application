import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const CoachLayout = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="bg-slate-800 p-4 flex gap-6">
        <Link to="chat" className="hover:underline">Chat</Link>
        <Link to="settings" className="hover:underline">Settings</Link>
        <Link to="daily-checkin" className="hover:underline">Daily Check-In</Link>
        <Link to="blog" className="hover:underline">Blog</Link>
      </nav>
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default CoachLayout;
