import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';

// Importa todas las páginas que hemos creado
import Productos from './pages/Productos';
import Categorias from './pages/Categorias';
import Nosotros from './pages/Nosotros';
import Blog from './pages/Blog';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      {/* Grupo de rutas que usan el MainLayout (Navbar + Footer) */}
      <Route path="/" element={<MainLayout />}>
        
        {/* Ruta raíz (la página de inicio) */}
        <Route index element={<Home />} />
        
        {/* Rutas de las otras páginas */}
        <Route path="productos" element={<Productos />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="blog" element={<Blog />} />
        
        {/* Ruta "catch-all" para páginas 404 */}
        <Route path="*" element={<NotFound />} />
        
      </Route>
    </Routes>
  );
}