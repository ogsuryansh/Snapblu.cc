import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
    const adminInfo = localStorage.getItem('adminInfo');

    if (!adminInfo) {
        return <Navigate to="/admin/login" replace />;
    }

    return children ? children : <Outlet />;
};

export default AdminProtectedRoute;
