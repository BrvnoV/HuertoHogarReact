import React, { useState, useEffect } from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import { useShop } from '../../context/ShopContext';
import CartItem from './CartItem'; // Importamos el componente de item

export default function CartOffcanvas() {
  // Obtenemos todo lo necesario del contexto
  const { 
    cart, 
    userPoints, 
    showCart,         // Estado para mostrar/ocultar
    setShowCart,      // Función para cerrar
    setShowCheckout   // Función para ABRIR el modal de checkout
  } = useShop();

  // Estado local para los puntos que el usuario quiere canjear
  const [redeemPoints, setRedeemPoints] = useState(0);

  // Calculamos el total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const pointsEarned = Math.floor(total / 100);

  // Resetea los puntos a 0 si el carrito cambia (ej. se vacía)
  useEffect(() => {
    setRedeemPoints(0);
  }, [cart]);

  const handleClose = () => setShowCart(false);

  const handleProceedToCheckout = () => {
    if (redeemPoints > userPoints) {
      // (ShopContext debería tener una función showToast)
      console.error("No tienes suficientes puntos"); 
      // showToast("No tienes suficientes puntos", "error");
      return;
    }
    
    if (cart.length === 0) {
      console.error("El carrito está vacío");
      // showToast("El carrito está vacío", "error");
      return;
    }

    // Almacenamos los puntos a canjear en el contexto (o los pasamos de otra forma)
    // Por ahora, lo más fácil es guardarlos en el contexto
    // Necesitarás añadir `setPointsToRedeem` a tu ShopContext
    // setPointsToRedeem(redeemPoints); 

    handleClose(); // Cierra el carrito
    setShowCheckout(true); // Abre el modal de checkout
  };

  return (
    <Offcanvas show={showCart} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Carrito de Compras</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {cart.length > 0 ? (
          cart.map(item => (
            <CartItem key={item.id} item={item} />
          ))
        ) : (
          <p>Tu carrito está vacío.</p>
        )}

        {/* Resumen y Puntos */}
        <div className="mt-3 border-top pt-3">
          <h5>Total: <span id="cartTotal">${total} CLP</span></h5>
          <p>Puntos que ganarás con esta compra: <span id="cartPoints">{pointsEarned}</span></p>
          <hr />
          <p>Tus puntos disponibles: {userPoints}</p>
          <div className="mb-3">
            <label htmlFor="redeemPoints" className="form-label">
              Usar puntos (1 punto = 1 CLP):
            </label>
            <input 
              type="number" 
              className="form-control" 
              id="redeemPoints" 
              min="0"
              max={userPoints} // No puede usar más de los que tiene
              value={redeemPoints}
              onChange={(e) => setRedeemPoints(Math.max(0, parseInt(e.target.value) || 0))}
            />
          </div>
          <Button 
            variant="primary" 
            className="w-100" 
            onClick={handleProceedToCheckout}
            disabled={cart.length === 0}
          >
            Proceder al Pago
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}