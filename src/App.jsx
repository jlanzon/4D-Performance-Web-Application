import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/SignUp';
import Profile from './Pages/Profile';
import Scorecard from './Pages/ScoreCard';
import AdminPage from './Pages/Admin';
import Unauthorized from './components/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import Navbar from './components/NavBar';

import CoachLayout from './Pages/Coach/CoachLayout';
import Chat from './Pages/Coach/Chat';
import Settings from './Pages/Coach/Settings';
import DailyCheckIn from './Pages/Coach/DailyCheckIn';
import Blog from './Pages/Coach/Blog';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/scorecard" element={<Scorecard />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminPage />
            </RoleProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Coach Section with Nested Routes */}
        <Route
          path="/coach"
          element={
            <ProtectedRoute>
              <CoachLayout />
            </ProtectedRoute>
          }
        >
          <Route path="chat" element={<Chat />} />
          <Route path="settings" element={<Settings />} />
          <Route path="daily-checkin" element={<DailyCheckIn />} />
          <Route path="blog" element={<Blog />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
