import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!user || !user.accessToken) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role check
    // user.roles is an array, allowedRoles is an array
    const hasRole = user.roles.find(role => allowedRoles.includes(role));
    if (!hasRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
