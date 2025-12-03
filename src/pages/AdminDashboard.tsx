import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Modal, Alert } from 'react-bootstrap';
import api from '../utils/axiosInstance';
import { Product } from '../data/products';

const AdminDashboard: React.FC = () => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: 0,
    categoria: '',
  });

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/productos');
      setProductos(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error cargando productos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || formData.precio <= 0 || !formData.categoria) {
      setError('Completa todos los campos. Precio > 0');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/productos/${editingId}`, formData);
        setError('');
      } else {
        await api.post('/productos', formData);
      }
      fetchProductos();
      setShowModal(false);
      setEditingId(null);
      setFormData({ nombre: '', precio: 0, categoria: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error guardando producto');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(Number(product.id));
    setFormData({
      nombre: product.name || product.name,
      precio: product.price || product.price,
      categoria: product.category || product.category,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Eliminar producto?')) {
      try {
        await api.delete(`/productos/${id}`);
        fetchProductos();
      } catch (err: any) {
        setError('Error eliminando');
      }
    }
  };

  if (loading) return <p>Cargando dashboard...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h1>Dashboard Admin - Gestión de Productos</h1>
      <Button variant="success" onClick={() => setShowModal(true)} className="mb-3">
        Agregar Producto
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name || p.name}</td>
              <td>${p.price || p.price}</td>
              <td>{p.category || p.category}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(p)} className="me-2">
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(String(p.id))}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setEditingId(null);
      }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Editar' : 'Agregar'} Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
                min={1}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                required
              >
                <option value="">Selecciona</option>
                <option value="Frutas">Frutas</option>
                <option value="Verduras">Verduras</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" form="adminForm">
            {editingId ? 'Actualizar' : 'Agregar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;