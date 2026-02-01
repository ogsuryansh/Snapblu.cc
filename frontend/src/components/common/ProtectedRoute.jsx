import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check if user is logged in (token exists)
    const userInfo = sessionStorage.getItem('userInfo');

    if (!userInfo) {
        // Not logged in? Go to login
        return <Navigate to="/login" replace />;
    }

    // Logged in? Show the page
    return children ? children : <Outlet />;
};

export default ProtectedRoute;
