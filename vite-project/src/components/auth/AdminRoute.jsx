import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from '../ui/Loading';

export function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading size="lg" />
      </div>
    );
  }
console.log({ user, isAuthenticated, isLoading })
  if (!isAuthenticated ||  user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Also export as default for backward compatibility
export default AdminRoute; 