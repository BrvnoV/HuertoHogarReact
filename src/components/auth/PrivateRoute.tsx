import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface PrivateRouteProps {
  requiredRole?: 'ADMIN' | 'USUARIO';
  children?: React.ReactNode;
}

interface DecodedToken {
  sub: string;
  rol: string;
  exp: number;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredRole, children }) => {
  const token = localStorage.getItem('token');

  // 1. Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // 2. Decodificar token
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // 3. Verificar expiración
    if (decoded.exp < currentTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      return <Navigate to="/login" replace />;
    }

    // 4. Verificar Rol (si se requiere uno específico)
    if (requiredRole && decoded.rol !== requiredRole) {
      return <Navigate to="/forbidden" replace />;
    }

    // 5. Si todo OK, renderizar contenido
    return children ? <>{children}</> : <Outlet />;

  } catch (error) {
    // Si el token es inválido
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;