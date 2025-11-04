import React, { useState, useMemo } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useShop } from '../../context/ShopContext';

export default function CheckoutModal() {
  // Obtenemos los estados y funciones globales
  const { 
    cart, 
    userPoints,
    showCheckout, 
    setShowCheckout,
    handleConfirmPurchase,
    // Necesitarás añadir estos al contexto para mostrar el modal de "Gracias"
    setShowThankYou,
    setPointsEarned 
  } = useShop();

  // Obtenemos los puntos a canjear (del componente anterior)
  // Nota: Esto requiere que `redeemPoints` se guarde en el contexto o se pase
  // Vamos a asumir que lo leemos desde un estado local del Offcanvas,
  // así que lo leeremos desde el <input> del Offcanvas...
  // ¡Un momento! El Offcanvas se cierra. Es MEJOR guardar los puntos a
  // canjear en un estado temporal.
  
  // Asumiremos que añades `pointsToRedeem` y `setPointsToRedeem` al ShopContext.
  // const { pointsToRedeem } = useShop();
  // --- Simulación (temporal) ---
  // Idealmente, este valor se guarda en el contexto cuando se presiona "Proceder al Pago".
  // Por ahora, lo simulamos leyéndolo del localStorage o un estado temporal.
  // Vamos a añadir un estado `pointsToRedeem` al `ShopContext`.
  const { pointsToRedeem } = useShop();

  // Estado local para los campos del formulario
  const [formData, setFormData] = useState({
    address: '',
    contact: '',
    deliveryDate: '',
    paymentMethod: 'credit',
  });

  // Calculamos los totales (usando 'useMemo' para eficiencia)
  const { total, totalAfterPoints } = useMemo(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalAfterPoints = Math.max(0, total - (pointsToRedeem || 0));
    return { total, totalAfterPoints };
  }, [cart, pointsToRedeem]);


  const handleClose = () => setShowCheckout(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.address && formData.contact && formData.deliveryDate) {
      // Llamamos a la función del contexto para confirmar la compra
      const earned = handleConfirmPurchase(formData, pointsToRedeem || 0);
      
      // Guardamos los puntos ganados para el modal de "Gracias"
      setPointsEarned(earned); 
      
      handleClose(); // Cierra este modal
      setShowThankYou(true); // Abre el modal de "Gracias"
      setFormData({ address: '', contact: '', deliveryDate: '', paymentMethod: 'credit' }); // Resetea el form
    } else {
      // showToast("Por favor, completa todos los campos", "error");
      console.error("Por favor, completa todos los campos");
    }
  };

  return (
    <Modal show={showCheckout} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Finalizar Compra</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <h5>Datos de Envío</h5>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Dirección de Envío</Form.Label>
            <Form.Control type="text" value={formData.address} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="contact">
            <Form.Label>Número de Contacto</Form.Label>
            <Form.Control type="tel" value={formData.contact} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="deliveryDate">
            <Form.Label>Fecha de Entrega Preferida</Form.Label>
            <Form.Control type="date" value={formData.deliveryDate} onChange={handleChange} required />
          </Form.Group>
          
          <hr />
          <h5>Método de Pago</h5>
          <Form.Group className="mb-3" controlId="paymentMethod">
            <Form.Select value={formData.paymentMethod} onChange={handleChange}>
              <option value="credit">Tarjeta de Crédito</option>
              <option value="debit">Tarjeta de Débito</option>
              <option value="transfer">Transferencia Bancaria</option>
            </Form.Select>
          </Form.Group>
          
          <hr />
          <h5>Resumen de la Orden</h5>
          <div id="checkoutCartItems">
            {cart.map(item => (
              <div key={item.id} className="d-flex justify-content-between mb-2">
                <span>{item.name} x {item.quantity}</span>
                <span>${item.price * item.quantity} CLP</span>
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-between">
            <strong>Subtotal:</strong>
            <strong>${total} CLP</strong>
          </div>
          <div className="d-flex justify-content-between text-danger">
            <strong>Puntos usados:</strong>
            <strong>-${pointsToRedeem || 0} CLP</strong>
          </div>
          <hr />
          <div className="d-flex justify-content-between fs-4">
            <strong>Total a Pagar:</strong>
            <strong>${totalAfterPoints} CLP</strong>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="primary" type="submit">Confirmar Compra</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}