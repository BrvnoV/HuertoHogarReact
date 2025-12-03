import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';

// Importa todas las páginas que hemos creado
import Productos from './pages/Productos';
import Categorias from './pages/Categorias';
import Nosotros from './pages/Nosotros';
import Blog from './pages/Blog';
import NotFound from './pages/NotFound';

// Nuevas importaciones para rutas protegidas y auth
import PrivateRoute from './components/auth/PrivateRoute';  // El guard que creamos
import LoginForm from './components/auth/LoginForm';  // Tu formulario de login (ajusta path si es modal)
import AdminDashboard from './pages/AdminDashboard';  // Crea esta página para /admin (CRUD productos)

// Si tienes RegisterForm como página separada, impórtala; sino, úsala en modal
// import RegisterForm from './components/auth/RegisterForm';

export default function App() {
  return (
    <Routes>
      {/* Ruta pública para login (fuera de MainLayout, ya que no necesita navbar si es modal/fullscreen) */}
      <Route path="/login" element={
        <LoginForm 
          onSwitchToRegister={() => {
            // Lógica para switch a register (ej. navega a /register o abre modal)
            // Si tienes ruta /register, usa: window.location.href = '/register';
            // O si es modal, maneja estado global
            console.log('Switch to register');
          }} 
        />
      } />

      {/* Ruta para forbidden (403) */}
      <Route path="/forbidden" element={
        <MainLayout>
          <h1>403 - Acceso Denegado</h1>
          <p>No tienes permisos para esta página. <a href="/productos">Volver a productos</a></p>
        </MainLayout>
      } />

      {/* Grupo de rutas que usan el MainLayout (Navbar + Footer) – protegidas */}
      <Route path="/" element={<MainLayout />}>
        {/* Ruta raíz (home) – protegida para usuarios logueados */}
        <Route index element={
          <PrivateRoute requiredRole="USUARIO">
            <Home />
          </PrivateRoute>
        } />
        
        {/* Rutas de las otras páginas – protegidas */}
        <Route path="productos" element={
          <PrivateRoute requiredRole="USUARIO">
            <Productos />
          </PrivateRoute>
        } />
        <Route path="categorias" element={
          <PrivateRoute requiredRole="USUARIO">
            <Categorias />
          </PrivateRoute>
        } />
        <Route path="nosotros" element={
          <PrivateRoute requiredRole="USUARIO">
            <Nosotros />
          </PrivateRoute>
        } />
        <Route path="blog" element={
          <PrivateRoute requiredRole="USUARIO">
            <Blog />
          </PrivateRoute>
        } />
        
        {/* Ruta admin – solo para ADMIN */}
        <Route path="admin" element={
          <PrivateRoute requiredRole="ADMIN">
            <AdminDashboard />
          </PrivateRoute>
        } />
        
        {/* Ruta "catch-all" para páginas 404 */}
        <Route path="*" element={<NotFound />} />
        
      </Route>
    </Routes>
  );
}