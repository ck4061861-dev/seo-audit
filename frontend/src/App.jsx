import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landingpage from "../Landingpage.jsx";
import Login from "./Auth/UserLogin.jsx";
import Register from "./Auth/UserRegister.jsx";
import ForgotPassword from "./Auth/ForgotPassword.jsx";
import Footer from './components/Footer.jsx';
import AdminLogin from './Auth/Adminlogin.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import Topbar from './components/Topbar.jsx';
import AdminRegister from './Auth/AdminRegister.jsx';
import UserProfile from './components/UserProfile.jsx';
import Pricing from './components/Pricing.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Settings from './components/Settings.jsx';

const App = () => {
  return (
    <Router>
      <Topbar />
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/owner" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/owner/register" element={<AdminRegister />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/owner" replace />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App;