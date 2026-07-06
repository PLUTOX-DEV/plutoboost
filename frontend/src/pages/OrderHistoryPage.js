import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the centralized api

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Check for token on the client-side first
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view your orders.');
          return;
        }

        // The 'x-auth-token' header is automatically added by the api client
        const res = await api.get('/api/orders');
        setOrders(res.data);
      } catch (err) {
        const errorMessage = err.response?.data?.msg || err.message || 'Failed to fetch orders.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading order history...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Your Order History</h2>
      {orders.length === 0 ? (
        <p>You have no past orders.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Service</th>
              <th>Details</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id || order.orderId}>
                <td>{order._id}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.serviceType}</td>
                <td>{order.orderDetails}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistoryPage;