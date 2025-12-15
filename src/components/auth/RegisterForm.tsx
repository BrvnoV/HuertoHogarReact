import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';  // Si usas routing
import api from '../../utils/axiosInstance';
import { useShop } from '../../context/ShopContext';
import {
  soloLetrasEspacios,
  validPhone,
  strongPassword,
  comunas,
} from '../../data/constants';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: () => void;
}

interface RegisterFormData {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  email: string;
  telefono: string;  // FIX: Estandarizado a 'telefono'
  comuna: string;
  contraseña: string;  // FIX: Estandarizado a 'contraseña'
  confirmContraseña: string;  // FIX: Confirmación en español
  terms: boolean;
}

interface Errors {
  general: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  email: string;
  telefono: string;
  comuna: string;
  contraseña: string;
  confirmContraseña: string;
  terms: string;
}

const initialFormData: RegisterFormData = {
  nombre: '',
  apellido: '',
  fechaNacimiento: '',
  email: '',
  telefono: '',  // FIX: Cambiado de 'phone' a 'telefono'
  comuna: '',
  contraseña: '',  // FIX: Cambiado de 'password' a 'contraseña'
  confirmContraseña: '',  // FIX: Cambiado de 'confirmPassword' a 'confirmContraseña'
  terms: false,
};

const initialErrors: Errors = {
  general: '',
  nombre: '',
  apellido: '',
  fechaNacimiento: '',
  email: '',
  telefono: '',
  comuna: '',
  contraseña: '',
  confirmContraseña: '',
  terms: '',
};

