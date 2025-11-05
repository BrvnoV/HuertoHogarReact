import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useShop } from '../../context/ShopContext';

export default function GlobalToast() {
  // Obtenemos el estado del toast y la función para cerrarlo
  const { toast, hideToast } = useShop();

  // Determinamos el color de fondo (bg) de Bootstrap
  // basado en la 'variant' de nuestro toast
  let bgVariant = 'info'; // Default
  if (toast.variant === 'success') bgVariant = 'success';
  if (toast.variant === 'error') bgVariant = 'danger';

  return (
    <ToastContainer
      className="p-3"
      position="bottom-end" // Esquina inferior derecha
      style={{ zIndex: 1100 }} // Asegura que esté sobre otros elementos
    >
      <Toast
        onClose={hideToast} // Llama a la función del contexto al cerrar
        show={toast.show}  // El contexto le dice si debe mostrarse
        delay={3000}       // Coincide con el temporizador del contexto
        autohide           // Se oculta solo
        bg={bgVariant}     // Color de fondo
        className={toast.variant === 'info' ? '' : 'text-white'} // Texto blanco para fondos oscuros
      >
        <Toast.Header>
          <strong className="me-auto">Notificación</strong>
        </Toast.Header>
        <Toast.Body>{toast.message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}