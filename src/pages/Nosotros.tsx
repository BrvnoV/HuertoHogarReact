import React from 'react';
import About from '../components/About';

export default function Nosotros() {
  return (
    <div className="container my-5">
      {/* El componente About ya contiene el texto
        y el mapa de Leaflet.
      */}
      <About />
    </div>
  );
}