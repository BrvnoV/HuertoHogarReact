import React from 'react';
import ProductList from '../components/product/ProductList';

export default function Productos() {
  return (
    <div className="container my-5">
      {/* Mostramos el componente ProductList.
        Este componente ya contiene los filtros y la lógica
        para mostrar todos los productos.
      */}
      <ProductList title="Todos Nuestros Productos" />
    </div>
  );
}