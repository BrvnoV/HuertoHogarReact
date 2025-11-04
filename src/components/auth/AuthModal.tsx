import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useShop } from '../../context/ShopContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthModal() {
  // 1. Controlamos la visibilidad del modal desde el contexto
  const { showAuth, setShowAuth } = useShop();

  // 2. Estado local para saber qué formulario mostrar: 'login' o 'register'
  const [view, setView] = useState<'login' | 'register'>('login');

  // 3. Funciones para cambiar de vista
  const switchToRegister = () => setView('register');
  const switchToLogin = () => setView('login');

  // 4. Función para cerrar el modal
  const handleClose = () => {
    setShowAuth(false);
    // Reseteamos a 'login' para la próxima vez que se abra
    setTimeout(() => {
      setView('login');
    }, 300); // Pequeño delay para la animación de cierre
  };

  // Esta función se pasa a los formularios hijos
  // para que puedan cerrar el modal (ej. después de un login exitoso)
  const onSuccess = () => {
    handleClose();
  };

  return (
    <Modal show={showAuth} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {/* El título cambia según la vista */}
          {view === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {view === 'login' ? (
          <LoginForm 
            onSwitchToRegister={switchToRegister} 
            onLoginSuccess={onSuccess} 
          />
        ) : (
          <RegisterForm 
            onSwitchToLogin={switchToLogin}
            onRegisterSuccess={switchToLogin} // Vuelve a login después de registrarse
          />
        )}
      </Modal.Body>
    </Modal>
  );
}