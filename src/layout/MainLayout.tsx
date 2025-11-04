// src/layout/MainLayout.tsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

// 1. Importar los componentes del esqueleto
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ui/ScrollToTop'; // Componente útil para la navegación

// 2. Importar todos los Modals y Offcanvas "globales"
import AuthModal from '../components/auth/AuthModal';
import CartOffcanvas from '../components/cart/CartOffcanvas';
import CheckoutModal from '../components/cart/CheckoutModal';
import ThankYouModal from '../components/ui/ThankYouModal';
// Nota: El ReviewModal lo manejaremos desde la página de Productos,
// ya que no se dispara desde el layout.

export default function MainLayout() {
  
  // 3. Definir los estados para controlar la visibilidad de los overlays
  const [showAuth, setShowAuth] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Estado para pasar los puntos ganados al modal de "Gracias"
  const [pointsEarned, setPointsEarned] = useState(0);

  // 4. Definir las funciones de "flujo" entre modals
  
  // Cierra el carrito y abre el checkout
  const handleProceedToCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  // Cierra el checkout, guarda los puntos y abre el modal de "Gracias"
  const handlePurchaseSuccess = (points: number) => {
    setPointsEarned(points);
    setShowCheckout(false);
    setShowThankYou(true);
  };

  return (
    <>
      {/* Componente que hace scroll al top al cambiar de página */}
      <ScrollToTop />

      {/* 5. Renderizar el Navbar y pasarle las funciones que necesita */}
      <Navbar 
        onLoginClick={() => setShowAuth(true)} 
        onCartClick={() => setShowCart(true)} 
      />

      {/* 6. Renderizar el contenido de la página actual */}
      <main>
        <Outlet />
      </main>

      {/* 7. Renderizar el Footer */}
      <Footer />

      {/* 8. Renderizar todos los Modals y Offcanvas globales.
           Estarán ocultos por defecto hasta que su estado 'show' sea true.
      */}

      {/* Modal de Autenticación (Login/Registro) */}
      <AuthModal 
        show={showAuth} 
        onHide={() => setShowAuth(false)} 
      />

      {/* Offcanvas del Carrito de Compras */}
      <CartOffcanvas 
        show={showCart} 
        onHide={() => setShowCart(false)}
        onProceedToCheckout={handleProceedToCheckout} // Función para abrir el checkout
      />

      {/* Modal de Finalizar Compra */}
      <CheckoutModal
        show={showCheckout}
        onHide={() => setShowCheckout(false)}
        onPurchaseSuccess={handlePurchaseSuccess} // Función para abrir "Gracias"
      />

      {/* Modal de "Gracias por su compra" */}
      <ThankYouModal
        show={showThankYou}
        onHide={() => setShowThankYou(false)}
        pointsEarned={pointsEarned}
      />
    </>
  );
}