export default function RegisterForm({ onSwitchToLogin, onRegisterSuccess }: RegisterFormProps) {
  const { showToast } = useShop();
  const navigate = useNavigate();  // Si usas routing; remueve si no

  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [errors, setErrors] = useState<Errors>(initialErrors);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : false;

    setFormData(prev => ({
      ...prev,
      [id]: isCheckbox ? checked : value,
    }));

    validateField(id, isCheckbox ? checked : value);
  };

  const validarEmail = (email: string): boolean => {
    return /@(?:duocuc\.cl|gmail\.com|profesor\.duoc\.cl)$/.test(email);
  };

  const validarEdad = (fecha: string): boolean => {
    if (!fecha) return false;
    const nacimiento = new Date(fecha);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad >= 18;
  };

  const validateField = (id: string, value: any) => {
    let errorMsg = '';
    switch (id) {
      case 'nombre':
      case 'apellido':
        if (value && (!soloLetrasEspacios(value) || value.length > 50)) {
          errorMsg = 'Solo letras y espacios, máx 50 caracteres.';
        }
        break;
      case 'fechaNacimiento':
        if (value && !validarEdad(value)) {
          errorMsg = 'Debes ser mayor de 18 años.';
        }
        break;
      case 'email':
        if (value && !validarEmail(value)) {
          errorMsg = 'Email debe terminar en @duocuc.cl, @gmail.com o @profesor.duoc.cl.';
        }
        break;
      case 'telefono':
        if (value && !validPhone(value)) {
          errorMsg = 'Teléfono no válido (8-15 dígitos).';
        }
        break;
      case 'comuna':
        if (!value) {
          errorMsg = 'Selecciona una comuna.';
        }
        break;
      case 'contraseña':
        if (value && !strongPassword(value)) {
          errorMsg = 'Debe tener 8+ caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo.';
        }
        // Valida coincidencia con confirm
        if (formData.confirmContraseña && value !== formData.confirmContraseña) {
          setErrors(prev => ({ ...prev, confirmContraseña: 'Las contraseñas no coinciden.' }));
        } else if (formData.confirmContraseña) {
          setErrors(prev => ({ ...prev, confirmContraseña: '' }));
        }
        break;
      case 'confirmContraseña':
        if (value && value !== formData.contraseña) {
          errorMsg = 'Las contraseñas no coinciden.';
        }
        break;
      case 'terms':
        if (!value) {
          errorMsg = 'Debes aceptar los términos.';
        }
        break;
    }
    setErrors(prev => ({ ...prev, [id]: errorMsg }));
    return !errorMsg;
  };

  const validateForm = () => {
    const newErrors: Errors = {
      general: '',
      nombre: '',
      apellido: '',
      fechaNacimiento: '',
      email: '',
      telefono: '',
      comuna: '',
      contraseña: '',
      confirmContraseña: '',
      terms: ''
    };

    newErrors.nombre = formData.nombre ? (soloLetrasEspacios(formData.nombre) && formData.nombre.length <= 50 ? '' : 'Solo letras y espacios, máx 50 caracteres.') : 'Nombre requerido';
    newErrors.apellido = formData.apellido ? (soloLetrasEspacios(formData.apellido) && formData.apellido.length <= 50 ? '' : 'Solo letras y espacios, máx 50 caracteres.') : 'Apellido requerido';
    newErrors.fechaNacimiento = formData.fechaNacimiento ? (validarEdad(formData.fechaNacimiento) ? '' : 'Debes ser mayor de 18 años.') : 'Fecha requerida';
    newErrors.email = formData.email ? (validarEmail(formData.email) ? '' : 'Email debe terminar en @duocuc.cl, @gmail.com o @profesor.duoc.cl.') : 'Email requerido';
    newErrors.telefono = formData.telefono ? (validPhone(formData.telefono) ? '' : 'Teléfono no válido (8-15 dígitos).') : '';
    newErrors.comuna = formData.comuna ? '' : 'Selecciona una comuna.';  // Si es requerido
    newErrors.contraseña = formData.contraseña ? (strongPassword(formData.contraseña) ? '' : 'Debe tener 8+ caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo.') : 'Contraseña requerida';
    newErrors.confirmContraseña = formData.confirmContraseña === formData.contraseña ? '' : 'Las contraseñas no coinciden.';
    newErrors.terms = formData.terms ? '' : 'Debes aceptar los términos.';

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        // Payload corregido: Usa 'contraseña' como clave para DTO
        const payload = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          fechaNacimiento: formData.fechaNacimiento,
          email: formData.email,
          contraseña: formData.contraseña,  // FIX: Clave correcta para backend DTO
          telefono: formData.telefono,  // FIX: Clave correcta
          comuna: formData.comuna
        };

        console.log('Enviando payload:', payload);

        const response = await api.post('/usuarios/register', payload);  // FIX: Solo un await, sin duplicado
        console.log('Registro exitoso:', response.data);

        showToast('¡Registro exitoso! Ve al login.', 'success');
        onRegisterSuccess();
        setFormData(initialFormData);
        setErrors(initialErrors);
        // Opcional: navigate('/login');
      } catch (err: any) {
        console.error('Error registro:', err);
        const status = err.response?.status;
        let msg = 'Error al registrarse';
        if (status === 400) {
          msg = err.response?.data?.message || 'Datos inválidos';
        } else if (status === 409) {
          msg = 'Email ya registrado';
        } else if (status === 500) {
          msg = 'Error interno del servidor';
        }
        showToast(msg, 'error');
        setErrors({ ...errors, general: msg });
      } finally {
        setLoading(false);
      }
    } else {
      showToast('Corrige los errores en el formulario', 'error');
    }
  };

  return (
    <Form noValidate onSubmit={handleSubmit}>
      {errors.general && <Alert variant="danger">{errors.general}</Alert>}

      <Form.Group className="mb-3" controlId="nombre">
        <Form.Label>Nombre *</Form.Label>
        <Form.Control
          type="text"
          value={formData.nombre}
          onChange={handleChange}
          isInvalid={!!errors.nombre}
          isValid={!errors.nombre && formData.nombre.length > 0}
          required
        />
        <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="apellido">
        <Form.Label>Apellido *</Form.Label>
        <Form.Control
          type="text"
          value={formData.apellido}
          onChange={handleChange}
          isInvalid={!!errors.apellido}
          isValid={!errors.apellido && formData.apellido.length > 0}
          required
        />
        <Form.Control.Feedback type="invalid">{errors.apellido}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="fechaNacimiento">
        <Form.Label>Fecha de Nacimiento *</Form.Label>
        <Form.Control
          type="date"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          max={new Date().toISOString().split('T')[0]}
          isInvalid={!!errors.fechaNacimiento}
          isValid={!errors.fechaNacimiento && formData.fechaNacimiento.length > 0}
          required
        />
        <Form.Control.Feedback type="invalid">{errors.fechaNacimiento}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email *</Form.Label>
        <Form.Control
          type="email"
          value={formData.email}
          onChange={handleChange}
          isInvalid={!!errors.email}
          isValid={!errors.email && formData.email.length > 0}
          required
        />
        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="telefono">
        <Form.Label>Teléfono (opcional)</Form.Label>
        <Form.Control
          type="tel"
          value={formData.telefono}
          onChange={handleChange}
          isInvalid={!!errors.telefono}
          isValid={!errors.telefono && formData.telefono.length > 0}
        />
        <Form.Control.Feedback type="invalid">{errors.telefono}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="comuna">
        <Form.Label>Comuna (opcional)</Form.Label>
        <Form.Select
          value={formData.comuna}
          onChange={handleChange}
          isInvalid={!!errors.comuna}
          isValid={!errors.comuna && formData.comuna.length > 0}
        >
          <option value="">Selecciona una comuna</option>
          {Object.entries(comunas).map(([codigo, nombre]) => (
            <option key={codigo} value={codigo}>{nombre}</option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">{errors.comuna}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="contraseña">
        <Form.Label>Contraseña *</Form.Label>
        <Form.Control
          type="password"
          value={formData.contraseña}
          onChange={handleChange}
          isInvalid={!!errors.contraseña}
          isValid={!errors.contraseña && formData.contraseña.length > 0}
          required
          minLength={8}
        />
        <Form.Control.Feedback type="invalid">{errors.contraseña}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="confirmContraseña">
        <Form.Label>Confirmar Contraseña *</Form.Label>
        <Form.Control
          type="password"
          value={formData.confirmContraseña}
          onChange={handleChange}
          isInvalid={!!errors.confirmContraseña}
          isValid={!errors.confirmContraseña && formData.confirmContraseña.length > 0}
          required
        />
        <Form.Control.Feedback type="invalid">{errors.confirmContraseña}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="terms">
        <Form.Check
          type="checkbox"
          label="Acepto los términos y condiciones *"
          checked={formData.terms}
          onChange={handleChange}
          isInvalid={!!errors.terms}
          feedback={errors.terms}
          feedbackType="invalid"
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </Button>

      <p className="mt-3 text-center">
        <Button variant="link" onClick={onSwitchToLogin}>
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </p>
    </Form>
  );
}