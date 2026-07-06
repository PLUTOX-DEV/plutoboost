import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { setAuthToken } from '../api';

const AuthHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Use the function from api.js to set the token
      setAuthToken(token);

      // Remove the token from the URL so it's not visible to the user
      // and navigate to the dashboard or home page.
      navigate('/dashboard', { replace: true });
    }
  }, [searchParams, navigate]);

  return null; // This component doesn't render anything
};

export default AuthHandler;