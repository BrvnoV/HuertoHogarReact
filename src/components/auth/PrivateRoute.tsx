import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface PrivateRouteProps {
  requiredRole?: 'ADMIN' | 'USUARIO';
  children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredRole, children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded: any = jwtDecode(token);
    console.log("Decoded Token Check:", decoded);

    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.log("Token expired");
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      return <Navigate to="/login" replace />;
    }

    if (requiredRole) {
      let userRole = decoded.rol || decoded.role || decoded.roles?.[0];

      if (!userRole && decoded.authorities) {
        const auth = Array.isArray(decoded.authorities) ? decoded.authorities[0] : decoded.authorities;
        userRole = typeof auth === 'string' ? auth : auth?.authority;
      }

      console.log(`Required: ${requiredRole}, Found: ${userRole}`);

      // FIX: Normalización extendida
      if (userRole === 'ROLE_ADMIN') userRole = 'ADMIN';
      if (userRole === 'ROLE_USER' || userRole === 'USER') userRole = 'USUARIO';  // FIX: Añade 'USER' → 'USUARIO'

      // Jerarquía: ADMIN accede a todo; USUARIO solo a USUARIO
      const hasAccess = (userRole === requiredRole) || 
                        (requiredRole === 'USUARIO' && userRole === 'ADMIN');

      if (!hasAccess) {
        console.log(`Access denied: ${userRole} does not match ${requiredRole}`);
        return <Navigate to="/forbidden" replace />;
      }
    }

    return children ? <>{children}</> : <Outlet />;
  } catch (error) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;