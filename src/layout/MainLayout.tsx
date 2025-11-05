import React from 'react';
import { Outlet } from 'react-router-dom';
import { useShop } from '../context/ShopContext'; // <-- 1. IMPORTAR useShop

// --- Componentes del Layout Estructural ---
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// --- Componentes de UI Global (Modals, Offcanvas, etc.) ---
import ScrollToTop from '../components/ui/ScrollToTop';
import AuthModal from '../components/auth/AuthModal';
import CartOffcanvas from '../components/cart/CartOffcanvas';
import CheckoutModal from '../components/cart/CheckoutModal';
import ReviewModal from '../components/product/ReviewModal';
import ThankYouModal from '../components/ui/ThankYouModal';
import GlobalToast from '../components/ui/GlobalToast';

export default function MainLayout() {
  // 2. OBTENER LAS FUNCIONES DEL CONTEXTO
  const { setShowCart, setShowAuth } = useShop();

  return (
    <>
      <ScrollToTop />
      
      {/* 3. PASAR LAS FUNCIONES COMO PROPS */}
      <Navbar 
        onCartClick={() => setShowCart(true)}
        onLoginClick={() => setShowAuth(true)}
      />

      <main>
        {/* Aquí se renderiza el contenido de la página actual (ej. Home.tsx) */}
        <Outlet />
      </main>

      {/* Pie de página (visible en todas las páginas) */}
      <Footer />

      {/* --- Modals y UI Globales --- */}
      {/* Estos ya leen el estado desde el contexto, así que están bien */}
      <AuthModal />
      <CartOffcanvas />
      <CheckoutModal />
      <ReviewModal />
      <ThankYouModal />
      
      {/* (Descomenta cuando creemos el componente de Toast) */}
      {/* <GlobalToast /> */}
    </>
  );
}