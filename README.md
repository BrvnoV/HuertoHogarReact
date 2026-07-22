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
- **Framework / Core:** React 18
- **Build Tool:** Vite (desarrollo rápido con HMR y bundling optimizado)
- **Lenguaje:** TypeScript / JavaScript (ES6+)
- **Testing:** Karma / Jasmine

### Integración Backend
- **Consumo de API:** Comunicación asíncrona (Fetch / Axios) conectando con el backend **Spring Boot REST API**.
- **Manejo de Estado:** Gestión reactiva del estado local para el carrito de compras y la sesión de usuario.

---

## 🏗️ Estructura del Proyecto

```text
src/
├── assets/          # Recursos estáticos (imágenes, íconos, estilos globales)
├── components/      # Componentes UI reutilizables (Tarjetas, Botones, Navbar)
├── services/        # Módulos de conexión e integración con la API REST
├── pages/           # Vistas principales (Home, Catálogo, Carrito, Login)
├── App.tsx          # Enrutamiento y componente raíz
└── main.tsx         # Punto de entrada de React con Vite
