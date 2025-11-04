// src/components/Navbar.tsx

import React from 'react';
import { Link, NavLink } from 'react-router-dom'; // Usamos NavLink para links activos
import { useShop } from '../context/ShopContext'; // Importamos nuestro hook global

// 1. Definimos las props que recibirá este componente
// Estas funciones las pasará MainLayout.tsx para controlar los modals
interface NavbarProps {
  onCartClick: () => void;
  onLoginClick: () => void;
}

export default function Navbar({ onCartClick, onLoginClick }: NavbarProps) {
  
  // 2. Obtenemos el estado global que necesitamos
  const { cart, user, handleLogout } = useShop();

  // 3. Calculamos el total de items en el carrito
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAuthClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenimos que el link <a> navegue
    if (user) {
      handleLogout(); // Si hay usuario, cerramos sesión
    } else {
      onLoginClick(); // Si no, abrimos el modal de login
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenimos que el link <a> navegue
    onCartClick(); // Abrimos el offcanvas del carrito
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        
        {/* Título y Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="/assets/img/logo.png" alt="HuertoHogar Logo" style={{ height: '40px', marginRight: '10px' }}/>
          <h2 className="navbar-title m-0" style={{ fontSize: '1.5rem', color: 'white' }}>
            <i className="bi bi-flower1 me-2"></i>
            Huerto Hogar
          </h2>
        </Link>
        
        {/* Botón Toggler para móvil */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Contenido Colapsable */}
        <div className="collapse navbar-collapse" id="navbarNav">
          
          {/* Links de Navegación */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/productos">Productos</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/nosotros">Nosotros</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/blog">Blog</NavLink>
            </li>
          </ul>
          
          {/* Formulario de Búsqueda (de tu HTML original) */}
          <form className="d-flex me-3">
            <input 
              className="form-control me-2" 
              type="search" 
              placeholder="Buscar productos" 
              aria-label="Search" 
              id="productSearch" 
            />
            <button className="btn btn-outline-light" type="submit">Buscar</button>
          </form>
          
          {/* Iconos de Usuario y Carrito */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={handleAuthClick}>
                {user ? `Hola, ${user.name} (Cerrar Sesión)` : 'Iniciar Sesión'}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link cart-icon" href="#" onClick={handleCartClick}>
                <i className="bi bi-cart"></i>
                <span className="cart-count" id="cartCount">{cartCount}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}