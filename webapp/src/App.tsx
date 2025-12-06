import { Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/market" element={<Market />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/hr/dashboard" element={<HrDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
