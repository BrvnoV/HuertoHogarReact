import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useShop } from '../../context/ShopContext';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: () => void;
}

export default function LoginForm({ onSwitchToRegister, onLoginSuccess }: LoginFormProps) {
  // Obtenemos la función de login del contexto
  const { handleLogin, showToast } = useShop();

  // Estado local para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    // Llamamos a la función de login del contexto
    const success = handleLogin(email, password);

    if (success) {
      onLoginSuccess(); // Cierra el modal
    } else {
      // El contexto ya muestra un toast, pero podemos poner un error local
      setError('Email o contraseña incorrectos');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form.Group className="mb-3" controlId="loginEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="alumno@duoc.cl"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="loginPassword">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Duoc1234*"
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100">
        Iniciar Sesión
      </Button>

      <p className="mt-3 text-center">
        <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}>
          ¿No tienes cuenta? Regístrate
        </a>
      </p>
      <p className="text-center">
        <a href="#">¿Olvidaste tu contraseña?</a>
      </p>
    </Form>
  );
}