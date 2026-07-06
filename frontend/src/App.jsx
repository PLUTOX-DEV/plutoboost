
import React, { useEffect, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserContext from './context/UserContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);
  if (loading) return <div>Loading...</div>; // Or a spinner
  return user && user.role !== 'admin' ? children : <Navigate to="/login" />;
}

function AdminProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);
  if (loading) return <div>Loading...</div>; // Or a spinner
  return user && user.role === 'admin' ? children : <Navigate to="/admin-login" />;
}
// Core Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';

// User Dashboard Pages
import AdminDashboard from './pages/admin';
import AddFunds from "./pages/AddFunds";
import Orders from "./pages/Orders.jsx";
import Dashboard2 from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Analytics from './pages/Analytics';
import Wallet from './pages/Wallet';
import NotificationsPage from "./pages/NotificationsPage";

// Admin Pages
import AdminUsers from "./components/AdminUsers";
import AdminOrders from "./components/AdminOrders";
import AdminDeposits from "./components/AdminDeposits";
import AdminSystem from "./components/AdminSystem";
import AdminFees from "./pages/AdminFees";
import AdminBlog from "./components/AdminBlog";
import AdminNotifications from "./components/AdminNotifications";
import AdminWatchdog from "./components/AdminWatchdog";

// Public Info Pages
import PricingPage from "./components/PricingPage";
import BlogPage from "./components/BlogPage";
import PostPage from "./components/PostPage";
import AffiliatePage from "./components/AffiliatePage";
import ContactPage from "./components/ContactPage";
import FeaturesInstagram from "./pages/FeaturesInstagram";
import About from "./pages/About";
import FeaturesYoutube from "./pages/FeaturesYoutube";
import Careers from "./pages/Careers";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import RefundPolicy from "./pages/RefundPolicy";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import FeaturesAnalytics from "./pages/FeaturesAnalytics";

export default function App(){

  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* User Dashboard Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard2/></ProtectedRoute>}/>
      <Route path="/addfunds" element={<ProtectedRoute><AddFunds/></ProtectedRoute>}/>
      <Route path="/orders" element={<ProtectedRoute><Orders/></ProtectedRoute>}/>
      <Route path="/analytics" element={<ProtectedRoute><Analytics/></ProtectedRoute>}/>
      <Route path="/wallet" element={<ProtectedRoute><Wallet/></ProtectedRoute>}/>
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage/></ProtectedRoute>}/>
      <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>}/>
      <Route path="/affiliate" element={<ProtectedRoute><AffiliatePage/></ProtectedRoute>}/>

      {/* Public Info Routes */}
      <Route path="/pricing/:platform" element={<PricingPage />} />
      <Route path="/features/instagram" element={<FeaturesInstagram />} />
      <Route path="/features/youtube" element={<FeaturesYoutube />} />
      <Route path="/features/analytics" element={<FeaturesAnalytics />} />
      <Route path="/blog" element={<BlogPage/>}/>
      <Route path="/blog/:slug" element={<PostPage/>}/>
      <Route path="/contact" element={<ContactPage/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/careers" element={<Careers/>}/>
      <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
      <Route path="/terms-of-service" element={<TermsOfService/>}/>
      <Route path="/refund-policy" element={<RefundPolicy/>}/>
      <Route path="/help" element={<ContactPage/>}/>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard/></AdminProtectedRoute>}/>
      <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
      <Route path="/admin/orders" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />
      <Route path="/admin/deposits" element={<AdminProtectedRoute><AdminDeposits /></AdminProtectedRoute>} />
      <Route path="/admin/blog" element={<AdminProtectedRoute><AdminBlog /></AdminProtectedRoute>} />
      <Route path="/admin/fees" element={<AdminProtectedRoute><AdminFees /></AdminProtectedRoute>} />
      <Route path="/admin/system" element={<AdminProtectedRoute><AdminSystem /></AdminProtectedRoute>} />
      <Route path="/admin/watchdog" element={<AdminProtectedRoute><AdminWatchdog /></AdminProtectedRoute>} />
      <Route path="/admin/notifications" element={<AdminProtectedRoute><AdminNotifications /></AdminProtectedRoute>} />
    </Routes>
  );
}
