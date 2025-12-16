import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import api from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { jwtDecode } from 'jwt-decode';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onLoginSuccess?: () => void;
}

export default function LoginForm({ onSwitchToRegister, onLoginSuccess }: LoginFormProps) {
  const navigate = useNavigate();
  const { showToast, loginUser } = useShop();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Email y contraseña son requeridos');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // LOG TEMPORAL: Para debug – confirma qué se envía al backend (remueve después)
      console.log('Enviando login request:', { email: formData.email, contrasena: formData.password });

      // Endpoint exacto de tu controller (con axios baseURL, se hace /api/v1/usuarios/login)
      const res = await api.post('/usuarios/login', {
        email: formData.email,
        contrasena: formData.password  // Campo de BE (LoginRequest.getContrasena)
      });

      const token = res.data.token;
      const usuario = res.data.usuario;
      const fullName = `${usuario.nombre} ${usuario.apellido || ''}`.trim();

      localStorage.setItem('token', token);

      // Decodificar rol para el estado global – FIX: Prioriza decoded.role (de JwtService)
      let userRole: 'ADMIN' | 'USUARIO' | undefined;
      try {
        const decoded: any = jwtDecode(token);
        const rawRole = decoded.role || decoded.rol || decoded.authorities?.[0]?.authority || decoded.authorities?.[0];
        if (rawRole === 'ROLE_ADMIN' || rawRole === 'ADMIN') userRole = 'ADMIN';
        else if (rawRole === 'ROLE_USER' || rawRole === 'USUARIO' || rawRole === 'ROLE_USUARIO') userRole = 'USUARIO';
        console.log('Rol decodificado:', rawRole, '→ Mapeado a:', userRole);  // LOG TEMPORAL
      } catch (e) {
        console.error('Error decoding token:', e);
      }

      const userData = { name: fullName, email: formData.email, role: userRole };
      loginUser(userData);

      showToast(`¡Bienvenido, ${fullName}!`, 'success');
      navigate('/');  // Redirige home (cámbialo a '/admin' si quieres auto para admin)

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err: any) {
      // MEJORA: Manejo específico de errores por status
      const status = err.response?.status;
      console.error('Login error details:', { status, data: err.response?.data, url: err.config?.url });  // Debug mejorado

      let msg = 'Error desconocido';
      if (status === 401) {
        msg = 'Credenciales inválidas. Verifica email y contraseña.';
      } else if (status === 400) {
        msg = 'Datos inválidos. Intenta de nuevo.';
      } else if (status === 500) {
        msg = 'Error en el servidor. Intenta más tarde.';
      } else {
        msg = err.response?.data?.message || err.response?.data || 'Error en login';
      }

      setError(typeof msg === 'string' ? msg : 'Error desconocido');
      showToast('Error en login: ' + (typeof msg === 'string' ? msg : 'Inténtalo de nuevo'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Switching to register...');
    onSwitchToRegister();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={formData.email}
          onChange={handleChange}
          isInvalid={!!error}
          placeholder="ejemplo@gmail.com"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          value={formData.password}
          onChange={handleChange}
          isInvalid={!!error}
          required
        />
        {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
        {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
      </Button>

      <p className="text-center">
        <a href="#" onClick={handleSwitchToRegister}>
          ¿No tienes cuenta? Regístrate
        </a>
      </p>
      {/* Opcional: Agrega si quieres */}
      {/* <p className="text-center"><a href="/forgot-password">¿Olvidaste tu contraseña?</a></p> */}
    </Form>
  );
}