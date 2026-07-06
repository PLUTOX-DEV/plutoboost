import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import api from '../api';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const loadUser = async () => {
      // Check for token in URL from OAuth redirects
      const searchParams = new URLSearchParams(window.location.search);
      const urlToken = searchParams.get('token');
      if (urlToken) {
        localStorage.setItem('token', urlToken);
        // Clean the URL after storing the token
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      if (token) {
        // Check if it's an admin token by trying to fetch admin data
        if (localStorage.getItem('adminToken')) {
          setUser({ username: 'admin', role: 'admin' });
        } else {
          try {
            const res = await api.get('/dashboard'); // Use a dedicated user endpoint
            setBalance(res.data.balance);
            setUser(res.data.user);
          } catch (err) {
            // Token might be invalid, so clear it
            localStorage.removeItem('token');
            console.error('Auth failed on load:', err);
          }
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/api/login', { username, password });
    const { token, user, balance } = res.data;
    localStorage.setItem('token', token); // Keep this to persist session
    setUser(user);
    setBalance(balance);
  };

  const register = async (username, email, password) => {
    const res = await api.post('/api/register', { username, email, password });
    const { token, user, balance } = res.data;
    localStorage.setItem('token', token); // Keep this to persist session
    setUser(user);
    setBalance(balance);
  };

  const adminLogin = async (username, password) => {
    const res = await api.post('/api/admin/login', { username, password });
    const { token } = res.data;
    // Use a different storage key for admin to avoid conflicts
    localStorage.setItem('adminToken', token);
    // Admin doesn't have a user object in the same way
    setUser({ username: 'admin', role: 'admin' });
  };

  const placeOrder = async (service, platform, quantity, link) => {
    // Centralized price calculation
    const res = await api.post('/api/orders', {
      serviceId: service.id,
      serviceType: service.name,
      platform,
      quantity,
      link,
      orderDetails: `${quantity} ${service.name} for ${platform}`,
    });
    setBalance(res.data.newBalance);
    return res.data; // Return the full response object
  };

  const fetchRecentOrders = async () => {
    try {
      const res = await api.get('/user/orders');
      return res.data.slice(0, 3).map(order => ({
        platform: order.platform ? order.platform.charAt(0).toUpperCase() + order.platform.slice(1) : 'N/A',
        service: order.serviceType ? order.serviceType.charAt(0).toUpperCase() + order.serviceType.slice(1) : 'N/A',
        qty: order.quantity || 0,
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      }));
    } catch (err) {
      console.error('Failed to fetch recent orders:', err);
      return [];
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    loading,
    balance,
    login,
    register,
    adminLogin,
    logout,
    setBalance,
    placeOrder,
    fetchRecentOrders,
  }), [user, loading, balance]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;