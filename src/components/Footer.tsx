import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3">
      <div className="container">
        <p>&copy; 2025 HuertoHogar. Todos los derechos reservados.</p>
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" className="text-white me-3">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="https://instagram.com" target="_blank" className="text-white me-3">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="https://tiktok.com" target="_blank" className="text-white">
            <i className="bi bi-tiktok"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}