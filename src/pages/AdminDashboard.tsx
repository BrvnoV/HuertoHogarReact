import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Form, Button, Table, Modal, Alert, Tab, Tabs, Spinner } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSave, FaUserPlus, FaBox } from 'react-icons/fa'; // Icons opcionales
import api from '../utils/axiosInstance';
import { AxiosResponse } from 'axios';
import { useShop } from '../context/ShopContext';
import { Product, Category, User } from '../types';

const AdminDashboard: React.FC = () => {
  const { products: contextProducts, categories: contextCategories, setProducts: setGlobalProducts, setCategories: setGlobalCategories } = useShop();

  // Tab State
  const [key, setKey] = useState('productos');

  // Loading States
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({ products: false, categories: false, users: false });

  // --- PRODUCTOS STATE ---

  const [localProducts, setLocalProducts] = useState<Product[]>(contextProducts);
  const [showProdModal, setShowProdModal] = useState(false);
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [prodFormData, setProdFormData] = useState({
    name: '',
    price: 0,
    categoryId: '',
    image: '',
    stock: 0,
    description: ''
  });
  const [prodError, setProdError] = useState('');

  // --- CATEGORÍAS STATE ---
  const [localCategories, setLocalCategories] = useState<Category[]>(contextCategories);
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catFormData, setCatFormData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [catError, setCatError] = useState('');

  // --- USUARIOS STATE ---
  const [users, setUsers] = useState<User[]>([]);

  // Track if initial fetch has been attempted (to avoid loops)
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  // Sync with context on mount/update
  useEffect(() => {
    setLocalProducts(contextProducts);
  }, [contextProducts]);

  useEffect(() => {
    setLocalCategories(contextCategories);
  }, [contextCategories]);

  // Fetch initial data only once on mount if empty
  useEffect(() => {
    if (!initialFetchDone) {
      const fetchInitialData = async () => {
        const productsEmpty = contextProducts.length === 0;
        const categoriesEmpty = contextCategories.length === 0;

        if (productsEmpty) {
          setLoading(prev => ({ ...prev, products: true }));
          try {
            const res = await api.get('/productos');
            setLocalProducts(res.data);
            setGlobalProducts(res.data);
          } catch (error) {
            console.error('Error fetching products', error);
          } finally {
            setLoading(prev => ({ ...prev, products: false }));
          }
        }

        if (categoriesEmpty) {
          setLoading(prev => ({ ...prev, categories: true }));
          try {
            const res = await api.get('/categorias');
            setLocalCategories(res.data);
            if (setGlobalCategories) setGlobalCategories(res.data);
          } catch (error) {
            console.error('Error fetching categories', error);
          } finally {
            setLoading(prev => ({ ...prev, categories: false }));
          }
        }

        setInitialFetchDone(true);
      };

      fetchInitialData();
    }
  }, []);  // Empty deps: Run only on mount

  // Fetch users only when tab active
  useEffect(() => {
    if (key === 'usuarios' && users.length === 0) {
      fetchUsers();
    }
  }, [key]);

  // --- FETCH HELPERS --- (removidos los fetchProducts/fetchCategories independientes, ya que se manejan en initial y manual)

  const fetchUsers = useCallback(async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const res = await api.get('/usuarios');
      setUsers(res.data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        // Solo logout si es realmente acceso denegado
        console.error('Acceso denegado a usuarios');
      } else {
        console.error('Error fetching users', error);
      }
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  }, []);

  // --- PRODUCT HANDLERS --- 
  const handleProdSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setProdError('');

    // Validations
    if (prodFormData.price <= 0) {
      setProdError('El precio debe ser mayor a 0');
      return;
    }
    if (!prodFormData.categoryId) {
      setProdError('Debes seleccionar una categoría');
      return;
    }
    if (!prodFormData.image) {
      setProdError('Debes ingresar una URL de imagen');
      return;
    }
    const nameExists = localProducts.some(p =>
      p.name.toLowerCase() === prodFormData.name.toLowerCase() && p.id !== editingProd?.id
    );
    if (nameExists) {
      setProdError('Ya existe un producto con ese nombre');
      return;
    }

    try {
      // Set loading for optimistic feedback during submit
      setLoading(prev => ({ ...prev, products: true }));

      // Payload with categoryId only (matches DTO)
      const payload = {
        name: prodFormData.name,
        price: parseFloat(prodFormData.price.toString()),
        categoryId: Number(prodFormData.categoryId),
        stock: parseInt(prodFormData.stock.toString()),
        description: prodFormData.description,
        image: prodFormData.image,
        origin: '',  // Add to form if needed
        sustainability: '',
        recipe: '',
        recommendations: ''
      };

      let res: AxiosResponse<Product>;
      if (editingProd) {
        // Update
        res = await api.put(`/productos/${editingProd.id}`, payload);
        const updated = localProducts.map(p => p.id === editingProd.id ? res.data : p);
        setLocalProducts(updated);
        setGlobalProducts(updated);
      } else {
        // Create
        res = await api.post('/productos', payload);
        const updated = [...localProducts, res.data];
        setLocalProducts(updated);
        setGlobalProducts(updated);
      }
      setShowProdModal(false);
      resetProdForm();
    } catch (err: any) {
      // Granular error handling
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        throw err; // Interceptor handles logout
      } else if (status === 400) {
        setProdError(err.response?.data?.message || 'Datos inválidos (verifica categoría o precio)');
      } else if (status === 404) {
        setProdError('Categoría no encontrada');
      } else {
        setProdError(err.response?.data?.message || 'Error inesperado al guardar producto');
      }
      console.error('Producto error details:', err.response?.data);
    } finally {
      // Always clear loading after submit
      setLoading(prev => ({ ...prev, products: false }));
    }
  }, [prodFormData, editingProd, localProducts, setGlobalProducts]);

  const handleEditProd = useCallback((p: Product) => {
    setEditingProd(p);
    setProdFormData({
      name: p.name,
      price: p.price,
      categoryId: p.category?.id?.toString() || '',
      image: p.image || '',
      stock: p.stock || 0,
      description: p.description || ''
    });
    setShowProdModal(true);
  }, []);

  const handleDeleteProd = useCallback(async (id: string | number) => {
    if (window.confirm('¿Eliminar producto?')) {
      try {
        setLoading(prev => ({ ...prev, products: true }));  // Loading for delete
        await api.delete(`/productos/${id}`);
        const updated = localProducts.filter(p => p.id !== id);
        setLocalProducts(updated);
        setGlobalProducts(updated);
      } catch (err: any) {
        if (err.response?.status !== 401 && err.response?.status !== 403) {
          alert('Error eliminando producto');
        }
      } finally {
        setLoading(prev => ({ ...prev, products: false }));
      }
    }
  }, [localProducts, setGlobalProducts]);

  const resetProdForm = useCallback(() => {
    setEditingProd(null);
    setProdFormData({ name: '', price: 0, categoryId: '', image: '', stock: 0, description: '' });
    setProdError('');
  }, []);

  // --- CATEGORY HANDLERS ---
  const handleCatSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setCatError('');

    try {
      setLoading(prev => ({ ...prev, categories: true }));  // Loading for submit

      if (editingCat) {
        const res = await api.put(`/categorias/${editingCat.id}`, catFormData);
        const updated = localCategories.map(c => c.id === editingCat.id ? res.data : c);
        setLocalCategories(updated);
        if (setGlobalCategories) setGlobalCategories(updated);
      } else {
        const res = await api.post('/categorias', catFormData);
        const updated = [...localCategories, res.data];
        setLocalCategories(updated);
        if (setGlobalCategories) setGlobalCategories(updated);
      }
      setShowCatModal(false);
      setEditingCat(null);
      setCatFormData({ nombre: '', descripcion: '' });
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        throw err;
      }
      setCatError(err.response?.data?.message || 'Error guardando categoría');
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  }, [catFormData, editingCat, localCategories, setGlobalCategories]);

  const handleEditCat = useCallback((c: Category) => {
    setEditingCat(c);
    setCatFormData({
      nombre: c.nombre,
      descripcion: c.descripcion || ''
    });
    setShowCatModal(true);
  }, []);

  const handleDeleteCat = useCallback(async (id: number) => {
    if (window.confirm('¿Eliminar categoría?')) {
      try {
        setLoading(prev => ({ ...prev, categories: true }));  // Loading for delete
        await api.delete(`/categorias/${id}`);
        const updated = localCategories.filter(c => c.id !== id);
        setLocalCategories(updated);
        if (setGlobalCategories) setGlobalCategories(updated);
      } catch (err: any) {
        if (err.response?.status !== 401 && err.response?.status !== 403) {
          alert('Error eliminando categoría');
        }
      } finally {
        setLoading(prev => ({ ...prev, categories: false }));
      }
    }
  }, [localCategories, setGlobalCategories]);

  // Memoized tables para performance
  const productsTable = useMemo(() => (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Categoría</th>
          <th>Stock</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {loading.products ? (
          <tr><td colSpan={6} className="text-center"><Spinner animation="border" /></td></tr>
        ) : localProducts.length === 0 ? (
          <tr><td colSpan={6} className="text-center">No hay productos</td></tr>
        ) : (
          localProducts.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>${p.price.toFixed(2)}</td>
              <td>{p.category?.nombre || 'Sin Categoría'}</td>
              <td>{p.stock}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEditProd(p)} className="me-2" title="Editar">
                  <FaEdit />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteProd(p.id)} title="Eliminar">
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  ), [localProducts, loading.products, handleEditProd, handleDeleteProd]);

  const categoriesTable = useMemo(() => (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {loading.categories ? (
          <tr><td colSpan={4} className="text-center"><Spinner animation="border" /></td></tr>
        ) : localCategories.length === 0 ? (
          <tr><td colSpan={4} className="text-center">No hay categorías</td></tr>
        ) : (
          localCategories.map(cat => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.nombre}</td>
              <td>{cat.descripcion || '-'}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEditCat(cat)} className="me-2" title="Editar">
                  <FaEdit />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteCat(cat.id)} title="Eliminar">
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  ), [localCategories, loading.categories, handleEditCat, handleDeleteCat]);

  const usersTable = useMemo(() => (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
        </tr>
      </thead>
      <tbody>
        {loading.users ? (
          <tr><td colSpan={4} className="text-center"><Spinner animation="border" /></td></tr>
        ) : users.length === 0 ? (
          <tr><td colSpan={4} className="text-center">No hay usuarios</td></tr>
        ) : (
          users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td><span className={`badge ${u.role === 'ADMIN' ? 'bg-danger' : 'bg-secondary'}`}>{u.role}</span></td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  ), [users, loading.users]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1><FaBox /> Dashboard Administrativo</h1>
        <Button variant="outline-secondary" onClick={() => window.location.reload()}>Refrescar</Button>
      </div>

      <Tabs
        id="admin-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k || 'productos')}
        className="mb-3"
      >
        {/* TAB PRODUCTOS */}
        <Tab eventKey="productos" title="Productos">
          <Button variant="success" onClick={() => { resetProdForm(); setShowProdModal(true); }} className="mb-3">
            <FaPlus /> Nuevo Producto
          </Button>
          {productsTable}

          {/* Modal Productos */}
          <Modal show={showProdModal} onHide={() => setShowProdModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{editingProd ? 'Editar' : 'Crear'} Producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {prodError && <Alert variant="danger">{prodError}</Alert>}
              <Form onSubmit={handleProdSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre *</Form.Label>
                  <Form.Control
                    type="text"
                    value={prodFormData.name}
                    onChange={e => setProdFormData({ ...prodFormData, name: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Precio *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={prodFormData.price}
                    onChange={e => setProdFormData({ ...prodFormData, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={prodFormData.stock}
                    onChange={e => setProdFormData({ ...prodFormData, stock: parseInt(e.target.value) || 0 })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría *</Form.Label>
                  <Form.Select
                    value={prodFormData.categoryId}
                    onChange={e => setProdFormData({ ...prodFormData, categoryId: e.target.value })}
                    required
                  >
                    <option value="">Seleccione...</option>
                    {localCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Imagen URL *</Form.Label>
                  <Form.Control
                    type="url"
                    value={prodFormData.image}
                    onChange={e => setProdFormData({ ...prodFormData, image: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={prodFormData.description}
                    onChange={e => setProdFormData({ ...prodFormData, description: e.target.value })}
                  />
                </Form.Group>
                <Button type="submit" variant="primary" className="me-2"><FaSave /> Guardar</Button>
                <Button variant="secondary" onClick={() => setShowProdModal(false)}>Cancelar</Button>
              </Form>
            </Modal.Body>
          </Modal>
        </Tab>

        {/* TAB CATEGORÍAS */}
        <Tab eventKey="categorias" title="Categorías">
          <Button variant="success" onClick={() => { setEditingCat(null); setCatFormData({ nombre: '', descripcion: '' }); setShowCatModal(true); }} className="mb-3">
            <FaPlus /> Nueva Categoría
          </Button>
          {categoriesTable}

          {/* Modal Categorías */}
          <Modal show={showCatModal} onHide={() => setShowCatModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{editingCat ? 'Editar' : 'Nueva'} Categoría</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {catError && <Alert variant="danger">{catError}</Alert>}
              <Form onSubmit={handleCatSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre *</Form.Label>
                  <Form.Control
                    type="text"
                    value={catFormData.nombre}
                    onChange={e => setCatFormData({ ...catFormData, nombre: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    type="text"
                    value={catFormData.descripcion}
                    onChange={e => setCatFormData({ ...catFormData, descripcion: e.target.value })}
                  />
                </Form.Group>
                <Button type="submit" variant="primary" className="me-2"><FaSave /> Guardar</Button>
                <Button variant="secondary" onClick={() => setShowCatModal(false)}>Cancelar</Button>
              </Form>
            </Modal.Body>
          </Modal>
        </Tab>

        {/* TAB USUARIOS */}
        <Tab eventKey="usuarios" title="Usuarios">
          <p className="text-muted mb-3">Lista de usuarios registrados en el sistema.</p>
          {usersTable}
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;