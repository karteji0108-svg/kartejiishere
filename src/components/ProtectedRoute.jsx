import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const { currentUser, userRole, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // Check role based access
    if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
        // Redirect to a safe page if unauthorized
        // If they are logged in but don't have access, maybe send them to dashboard?
        // But if they are *already* on dashboard but maybe it's restricted?
        // For now, let's redirect to dashboard if allowed, or unauthorized page.
        // But for simplicity, let's redirect to dashboard.
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
