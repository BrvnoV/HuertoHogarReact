import React from 'react';
import { Outlet } from 'react-router-dom';

// --- Componentes del Layout ---
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// --- Modals y UI Globales ---
// Importamos todos los modals que vivirán "encima" de la aplicación.
// Comentaremos los que aún no hemos creado para que no te dé error.

import ReviewModal from '../components/product/ReviewModal';
import CartOffcanvas from '../components/cart/CartOffcanvas';
import AuthModal from '../components/auth/AuthModal';
import CheckoutModal from '../components/cart/CheckoutModal';
import ThankYouModal from '../components/ui/ThankYouModal';
import GlobalToast from '../components/ui/GlobalToast'; // Para las notificaciones

export default function MainLayout() {
  return (
    <>
      {/* La barra de navegación es persistente en todas las páginas */}
      <Navbar />

      <main>
        {/* <Outlet /> es el marcador de posición donde React Router 
          renderizará el componente de la página actual.
        */}
        <Outlet />
      </main>

      {/* El pie de página es persistente en todas las páginas */}
      <Footer />

      {/* --- Global Modals & Notifications --- */}
      {/* Renderizamos todos los modals aquí.
        No importa que estén "fuera" del main, ya que usan
        posicionamiento "fixed" o "absolute".
        
        Ellos mismos saben cuándo mostrarse u ocultarse 
        leyendo el estado directamente desde nuestro useShop() context.
      */}
      
      <ReviewModal />
      
      {/* (Descomenta estos componentes a medida que los vayas creando) */}
      {<CartOffcanvas />}
      {<AuthModal />}
      {<CheckoutModal />}
      {<ThankYouModal />}
      {<GlobalToast />}
    </>
  );
}