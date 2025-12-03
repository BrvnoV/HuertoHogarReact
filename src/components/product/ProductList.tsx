import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../data/products';  // Solo Product por ahora
import ProductCard from './ProductCard';

// Inline temporal para Category
interface Category {
  id: number;
  name: string;
}

interface ProductListProps {
  title: string;
  limit?: number;
}

export default function ProductList({ title, limit }: ProductListProps) {
  const { setProducts } = useShop();

  const [productos, setProductos] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('price-asc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          api.get('/api/productos'),
          api.get('/api/categorias')
        ]);
        const fetchedProductos: Product[] = prodRes.data;
        setProductos(fetchedProductos);
        if (setProducts) setProducts(fetchedProductos);
        setCategorias(catRes.data as Category[]);
      } catch (err) {
        console.error('Error fetch:', err);
        setError('Error cargando productos. ¿Backend corriendo?');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getFilteredAndSortedProducts = () => {
    let filteredProducts = [...productos];

    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);  // Ajusta field
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

  if (error) {
    return (
      <section className="container my-5">
        <h2 className="text-center mb-4" style={{ color: 'white' }}>{title}</h2>
        <p className="text-center text-red-500">{error}</p>
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
                <option key={cat.id} value={cat.name}>{cat.name}</option>
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