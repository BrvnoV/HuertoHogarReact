import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialProducts, Product } from '../data/products';

// --- 1. DEFINICIÓN DE TIPOS (TYPESCRIPT) ---

// Tipo para un item dentro del carrito (un producto + cantidad)
interface CartItem extends Product {
  quantity: number;
}

// Tipo para un usuario logueado (simple)
interface User {
  name: string;
  email: string;
}

// Tipo para una reseña individual
interface Review {
  rating: string;
  comment: string;
}

// Tipo para el objeto de reseñas (la clave es el ID del producto)
interface ReviewsState {
  [productId: string]: Review[];
}

// Tipo para los datos del formulario de checkout
interface CheckoutData {
  address: string;
  contact: string;
  deliveryDate: string;
}

// Tipo para el estado de las notificaciones (Toast)
interface ToastState {
  message: string;
  variant: 'success' | 'error' | 'info';
  show: boolean;
}

// Tipo para TODO lo que nuestro contexto va a "proveer"
interface ShopContextType {
  // Estado de Productos
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;

  // Estado del Carrito
  cart: CartItem[];
  handleAddToCart: (productId: string) => void;
  handleUpdateQuantity: (productId: string, newQuantity: number) => void;
  handleRemoveFromCart: (productId: string) => void;

  // Estado de Usuario y Puntos
  user: User | null;
  userPoints: number;
  handleLogin: (email: string, pass: string) => boolean;
  handleRegister: (formData: any) => boolean; // `any` para simplificar, puedes crear un tipo
  handleLogout: () => void;

  // Estado de Reseñas y Compras
  reviews: ReviewsState;
  handleSubmitReview: (productId: string, rating: string, comment: string) => void;
  handleConfirmPurchase: (checkoutData: CheckoutData, pointsToRedeem: number) => number; // Devuelve puntos ganados

  // Estado para Modals (Reseña)
  currentProductId: string | null;
  setCurrentProductId: React.Dispatch<React.SetStateAction<string | null>>;
  showReviewModal: boolean;
  setShowReviewModal: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Estado para Modals (Carrito y Compra)
  showCart: boolean;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  showCheckout: boolean;
  setShowCheckout: React.Dispatch<React.SetStateAction<boolean>>;
  showThankYou: boolean;
  setShowThankYou: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Estado para Modals (Autenticación)
  showAuth: boolean;
  setShowAuth: React.Dispatch<React.SetStateAction<boolean>>;

  // Estado para Puntos (en tránsito durante la compra)
  pointsToRedeem: number;
  setPointsToRedeem: React.Dispatch<React.SetStateAction<number>>;
  pointsEarned: number;
  setPointsEarned: React.Dispatch<React.SetStateAction<number>>;

