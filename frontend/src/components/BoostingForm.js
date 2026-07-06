import React, { useState } from 'react';
import api from '../api'; // Import the centralized api

const BoostingForm = () => {
  const [formData, setFormData] = useState({
    serviceType: 'Rank Boosting',
    orderDetails: '',
    price: 50, // Example price
  });
  const [message, setMessage] = useState('');

  const { serviceType, orderDetails, price } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('Processing...');

    try {
      // Create the order using the user's wallet balance
      // The 'x-auth-token' header is now automatically added by the api client
      const res = await api.post('/api/orders', formData);

      // Axios throws an error for non-2xx responses, so we can catch it directly.
      // The response data is available on `res.data`.

      setMessage('Order placed successfully! You can now track it in your order history.');
      setFormData({ serviceType: 'Rank Boosting', orderDetails: '', price: 50 }); // Reset form
    } catch (err) {
      // Axios wraps the error response in `err.response.data`
      const errorMessage = err.response?.data?.msg || err.message || 'Order creation failed';
      setMessage(errorMessage);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Place a Boosting Order</h2>
      <div>
        <label>Service Type</label>
        <select name="serviceType" value={serviceType} onChange={onChange}>
          <option value="Rank Boosting">Rank Boosting</option>
          <option value="Win Boosting">Win Boosting</option>
          <option value="Placement Matches">Placement Matches</option>
        </select>
      </div>
      <div>
        <label>Order Details (Current/Desired Rank, etc.)</label>
        <textarea
          name="orderDetails"
          value={orderDetails}
          onChange={onChange}
          required
        ></textarea>
      </div>
      <p>Price: ${price}</p>
      <button type="submit">Place Order</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default BoostingForm;