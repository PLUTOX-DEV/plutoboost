import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Assuming you create this

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    // You can show a loading spinner here while checking auth status
    return <div>Loading...</div>;
  }

  if (!user) {
    // If no token is found, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  return children; // If token exists, render the child component
};
export default ProtectedRoute;