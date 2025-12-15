import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import ProductCard from './ProductCard';

interface ProductListProps {
  title: string;
  limit?: number;
}

export default function ProductList({ title, limit }: ProductListProps) {
  const { products: productos, categories: categorias, loading } = useShop();
  const location = useLocation();

  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('price-asc');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get('category');
    if (catParam) {
      setCategory(catParam);
    }
  }, [location.search]);

  const getFilteredAndSortedProducts = () => {
    let filteredProducts = [...productos];

    if (category) {
      // Comparison using category name from object
      filteredProducts = filteredProducts.filter(p => p.category.nombre === category);
    }

    switch (sort) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        filteredProducts.sort(() => Math.random() - 0.5);
        break;
      default:
        filteredProducts.sort((a, b) => a.price - b.price);
    }

    if (limit) {
      return filteredProducts.slice(0, limit);
    }

    return filteredProducts;
  };

  const displayedProducts = getFilteredAndSortedProducts();

  if (loading) {
    return (
      <section className="container my-5">
        <h2 className="text-center mb-4" style={{ color: 'white' }}>{title}</h2>
        <p className="text-center" style={{ color: 'white' }}>Cargando productos...</p>
      </section>
    );
  }

  return (
    <section id="products" className="container my-5">
      <h2 className="text-center mb-4" style={{ color: 'white' }}>{title}</h2>

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
              {categorias.map(cat => (
                <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
              ))}
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

      <div className="row mb-3 justify-content-center align-items-center" id="productGrid">
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