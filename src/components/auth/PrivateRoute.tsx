import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // ← Fix: Named import con {}

interface Props {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'USUARIO';
}

interface DecodedToken {  // Tipo para el token decodificado (ajusta si tu JWT tiene más claims)
  sub: string;  // Email o username
  rol: 'ADMIN' | 'USUARIO';  // Tu claim de rol
  exp: number;  // Expiry (opcional, para validar si expiró)
  // Agrega más si necesitas (iat, etc.)
}

const PrivateRoute: React.FC<Props> = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;  // Redirige si no hay token
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);  // Decode el token

    // Opcional: Chequea expiración
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      return <Navigate to="/login" replace />;
    }

    // Chequea rol si requerido
    if (requiredRole && decoded.rol !== requiredRole) {
      return <Navigate to="/forbidden" replace />;  // 403
    }

    return <>{children}</>;  // Permite acceso
  } catch (error) {
    console.error('Error decodificando token:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;