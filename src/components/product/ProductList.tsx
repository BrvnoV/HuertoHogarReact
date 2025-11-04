import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import ProductCard from './ProductCard'; // Importamos la tarjeta individual

interface ProductListProps {
  title: string;       // Título de la sección (ej. "Productos Destacados")
  limit?: number;      // Límite opcional de productos a mostrar
}

export default function ProductList({ title, limit }: ProductListProps) {
  // 1. Obtenemos los productos del contexto global
  const { products } = useShop();

  // 2. Estados locales para manejar los filtros
  const [category, setCategory] = useState(''); // '' = Todas
  const [sort, setSort] = useState('price-asc'); // Valor por defecto

  // 3. Lógica de filtrado y ordenamiento
  const getFilteredAndSortedProducts = () => {
    let filteredProducts = [...products];

    // Primero filtramos por categoría
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // Luego ordenamos
    switch (sort) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - b.price);
        break;
      case 'popularity':
        // Mantenemos tu lógica de popularidad aleatoria
        filteredProducts.sort(() => Math.random() - 0.5);
        break;
      default:
        filteredProducts.sort((a, b) => a.price - b.price);
    }
    
    // Finalmente, aplicamos el límite si existe
    if (limit) {
      return filteredProducts.slice(0, limit);
    }
    
    return filteredProducts;
  };

  const displayedProducts = getFilteredAndSortedProducts();

  return (
    <section id="products" className="container my-5">
      <h2 className="text-center mb-4" style={{ color: 'white' }}>{title}</h2>
      
      {/* --- Controles de Filtro --- */}
      {/* Solo mostramos los filtros si no hay límite (es decir, en la pág. de Productos) */}
      {!limit && (
        <div className="row mb-3">
          <div className="col-md-6">
            <select 
              className="form-select" 
              id="categoryFilter"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Todas las Categorías</option>
              <option value="Frutas">Frutas Frescas</option>
              <option value="Verduras">Verduras Orgánicas</option>
              <option value="Orgánicos">Productos Orgánicos</option>
              <option value="Lácteos">Productos Lácteos</option>
            </select>
          </div>
          <div className="col-md-6">
            <select 
              className="form-select" 
              id="sortFilter"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="popularity">Popularidad</option>
            </select>
          </div>
        </div>
      )}

      {/* --- Grid de Productos --- */}
      <div className="row" id="productGrid">
        {displayedProducts.length > 0 ? (
          displayedProducts.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
            />
          ))
        ) : (
          <p className="text-center" style={{ color: 'white' }}>
            No se encontraron productos con esos filtros.
          </p>
        )}
      </div>
    </section>
  );
}