# 🥬 Huerto Hogar — Frontend Web App

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?style=flat&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Huerto Hogar Web** es la aplicación cliente para el e-commerce de productos agrícolas y de cultivo local. Construida como una Single Page Application (SPA) con **React**, **Vite** y **TypeScript**, la plataforma consume una API REST desarrollada en **Spring Boot** para la gestión de productos, autenticación de usuarios y procesamiento del carrito de compras.

---

## 🛠️ Arquitectura y Tecnologías

### Frontend Stack
* **Framework / Core:** React 18
* **Build Tool:** Vite (desarrollo rápido con HMR y bundling optimizado)
* **Lenguaje:** TypeScript / JavaScript (ES6+)
* **Testing:** Karma / Jasmine

### Integración Backend
* **Consumo de API:** Comunicación asíncrona conectando con la API REST de **Spring Boot**.
* **Manejo de Estado:** Gestión reactiva del estado local para el carrito de compras y la sesión de usuario.

---

## 🏗️ Estructura del Proyecto

* **`src/assets/`**: Recursos estáticos (imágenes, íconos, estilos globales).
* **`src/components/`**: Componentes UI reutilizables (Tarjetas, Botones, Navbar).
* **`src/services/`**: Módulos de conexión e integración con la API REST.
* **`src/pages/`**: Vistas principales (Home, Catálogo, Carrito, Login).
* **`src/App.tsx`**: Enrutamiento y componente raíz.
* **`src/main.tsx`**: Punto de entrada de React con Vite.

---

## ✨ Funcionalidades Clave

* 🛍️ **Catálogo de Productos:** Navegación y filtrado dinámico consumiendo el backend.
* 🛒 **Carrito de Compras:** Gestión reactiva de agregados, cantidades y totales.
* 🔗 **Integración REST:** Desacoplamiento completo entre la capa de presentación y la lógica de negocio en Spring Boot.
* 📱 **Diseño Adaptativo:** Interfaz responsiva pensada para uso en escritorio y móviles.

---

## 🚀 Instalación y Ejecución Local

### Requisitos Previos
* Node.js (v18.x o superior)
* Gestor de paquetes `npm`
* Instancia en ejecución del servidor backend (`huerto-hogar-backend` / Spring Boot).

### Pasos
1. **Clonar el repositorio:**
   `git clone https://github.com/tu-usuario/huerto-hogar-frontend.git`
   `cd huerto-hogar-frontend`

2. **Instalar dependencias:**
   `npm install`

3. **Iniciar el servidor de desarrollo:**
   `npm run dev`
   *(La aplicación estará disponible en `http://localhost:5173`)*

---

## 👥 Colaboradores

* **Bruno Valenzuela** — *Frontend Developer* — [GitHub](https://github.com/tu-usuario) | [LinkedIn](https://linkedin.com/in/tu-perfil)
* **Rodrigo** — *Co-Developer*

---

## 📄 Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE).
