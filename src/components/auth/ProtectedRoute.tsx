import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center bg-[#0f172a]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
        </div>;
    }

    if (!isAuthenticated) {

        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;