  // Estado de Notificaciones
  toast: ToastState;
  showToast: (message: string, variant: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

// --- 2. CREACIÓN DEL CONTEXTO ---
const ShopContext = createContext<ShopContextType | undefined>(undefined);

// --- 3. CREACIÓN DEL "PROVEEDOR" ---
// Este componente envolverá toda tu aplicación
export const ShopProvider = ({ children }: { children: ReactNode }) => {
  
  // --- Estados Globales ---
  const [products, setProducts] = useLocalStorage<Product[]>('products', initialProducts);
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [userPoints, setUserPoints] = useLocalStorage<number>('userPoints', 0);
  const [reviews, setReviews] = useLocalStorage<ReviewsState>('reviews', {});
  const [toast, setToast] = useState<ToastState>({ message: '', variant: 'info', show: false });

  // Estados para controlar los Modals
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // Estados para el flujo de puntos en el checkout
  const [pointsToRedeem, setPointsToRedeem] = useState(0); 
  const [pointsEarned, setPointsEarned] = useState(0);

  // --- Funciones de Notificaciones (Toast) ---
  const showToast = (message: string, variant: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, variant, show: true });
    // Oculta el toast después de 3 segundos
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const hideToast = () => setToast(prev => ({ ...prev, show: false }));

  // --- Funciones de Carrito (Cart) ---
  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (product.stock <= 0) {
      showToast('Producto sin stock', 'error');
      return;
    }

    // 1. Reducir el stock en la lista principal de productos
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, stock: p.stock - 1 } : p
      )
    );

    // 2. Añadir al carrito
    setCart(prevCart => {
      const cartItem = prevCart.find(item => item.id === productId);
      if (cartItem) {
        // Si ya existe, aumenta la cantidad
        return prevCart.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Si es nuevo, lo añade con cantidad 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    showToast(`${product.name} añadido al carrito`, 'success');
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }

    const cartItem = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    if (!cartItem || !product) return;

    const quantityChange = newQuantity - cartItem.quantity;
    
    // Verificamos si hay stock suficiente para AÑADIR más
    if (quantityChange > 0 && product.stock < quantityChange) {
      showToast(`Stock insuficiente. Solo quedan ${product.stock} unidades.`, 'error');
      return;
    }

    // 1. Actualizar stock en la lista de productos
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, stock: p.stock - quantityChange } : p
      )
    );

    // 2. Actualizar cantidad en el carrito
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;

    // 1. Devolver el stock a la lista principal
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, stock: p.stock + cartItem.quantity } : p
      )
    );

    // 2. Eliminar del carrito
    setCart(prevCart => prevCart.filter(item => item.id !== productId));

    showToast('Producto eliminado del carrito', 'info');
  };

  // --- Funciones de Autenticación (Auth) ---
  const handleLogin = (email: string, pass: string): boolean => {
    // --- SIMULACIÓN DE LOGIN ---
    // En un proyecto real, esto sería una llamada a tu backend
    if (email === 'alumno@duoc.cl' && pass === 'Duoc1234*') {
      setUser({ name: 'Alumno Duoc', email: email });
      showToast('Inicio de sesión exitoso', 'success');
      return true; // Éxito
    }
    showToast('Email o contraseña incorrectos', 'error');
    return false; // Fracaso
  };

  const handleRegister = (formData: any): boolean => {
    // --- SIMULACIÓN DE REGISTRO ---
    // En un proyecto real, esto enviaría formData a tu backend
    console.log('Datos de registro:', formData);
    showToast('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
    return true; // Éxito
    // Tu lógica original no iniciaba sesión, solo mostraba el formulario de login.
  };

  const handleLogout = () => {
    setUser(null);
    showToast('Sesión cerrada', 'info');
  };

  // --- Funciones de Reseñas y Compras ---
  const handleSubmitReview = (productId: string, rating: string, comment: string) => {
    if (!rating || !comment) {
      showToast('Por favor, completa todos los campos', 'error');
      return;
    }
    
    setReviews(prevReviews => {
      const productReviews = prevReviews[productId] || [];
      return {
        ...prevReviews,
        [productId]: [...productReviews, { rating, comment }],
      };
    });
    
    setShowReviewModal(false); // Cierra el modal al enviar
    showToast('Reseña enviada con éxito', 'success');
  };

  const handleConfirmPurchase = (checkoutData: CheckoutData, pointsToRedeem: number): number => {
    // 1. Calcular total y puntos
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const pointsEarned = Math.floor(total / 100);

    // 2. Actualizar puntos del usuario
    setUserPoints(prevPoints => prevPoints + pointsEarned - pointsToRedeem);

    // 3. Vaciar el carrito
    setCart([]);

    // 4. Mostrar toast
    showToast('¡Compra confirmada! Gracias.', 'success');
    
    // 5. Devolver puntos ganados para que el modal "ThankYou" los muestre
    return pointsEarned;
  };

  // --- 4. EXPORTAR VALORES ---
  // Todos los estados y funciones que queremos que sean "globales"
  const value = {
    products,
    setProducts,
    cart,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveFromCart,
    user,
    userPoints,
    handleLogin,
    handleRegister,
    handleLogout,
    reviews,
    handleSubmitReview,
    handleConfirmPurchase,
    
    // Modals y sus controladores
    currentProductId,
    setCurrentProductId,
    showReviewModal,
    setShowReviewModal,
    showCart,
    setShowCart,
    showCheckout,
    setShowCheckout,
    showThankYou,
    setShowThankYou,
    showAuth,
    setShowAuth,
    
    // Puntos en tránsito
    pointsToRedeem,
    setPointsToRedeem,
    pointsEarned,
    setPointsEarned,
    
    // Toast
    toast,
    showToast,
    hideToast,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

// --- 5. HOOK PERSONALIZADO ---
// Un "atajo" para no tener que importar useContext y ShopContext en cada componente
export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop debe ser usado dentro de un ShopProvider');
  }
  return context;
};