import React from 'react';
import { Product } from '../../data/products';
import { useShop } from '../../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    reviews,
    handleAddToCart,
    setCurrentProductId,
    setShowReviewModal,
  } = useShop();

  const productReviews = reviews[product.id] || [];
  const avgRating = productReviews.length
    ? (
        productReviews.reduce((sum: number, r: any) => sum + parseInt(r.rating), 0) /
        productReviews.length
      ).toFixed(1)
    : 'N/A';

  const handleReviewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentProductId(product.id);
    setShowReviewModal(true);
  };

  return (
    <div className="col-md-3 d-flex justify-content-center align-items-center mb-4">
  
      <div className="card product-card h-100 w-100">
        <img
          src={product.image}
          className="product-card-img"
          alt={product.name}
        />
        <div className="card-body d-flex flex-column text-dark">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description}</p>
          <p className="card-text">
            ${product.price} CLP / Stock: {product.stock}
          </p>

          <div className="star-rating mb-2">
            {avgRating} <i className="bi bi-star-fill"></i> ({productReviews.length} reseñas)
          </div>

          <div className="mt-auto">
            <button
              className="btn btn-primary mb-2 w-100"
              onClick={() => handleAddToCart(product.id)}
              disabled={product.stock <= 0}
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

          {productReviews.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
}
