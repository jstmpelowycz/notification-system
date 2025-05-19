import { Navigate, useLocation } from 'react-router-dom';

import { useAuthStore } from '../stores/auth.store';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const location = useLocation();

    if (!isAuthenticated || !user) {
        if (location.pathname === '/login') {
            return <>{children}</>;
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
