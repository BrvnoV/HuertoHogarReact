import React from 'react';

// 1. Importa todos los componentes "sección" que forman parte del Home.
// (Es normal que te den error de "Cannot find module" si aún no los has creado)
import HeroBanner from '../components/ui/HeroBanner';
import Categories from '../components/Categories';
import ProductList from '../components/product/ProductList';
import Impact from '../components/Impact';
import About from '../components/About';
import Blog from '../components/Blog';

// 2. Este es el componente de la página de inicio (ruta "/")
export default function Home() {
  return (
    <>
      {/* 3. Renderiza cada componente en el orden en que
             aparecían en tu HTML original. */}
      
      {/* Carrusel de Banners */}
      <HeroBanner />

      {/* Sección de Categorías */}
      <Categories />

      {/* Sección de Productos Destacados (con filtros) */}
      <ProductList />

      {/* Sección de Impacto Ambiental */}
      <Impact />

      {/* Sección "Nosotros" (con el mapa) */}
      <About />

      {/* Sección del Blog */}
      <Blog />
    </>
  );
}