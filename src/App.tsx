import { Routes, Route } from 'react-router-dom';

// 1. Importar la plantilla principal
import MainLayout from './layout/MainLayout';

// 2. Importar todas las páginas (vistas)
import Home from './pages/Home';
import Productos from './pages/Productos';
import Categorias from './pages/Categorias';
import Nosotros from './pages/Nosotros';
import Blog from './pages/Blog';
import NotFound from './pages/NotFound'; // Página para error 404

export default function App() {
  return (
    <Routes>
      {/* Definimos una "ruta padre" que usa MainLayout.
        Todas las rutas "hijas" que están dentro se renderizarán
        en el <Outlet /> de MainLayout.
      */}
      <Route path="/" element={<MainLayout />}>
        
        {/* La ruta raíz ("/") mostrará la página Home */}
        <Route index element={<Home />} />
        
        {/* Rutas para las otras páginas */}
        <Route path="productos" element={<Productos />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="blog" element={<Blog />} />

        {/* La ruta "*" (wildcard) atrapa cualquier URL que no coincida.
          Esto sirve para mostrar tu página de "Error 404 - No Encontrado".
        */}
        <Route path="*" element={<NotFound />} />

      </Route>
    </Routes>
  );
}