import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import api from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';  // Para toasts

interface LoginFormProps {
  onSwitchToRegister: () => void;  // Para switch a registro (ajusta si no lo usas)
  onLoginSuccess?: () => void;  // ← Nueva prop opcional para éxito (ej. cierra modal)
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const navigate = useNavigate();
  const { showToast } = useShop();  // Solo toast por ahora; agrega setUser si actualizas contexto

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError('');  // Limpia error al tipear
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
    // TEMPORAL: Comenta el api.post cuando el BE esté listo
    // const res = await api.post('/api/login', {
    //   email: formData.email,
    //   contraseña: formData.password
    // });

    // Usuario dummy con rol basado en email (USUARIO por default, ADMIN si email incluye 'admin')
    const rol = formData.email.toLowerCase().includes('admin') ? 'ADMIN' : 'USUARIO';
    const nombre = rol === 'ADMIN' ? 'Admin User' : 'Juan Pérez';

    // Token fake con claim 'rol' (generado en jwt.io – copia este para test)
    const token = rol === 'ADMIN' 
      ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbl9lZ2CiIsIm5vbWJyZSI6IkFkbWluIFVzZXIiLCJyb2wiOiJBRE1JTiIsImlhdCI6MTUxNjIzOTAyMn0.dQw4w9WgXcQ'  // Token con rol 'ADMIN'
      : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3VhcmlvX2VtYWlsIiwibm9tYnJlIjoiSnVhbiBQZXJleiIsInJvbCI6IlVTVUFSSU8iLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';  // Token con rol 'USUARIO'

    const res = {
      data: {
        token,
        nombre,
        rol
      }
    };

    // Guarda en localStorage
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('usuario', res.data.nombre);

    showToast(`¡Bienvenido, ${res.data.nombre}!`, 'success');
    navigate('/');  // Redirige a home
  } catch (err: any) {
    const msg = err.response?.data?.message || 'Credenciales inválidas';
    setError(msg);
    showToast('Error en login: ' + msg, 'error');
  } finally {
    setLoading(false);
  }
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
          placeholder="ejemplo@duocuc.cl"
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
        <a href="#" onClick={(e) => { 
          e.preventDefault(); 
          onSwitchToRegister(); 
        }}>
          ¿No tienes cuenta? Regístrate
        </a>
      </p>
    </Form>
  );
}