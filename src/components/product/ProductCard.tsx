import React from 'react';
import { Product } from '../../data/products'; // Importamos el tipo de dato
import { useShop } from '../../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  
  // Obtenemos todo lo que necesitamos del contexto global
  const { 
    reviews, 
    handleAddToCart,
    // ATENCIÓN: Necesitarás añadir estos al ShopContext (ver nota abajo)
    setCurrentProductId, 
    setShowReviewModal 
  } = useShop();

  // Lógica de tu script.js para calcular la valoración promedio
  const productReviews = reviews[product.id] || [];
  const avgRating = productReviews.length 
    ? (productReviews.reduce((sum: number, r: any) => sum + parseInt(r.rating), 0) / productReviews.length).toFixed(1) 
    : 'N/A';

  // Handler para el botón de reseña
  const handleReviewClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir que el <a> navegue
    setCurrentProductId(product.id);
    setShowReviewModal(true);
  };

  return (
    <div className="col-md-4 mb-4 d-flex">
      <div className="card product-card h-100">
        <img src={product.image} className="card-img-top product-card-img" alt={product.name} />
        <div className="card-body d-flex flex-column text-dark"> {/* Añadido 'text-dark' para legibilidad */}
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description}</p>
          
          <p className="card-text">${product.price} CLP / Stock: {product.stock}</p>
          
          <div className="star-rating mb-2">
            {avgRating} <i className="bi bi-star-fill"></i> ({productReviews.length} reseñas)
          </div>
          
          <div className="mt-auto">
            <button 
              className="btn btn-primary mb-2 w-100" 
              onClick={() => handleAddToCart(product.id)}
              disabled={product.stock <= 0} // Se deshabilita si no hay stock
            >
              {product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
            </button>
            <button 
              className="btn btn-secondary w-100" 
              onClick={handleReviewClick}
            >
              Dejar Reseña
            </button>
          </div>

          <div className="product-reviews mt-3">
            {productReviews.slice(0, 3).map((r: any, index: number) => (
              <div key={index} className="review-item">
                {r.rating} <i className="bi bi-star-fill"></i>: {r.comment}
              </div>
            ))}
            {productReviews.length > 3 && (
              <a href="#" onClick={handleReviewClick}>
                Ver todas las reseñas
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}