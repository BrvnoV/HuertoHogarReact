import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useShop } from '../../context/ShopContext';

export default function ThankYouModal() {
  // 1. Obtenemos el estado y las funciones del contexto
  const { 
    showThankYou,     // (Estado) El booleano que dice si se muestra
    setShowThankYou,  // (Función) La que cambia el estado
    pointsEarned      // (Estado) Los puntos ganados
  } = useShop();

  // 2. Función para manejar el cierre (¡con la sintaxis correcta "=>"!)
  const handleClose = () => {
    setShowThankYou(false); // Llama a la función del contexto para cerrar
  };

  return (
    // 3. Pasamos la FUNCIÓN handleClose al prop 'onHide'
    <Modal show={showThankYou} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title id="thankYouModalLabel">¡Compra Confirmada!</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <p>
          Gracias por tu compra. Recibirás una confirmación por 
          correo electrónico con los detalles de tu pedido.
        </p>
        
        <p>Puntos ganados: <span id="pointsEarned">{pointsEarned}</span></p>
        
        <p>Puedes rastrear tu pedido en la sección "Mis Pedidos".</p>
      </Modal.Body>
      
      <Modal.Footer>
        {/* 4. Pasamos la FUNCIÓN handleClose al prop 'onClick' */}
        <Button variant="primary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}