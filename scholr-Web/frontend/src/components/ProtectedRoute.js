import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const ProtectedRoute = ({ roles = [] }) => {
    const { user, isAuthenticated, loading } = useAuth();
    if (loading) {
        return <div>Loading...</div>;
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }
    if (roles.length > 0 && !roles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace/>;
    }
    return <Outlet />;
};
export default ProtectedRoute;
