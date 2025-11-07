import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

export default function Impact() {
  return (
    // Usamos un Fragmento (<>) porque la página (Home.tsx)
    // ya nos da la <section> y el <container>.
    <>
      <h2 className="text-center mb-4" style={{ color: 'white' }}>
        Impacto Ambiental
      </h2>
      <Row>
        <Col md={6} className="mb-4 d-flex">
          {/* Añadimos 'text-dark' para que el texto sea legible
              sobre el fondo blanco de la tarjeta
          */}
          <Card className="h-100 text-dark">
            <Card.Body>
              <Card.Title>Huella de Carbono</Card.Title>
              <Card.Text>
                Al comprar productos locales, reduces significativamente la huella de
                carbono asociada al transporte. Cada compra contribuye a un planeta más saludable.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4 d-flex">
          <Card className="h-100 text-dark">
            <Card.Body>
              <Card.Title>Apoyo a la Comunidad</Card.Title>
              <Card.Text>
                Tus compras apoyan directamente a agricultores locales y comunidades en
                Chile, promoviendo la economía sostenible.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}