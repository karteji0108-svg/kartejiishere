import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const { currentUser, userRole, userStatus, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    // Status Checks
    if (userStatus === 'pending') {
        return <Navigate to="/pending" replace />;
    }

    if (userStatus === 'rejected') {
        return <Navigate to="/rejected" replace />;
    }

    // Role Checks
    if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
