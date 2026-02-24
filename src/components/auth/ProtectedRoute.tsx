import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
    requiredRole?: string | string[];
    requiredPermissions?: string | string[];
    requireAllPermissions?: boolean;
    fallbackPath?: string;
}


const ProtectedRoute = ({
    requiredRole,
    requiredPermissions,
    requireAllPermissions = false,
    fallbackPath = '/unauthorized'
}: ProtectedRouteProps) => {

    const { isAuthenticated, isLoading, hasRole, hasPermission } = useAuth();

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center bg-[#0f172a]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
        </div>;
    }

    if (!isAuthenticated) {

        return <Navigate to="/" replace />;
    }

    //  check role
    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to={fallbackPath} replace />;
    }

    //  check permission for future use
    if (requiredPermissions) {
        const permissions = Array.isArray(requiredPermissions)
            ? requiredPermissions
            : [requiredPermissions];

        const hasRequiredPermission = requireAllPermissions
            ? permissions.every(perm => hasPermission(perm))
            : permissions.some(perm => hasPermission(perm));

        if (!hasRequiredPermission) {
            return <Navigate to={fallbackPath} replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;