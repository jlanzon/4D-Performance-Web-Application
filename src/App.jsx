import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { DarkModeProvider } from './context/Theme'; 
import { ModelNameProvider } from './context/ModelName';
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
import Blog from './Pages/Coach/Blog/Blog';
import BlogLayout from './Pages/Coach/Blog/BlogLayout';
import BlogList from './Pages/Coach/Blog/BlogList';
import BlogCreate from './Pages/Coach/Blog/BlogCreate';
import BlogView from './Pages/Coach/Blog/BlogView';

// Layout component used to wrap all routes with the common Navbar
const Layout = ({ children }) => {
  const location = useLocation();
  const isCoachRoute = location.pathname.startsWith('/coach');

  return (
    <>
      {!isCoachRoute && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <DarkModeProvider>
      <ModelNameProvider>
        <Router>
          <Layout>
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

              <Route
                path="/coach"
                element={
                  <ProtectedRoute>
                    <CoachLayout />
                  </ProtectedRoute>
                }
              >
                <Route
                  path="chat"
                  element={
                    <RoleProtectedRoute
                      allowedRoles={[
                        "Premium",
                        "Super User",
                        "Platinum User",
                        "Tester",
                        "Admin",
                        "Manager",
                        "Moderator",
                        "Contributor",
                        "admin"
                      ]}
                    >
                      <Chat />
                    </RoleProtectedRoute>
                  }
                />
                <Route path="settings" element={<Settings />} />
                <Route path="daily-checkin" element={<DailyCheckIn />} />
                <Route path="blog" element={<BlogLayout />}>
                  <Route path="list" element={<BlogList />} />
                  <Route path="create" element={<BlogCreate />} />
                  <Route path=":blogId" element={<BlogView />} />
                </Route>
              </Route>
            </Routes>
          </Layout>
        </Router>
      </ModelNameProvider>
    </DarkModeProvider>
  );
}

export default App;