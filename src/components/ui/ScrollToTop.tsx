import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  // Obtiene la ubicación actual de la URL
  const { pathname } = useLocation();

  // Este "hook" de efecto se ejecuta CADA VEZ que el 'pathname' cambia
  useEffect(() => {
    // Manda la ventana a la posición (0, 0)
    window.scrollTo(0, 0);
  }, [pathname]); // El efecto depende del 'pathname'

  // Este componente no renderiza nada en el HTML
  return null;
}