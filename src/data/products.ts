import { Product } from '../types';

// Re-exportamos para compatibilidad mientras refactorizamos
export type { Product };

// Exportamos tu lista de productos. 
// Fíjate que las rutas de las imágenes ahora apuntan a /public/
export const initialProducts: Product[] = [

    {
        id: 'FR001',
        name: 'Manzanas Fuji',
        price: 1200,
        category: { id: 1, nombre: 'Frutas' },
        stock: 150,
        image: 'assets/img/apple.jpg',
        description: 'Manzanas crujientes del Valle del Maule.',
        origin: 'Valle del Maule, Chile',
        sustainability: 'Cultivadas con prácticas de agricultura sostenible.',
        recipe: 'Prueba nuestra receta de tarta de manzana casera.',
        recommendations: ['FR002', 'VR001']
    },
    {
        id: 'FR002',
        name: 'Naranjas Valencia',
        price: 1000,
        category: { id: 1, nombre: 'Frutas' },
        stock: 200,
        image: 'assets/img/orange.jpg',
        description: 'Jugosas y ricas en vitamina C.',
        origin: 'Región de Valparaíso, Chile',
        sustainability: 'Sin pesticidas, certificación orgánica.',
        recipe: 'Prepara un jugo fresco o una ensalada cítrica.',
        recommendations: ['FR001', 'VR002']
    },
    {
        id: 'FR003',
        name: 'Plátanos Cavendish',
        price: 800,
        category: { id: 1, nombre: 'Frutas' },
        stock: 180,
        image: 'assets/img/platano.jpg',
        description: 'Plátanos dulces y cremosos.',
        origin: 'Región de Coquimbo, Chile',
        sustainability: 'Cultivados con riego eficiente.',
        recipe: 'Ideal para batidos o pan de plátano.',
        recommendations: ['FR001', 'PO001']
    },
    {
        id: 'VR001',
        name: 'Zanahorias Orgánicas',
        price: 900,
        category: { id: 2, nombre: 'Verduras' },
        stock: 100,
        image: 'assets/img/carrot.jpg',
        description: 'Crujientes y sin pesticidas.',
        origin: 'Región Metropolitana, Chile',
        sustainability: 'Certificación orgánica, sin químicos.',
        recipe: 'Perfectas para sopas o ensaladas crujientes.',
        recommendations: ['VR002', 'VR003']
    },
    {
        id: 'VR002',
        name: 'Espinacas Frescas',
        price: 1100,
        category: { id: 2, nombre: 'Verduras' },
        stock: 120,
        image: 'assets/img/spinach.jpeg',
        description: 'Hojas frescas y llenas de nutrientes.',
        origin: 'Región de O’Higgins, Chile',
        sustainability: 'Cultivo hidropónico sostenible.',
        recipe: 'Úsalas en batidos verdes o salteados.',
        recommendations: ['VR001', 'PO001']
    },
    {
        id: 'VR003',
        name: 'Pimientos Tricolores',
        price: 1500,
        category: { id: 2, nombre: 'Verduras' },
        stock: 80,
        image: 'assets/img/pimiento.jpeg',
        description: 'Pimientos rojos, verdes y amarillos vibrantes.',
        origin: 'Región de La Araucanía, Chile',
        sustainability: 'Cultivados con fertilizantes naturales.',
        recipe: 'Prueba asarlos para una ensalada colorida.',
        recommendations: ['VR001', 'FR002']
    },
    {
        id: 'PO001',
        name: 'Miel Orgánica',
        price: 5000,
        category: { id: 3, nombre: 'Orgánicos' },
        stock: 50,
        image: 'assets/img/honey.jpg',
        description: 'Miel pura de apicultores locales.',
        origin: 'Región de Los Lagos, Chile',
        sustainability: 'Producida con prácticas apícolas sostenibles.',
        recipe: 'Ideal para endulzar té o postres.',
        recommendations: ['FR003', 'PL001']
    },
    {
        id: 'PO003',
        name: 'Quinua Orgánica',
        price: 3500,
        category: { id: 3, nombre: 'Orgánicos' },
        stock: 70,
        image: 'assets/img/quinoa.jpeg',
        description: 'Quinua rica en proteínas y nutrientes.',
        origin: 'Región de Atacama, Chile',
        sustainability: 'Certificación orgánica, cultivo sostenible.',
        recipe: 'Perfecta para ensaladas o platos principales.',
        recommendations: ['VR002', 'VR003']
    },
    {
        id: 'PL001',
        name: 'Leche Entera',
        price: 1200,
        category: { id: 4, nombre: 'Lácteos' },
        stock: 100,
        image: 'assets/img/milk.jpg',
        description: 'Leche fresca de granjas locales.',
        origin: 'Región de Los Ríos, Chile',
        sustainability: 'Producida en granjas éticas.',
        recipe: 'Úsala en batidos o para preparar flan.',
        recommendations: ['PO001', 'FR003']
    },
    {
        id: 'PL002',
        name: 'Yogurt Natural',
        price: 1800,
        category: { id: 4, nombre: 'Lácteos' },
        stock: 90,
        image: 'assets/img/yogurt.jpg',
        description: 'Yogurt cremoso sin azúcar añadido.',
        origin: 'Región de Los Ríos, Chile',
        sustainability: 'Elaborado con leche de vacas alimentadas con pasto natural.',
        recipe: 'Ideal para desayunos con frutas o granola.',
        recommendations: ['PL001', 'FR001']
    }
];