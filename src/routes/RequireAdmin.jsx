import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function RequireAdmin({ children }) {
  const { token, user } = useAuth();
  const location = useLocation();
  if (!token || user?.role !== 'admin') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
