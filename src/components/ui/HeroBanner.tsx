import React from 'react';
import { Carousel } from 'react-bootstrap';

export default function HeroBanner() {
  return (
    <Carousel id="bannerCarousel" fade>
      <Carousel.Item>
        {/*
          Usamos la ruta "/assets/..." porque la carpeta 'public'
          se sirve desde la raíz (/) del servidor.
        */}
        <img
          className="d-block w-100"
          src="/assets/img/fruit.png"
          alt="Oferta Frutas"
          style={{ height: '800px', objectFit: 'cover' }} // Estilo en línea para el alto
        />
        {/* Opcional: Puedes añadir un <Carousel.Caption> si quieres */}
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/assets/img/bowl.png"
          alt="Oferta Verduras"
          style={{ height: '800px', objectFit: 'cover' }} // Estilo en línea para el alto
        />
      </Carousel.Item>
    </Carousel>
  );
}