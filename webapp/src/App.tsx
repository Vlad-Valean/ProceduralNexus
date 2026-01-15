import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ChatFab } from "./components/chatbot";
import Login from './pages/Login';
import Register from './pages/Register';
import HrDashboard from './pages/HrDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import About from './pages/About';
import Market from './pages/Market';
import UserDashboard from './pages/UserDashboard';
import Profile from './pages/Profile';
import ResetPasswordPage from './pages/ResetPasswordPage';
import './App.css';
import useNoOrganization from './hooks/useNoOrganization';

function OAuth2RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      let email = '';
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        email = payload.email ?? '';
      } catch {
        return;
      }
      if (email) {
        fetch('http://localhost:8080/auth/oauth-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })
          .then(res => res.json())
          .then(data => {
            if (data.token) {
              localStorage.setItem('token', data.token);
              localStorage.setItem('userEmail', data.email ?? '');
              localStorage.setItem('userRoles', JSON.stringify(data.roles ?? []));
            } else {
              // fallback: decode and save from original token
              localStorage.setItem('token', token);
              localStorage.setItem('userEmail', '');
              localStorage.setItem('userRoles', '[]');

            }
            navigate('/', { replace: true });
          })
          .catch(() => {
            // fallback: decode and save from original token
            localStorage.setItem('token', token);
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              localStorage.setItem('userEmail', payload.email ?? '');
              localStorage.setItem('userRoles', JSON.stringify(payload.roles ?? []));
              if (payload.id) localStorage.setItem('userId', payload.id);
            } catch {
              localStorage.setItem('userEmail', '');
              localStorage.setItem('userRoles', '[]');
              localStorage.removeItem('userId');
            }
            navigate('/', { replace: true });
          });
      } else {
        // fallback: decode and save from original token
        localStorage.setItem('token', token);
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          localStorage.setItem('userEmail', payload.email ?? '');
          localStorage.setItem('userRoles', JSON.stringify(payload.roles ?? []));
          if (payload.id) localStorage.setItem('userId', payload.id);
        } catch {
          localStorage.setItem('userEmail', '');
          localStorage.setItem('userRoles', '[]');
          localStorage.removeItem('userId');
        }
        navigate('/', { replace: true });
      }
    } else {
      navigate('/', { replace: true });
    }
  }, [location, navigate]);
  return <div>Signing in with Google...</div>;
}

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
    <>
    <Routes>
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
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
    <ChatFab />
    </>
  );
}

export default App;