// src/data/constants.ts

/**
 * Funciones de Validación para Formularios
 */

// Comprueba si el string contiene solo letras y espacios (incluyendo acentos y ñ)
export const soloLetrasEspacios = (str: string): boolean => /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(str);

// Comprueba si el email pertenece al dominio @duoc.cl
export const isDuocMail = (str: string): boolean => /^[A-Za-z0-9-_.]+@duoc.cl$/.test(str);

// Comprueba si el teléfono es válido (o está vacío, ya que es opcional)
export const validPhone = (str: string): boolean => str === '' || /^[0-9+()-]{8,15}$/.test(str);

// Comprueba si la contraseña es fuerte
export const strongPassword = (password: string): boolean => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
};

/**
 * Datos Estáticos
 */

// Objeto de comunas para el formulario de registro
export const comunas = {
  "PA": "Puente Alto",
  "LF": "La Florida",
  "LP": "La Pintana",
  "ST": "Santiago"
};

// Coordenadas para el mapa en la sección "Nosotros"
// Usamos "as [number, number]" para decirle a TypeScript que es una tupla de números
export const locations = [
  { name: 'Santiago', coords: [-33.4489, -70.6693] as [number, number] },
  { name: 'Puerto Montt', coords: [-41.4718, -72.9369] as [number, number] },
  { name: 'Villarica', coords: [-39.2820, -72.2279] as [number, number] },
  { name: 'Nacimiento', coords: [-37.5026, -72.6762] as [number, number] },
  { name: 'Viña del Mar', coords: [-33.0245, -71.5518] as [number, number] },
  { name: 'Valparaíso', coords: [-33.0458, -71.6197] as [number, number] },
  { name: 'Concepción', coords: [-36.8270, -73.0503] as [number, number] }
];