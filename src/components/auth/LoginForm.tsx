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
      // Endpoint exacto de tu controller
      const res = await api.post('/usuarios/login', {
        email: formData.email,
        contrasena: formData.password  // Campo de BE (LoginRequest.getContrasena)
      });

      const token = res.data.token;
      const usuario = res.data.usuario;
      const fullName = `${usuario.nombre} ${usuario.apellido || ''}`.trim();

      localStorage.setItem('token', token);

      // Decodificar rol para el estado global
      let userRole: 'ADMIN' | 'USUARIO' | undefined;
      try {
        const decoded: any = jwtDecode(token);
        const rawRole = decoded.rol || decoded.role || decoded.authorities?.[0]?.authority || decoded.authorities?.[0];
        if (rawRole === 'ROLE_ADMIN' || rawRole === 'ADMIN') userRole = 'ADMIN';
        else if (rawRole === 'ROLE_USER' || rawRole === 'USUARIO') userRole = 'USUARIO';
      } catch (e) {
        console.error('Error decoding token:', e);
      }

      const userData = { name: fullName, email: formData.email, role: userRole };
      loginUser(userData);

      showToast(`¡Bienvenido, ${fullName}!`, 'success');
      navigate('/');  // Redirige home

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err: any) {
      console.error('Login error:', err.response?.data);  // Debug
      const msg = err.response?.data || 'Credenciales inválidas';
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
    </Form>
  );
}