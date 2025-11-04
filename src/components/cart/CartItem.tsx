import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../data/products'; // Asumiendo que exportaste el tipo

// El item del carrito es un Producto con una propiedad 'quantity'
interface CartItemProps {
  item: Product & { quantity: number };
}

export default function CartItem({ item }: CartItemProps) {
  // Obtenemos las funciones de manipulación del carrito desde el contexto
  const { handleUpdateQuantity, handleRemoveFromCart } = useShop();

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h6>{item.name}</h6>
        <p className="mb-1">${item.price} CLP x {item.quantity}</p>
        <div className="d-flex">
          {/* Botón para restar */}
          <button 
            className="btn btn-sm btn-outline-secondary" 
            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
          >
            -
          </button>
          
          <span className="mx-2">{item.quantity}</span>

          {/* Botón para sumar */}
          <button 
            className="btn btn-sm btn-outline-secondary" 
            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
      </div>
      
      {/* Botón para eliminar */}
      <button 
        className="btn btn-sm btn-danger" 
        title="Eliminar producto"
        onClick={() => handleRemoveFromCart(item.id)}
      >
        <i className="bi bi-trash"></i>
      </button>
    </div>
  );
}