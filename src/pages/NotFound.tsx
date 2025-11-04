import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container my-5 text-center" style={{ color: 'white' }}>
      <h1 style={{ fontSize: '6rem' }}>404</h1>
      <h2 className="mb-3">Página No Encontrada</h2>
      <p className="lead mb-4">
        Lo sentimos, la página que buscas no existe o fue movida.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">
        Volver al Inicio
      </Link>
    </div>
  );
}