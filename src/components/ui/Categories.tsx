import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Para que las tarjetas sean clickeables

// Datos de las tarjetas de categoría
const categoriesData = [
  {
    title: 'Frutas Frescas',
    text: 'Frutas de temporada cultivadas en el punto óptimo de madurez.',
    image: '/assets/img/fruta1.png',
    link: '/productos?category=Frutas' // Enlazamos a productos (lógica futura)
  },
  {
    title: 'Verduras Orgánicas',
    text: 'Verduras sin pesticidas, frescas y nutritivas.',
    image: '/assets/img/vegetales1.jpeg',
    link: '/productos?category=Verduras' // Enlazamos a productos (lógica futura)
  },
  {
    title: 'Ofertas Especiales',
    text: 'Descuentos en productos seleccionados.',
    image: '/assets/img/ofertas1.jpg',
    link: '/productos' // Enlazamos a todos los productos
  }
];

// Este componente es SÓLO LA FILA de tarjetas,
// para que puedas ponerle un título diferente en cada página.
export default function Categories() {
  return (
    <Row>
      {categoriesData.map((category) => (
        <Col md={4} key={category.title} className="mb-4 d-flex">
          {/* Hacemos que la tarjeta entera sea un link */}
          <Link to={category.link} className="text-decoration-none w-100">
            <Card className="category-card h-100 text-dark">
              <Card.Img
                variant="top"
                src={category.image}
                alt={category.title}
                className="category-card-img" // Usando la clase de tu CSS
              />
              <Card.Body>
                <Card.Title>{category.title}</Card.Title>
                <Card.Text>{category.text}</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
}