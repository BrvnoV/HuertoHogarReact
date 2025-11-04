import React from 'react';

// Importamos los componentes reutilizables que forman la página de inicio
import HeroBanner from '../components/ui/HeroBanner';
import Categories from '../components/Categories';
import ProductList from '../components/product/ProductList';
import Impact from '../components/Impact';
import About from '../components/About';
import Blog from '../components/Blog';

export default function Home() {
  return (
    <>
      {/* 1. Carrusel de bienvenida */}
      <HeroBanner />
      
      {/* 2. Tarjetas de Categorías */}
      <Categories />

      {/* 3. Lista de productos destacados (le pasamos un título y un límite) */}
      <ProductList 
        title="Productos Destacados" 
        limit={6} // Mostramos solo 6 productos en la página de inicio
      />

      {/* 4. Sección de Impacto Ambiental */}
      <Impact />

      {/* 5. Sección "Nosotros" con el mapa */}
      <About />

      {/* 6. Sección de Blog (con un límite de 2 posts) */}
      <Blog 
        title="Blog: Alimentación Saludable"
        limit={2} 
      />
    </>
  );
}