import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
// OAuth2 Redirect Handler
function OAuth2RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Optionally, fetch user info here and store roles/email if needed
    }
    navigate('/', { replace: true });
  }, [location, navigate]);
  return <div>Signing in with Google...</div>;
}
import Login from './pages/Login';
import Register from './pages/Register';
import HrDashboard from './pages/HrDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import About from './pages/About';
import Market from './pages/Market';
import UserDashboard from './pages/UserDashboard';
import Profile from './pages/Profile';
import './App.css';
import React from 'react';
import useNoOrganization from './hooks/useNoOrganization';

function getUserRoles(): string[] {
  try {
    const roles = localStorage.getItem("userRoles");
    return roles ? JSON.parse(roles) : [];
  } catch {
    return [];
  }
}

function RequireAdmin({ children }: { children: React.ReactElement }) {
  const roles = getUserRoles();
  if (!roles.includes("ADMIN")) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function RequireHR({ children }: { children: React.ReactElement }) {
  const roles = getUserRoles();
  if (!roles.includes("HR")) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function RequireNoOrganization({ children }: { children: React.ReactElement }) {
  const allowed = useNoOrganization();
  if (allowed === null) {
    return <div>Loading...</div>;
  }
  if (!allowed) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  
  return (
    <Routes>
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route
        path="/market"
        element={
          <RequireNoOrganization>
            <Market />
          </RequireNoOrganization>
        }
      />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route
        path="/hr/dashboard"
        element={
          <RequireHR>
            <HrDashboard />
          </RequireHR>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;