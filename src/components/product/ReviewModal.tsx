import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useShop } from '../../context/ShopContext';

export default function ReviewModal() {
  // 1. Obtenemos el estado y las funciones del contexto global
  const {
    showReviewModal,     // (Estado) ¿Está visible el modal?
    setShowReviewModal,  // (Función) Para cerrar el modal
    currentProductId,    // (Estado) El ID del producto que estamos reseñando
    handleSubmitReview,  // (Función) La lógica para guardar la reseña
  } = useShop();

  // 2. Estado local para los campos del formulario
  const [rating, setRating] = useState('5'); // Calificación por defecto
  const [comment, setComment] = useState('');

  // 3. Función para manejar el envío del formulario
  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue

    // Verificamos que tengamos un ID de producto antes de enviar
    if (currentProductId) {
      // Llamamos a la función del contexto con los datos del estado local
      handleSubmitReview(currentProductId, rating, comment);
      
      // Limpiamos el formulario y cerramos el modal
      // (La función handleSubmitReview en el contexto ya cierra el modal)
      setRating('5');
      setComment('');
    }
  };

  // 4. Función para manejar el cierre del modal
  const handleClose = () => {
    // Limpiamos el formulario al cerrar por si el usuario cancela
    setRating('5');
    setComment('');
    setShowReviewModal(false); // Cierra el modal
  };

  // 5. Renderizado del componente Modal
  return (
    <Modal show={showReviewModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Dejar una Reseña</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleLocalSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="reviewRating">
            <Form.Label>Calificación</Form.Label>
            <Form.Select 
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            >
              <option value="5">5 Estrellas</option>
              <option value="4">4 Estrellas</option>
              <option value="3">3 Estrellas</option>
              <option value="2">2 Estrellas</option>
              <option value="1">1 Estrella</option>
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="reviewComment">
            <Form.Label>Comentario</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              placeholder="Escribe tu opinión sobre el producto..."
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Enviar Reseña
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}