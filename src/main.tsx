import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext'; // Importa el .tsx
import App from './App'; // Importa el .tsx

// --- Importación de todos los archivos CSS ---

// 1. CSS de Librerías
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'leaflet/dist/leaflet.css';

// 2. Tus CSS personalizados
import './assets/style.css'; // Tu hoja de estilos principal
import './index.css';       // Archivo para estilos globales (ej. importar fuentes)

// Obtenemos el elemento 'root' del index.html
// La "!" al final le dice a TypeScript: "Confía en mí, este elemento existe"
const rootElement = document.getElementById('root')!;

// Renderizamos la aplicación
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* 1. El Router debe envolver todo para manejar las URLs */}
    <BrowserRouter>
      {/* 2. El ShopProvider envuelve la App para que
             cualquier componente pueda acceder al carrito, productos, etc. */}
      <ShopProvider>
        <App />
      </ShopProvider>
    </BrowserRouter>
  </React.StrictMode>
);