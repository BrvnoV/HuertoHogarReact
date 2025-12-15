// Definición de Tipos Centralizada

export interface Category {
    id: number;
    nombre: string;
    descripcion?: string;
    imagen?: string;
}

export interface Product {
    id: string | number; // Adaptar según backend (UUID o Long)
    name: string;
    price: number;
    category: Category; // Composición: Objeto completo
    stock: number;
    image: string;
    description: string;
    origin?: string;
    sustainability?: string;
    recipe?: string;
    recommendations?: string[]; // IDs de otros productos
}

export interface User {
    id?: number;
    name: string;
    email: string;
    role?: 'ADMIN' | 'USUARIO';
    password?: string; // Solo para formularios, no guardar en estado global si es posible
}

// Tipos auxiliares para el Contexto
export interface CartItem extends Product {
    quantity: number;
}
