import React from 'react';
import ProductList from '../components/product/ProductList';

export default function Productos() {
  return (
    <div className="container my-5">
      {/* Vuelve a mostrar solo productos del context */}
      <ProductList title="Todos Nuestros Productos" />
    </div>
  );
}