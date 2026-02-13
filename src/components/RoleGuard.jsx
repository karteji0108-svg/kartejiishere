import React from 'react';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../constants/roles';
import { Navigate } from 'react-router-dom';

const RoleGuard = ({ permission, children, fallback = null }) => {
  const { userRole, loading } = useAuth();

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Memuat akses...</div>;
  }

  if (!hasPermission(userRole, permission)) {
    return fallback || <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleGuard;
