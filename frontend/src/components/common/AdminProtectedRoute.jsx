import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
    const adminInfo = localStorage.getItem('adminInfo');

    if (!adminInfo) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;
