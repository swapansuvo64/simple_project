// src/components/ProtectedRoute.jsx
import React from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase.init';
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
