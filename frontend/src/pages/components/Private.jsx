// src/components/PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/Contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
}
