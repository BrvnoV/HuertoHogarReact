import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
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

const initialFormData = {
  nombre: '',
  apellido: '',
  fechaNacimiento: '',
  email: '',
  phone: '',
  comuna: '',
  password: '',
  confirmPassword: '',
  terms: false,
};

const initialErrors = {
  general: '',
  nombre: '',
  apellido: '',
  fechaNacimiento: '',
  email: '',
  phone: '',
  comuna: '',
  password: '',
  confirmPassword: '',
  terms: '',
};

export default function RegisterForm({ onSwitchToLogin, onRegisterSuccess }: RegisterFormProps) {
  const { showToast } = useShop();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    const isCheckbox = type === 'checkbox';

    setFormData(prev => ({
      ...prev,
      [id]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));

    validateField(id, value);
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
        if (!soloLetrasEspacios(value) || value.length > 50) {
          errorMsg = 'Solo letras y espacios, máx 50 caracteres.';
        }
        break;
      case 'fechaNacimiento':
        if (!validarEdad(value)) {
          errorMsg = 'Debes ser mayor de 18 años.';
        }
        break;
      case 'email':
        if (!validarEmail(value)) {
          errorMsg = 'Email debe terminar en @duocuc.cl, @gmail.com o @profesor.duoc.cl.';
        }
        break;
      case 'phone':
        if (!validPhone(value)) {
          errorMsg = 'Teléfono no válido (8-15 dígitos).';
        }
        break;
      case 'comuna':
        if (!value) {
          errorMsg = 'Selecciona una comuna.';
        }
        break;
      case 'password':
        if (!strongPassword(value)) {
          errorMsg = 'Debe tener 8+ caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo.';
        }
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden.' }));
        } else if (formData.confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: '' }));
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
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
    const newErrors = {
      general: '',
      nombre: '',
      apellido: '',
      fechaNacimiento: '',
      email: '',
      phone: '',
      comuna: '',
      password: '',
      confirmPassword: '',
      terms: ''
    };

    newErrors.nombre = formData.nombre ? (soloLetrasEspacios(formData.nombre) && formData.nombre.length <= 50 ? '' : 'Solo letras y espacios, máx 50 caracteres.') : 'Nombre requerido';
    newErrors.apellido = formData.apellido ? (soloLetrasEspacios(formData.apellido) && formData.apellido.length <= 50 ? '' : 'Solo letras y espacios, máx 50 caracteres.') : 'Apellido requerido';
    newErrors.fechaNacimiento = formData.fechaNacimiento ? (validarEdad(formData.fechaNacimiento) ? '' : 'Debes ser mayor de 18 años.') : 'Fecha requerida';
    newErrors.email = formData.email ? (validarEmail(formData.email) ? '' : 'Email debe terminar en @duocuc.cl, @gmail.com o @profesor.duoc.cl.') : 'Email requerido';
    newErrors.phone = formData.phone ? (validPhone(formData.phone) ? '' : 'Teléfono no válido (8-15 dígitos).') : '';
    newErrors.comuna = formData.comuna ? '' : '';  // Opcional
    newErrors.password = formData.password ? (strongPassword(formData.password) ? '' : 'Debe tener 8+ caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo.') : 'Contraseña requerida';
    newErrors.confirmPassword = formData.confirmPassword === formData.password ? '' : 'Las contraseñas no coinciden.';
    newErrors.terms = formData.terms ? '' : 'Debes aceptar los términos.';

    setErrors(newErrors);
    return !Object.values(newErrors).slice(1).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Endpoint exacto de tu controller
        const payload = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          fechaNacimiento: formData.fechaNacimiento,
          email: formData.email,
          contraseña: formData.password,
          phone: formData.phone || null,
          comuna: formData.comuna || null,
          role: 'USUARIO'  // Default de rúbrica
        };
        console.log('Enviando payload:', payload);  // Debug
        await api.post('/usuarios/register', payload);  // URL de tu controller
        showToast('¡Registro exitoso! Ve al login.', 'success');
        onRegisterSuccess();
        setFormData(initialFormData);
        setErrors(initialErrors);
      } catch (err: any) {
        console.log('Error registro:', err.response?.data);
        showToast(err.response?.data?.message || 'Error en el servidor', 'error');
        setErrors({ ...errors, general: 'Error en registro' });
      }
    } else {
      showToast('Corrige los errores en el formulario', 'error');
    }
  };

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="nombre">
        <Form.Label>Nombre</Form.Label>
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
        <Form.Label>Apellido</Form.Label>
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
        <Form.Label>Fecha de Nacimiento</Form.Label>
        <input
          type="date"
          id="fechaNacimiento"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          max={new Date().toISOString().split('T')[0]}
          className={`form-control ${errors.fechaNacimiento ? 'is-invalid' : formData.fechaNacimiento ? 'is-valid' : ''}`}
          required
        />
        <Form.Control.Feedback type="invalid">{errors.fechaNacimiento}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email</Form.Label>
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

      <Form.Group className="mb-3" controlId="phone">
        <Form.Label>Teléfono (opcional)</Form.Label>
        <Form.Control
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          isInvalid={!!errors.phone}
          isValid={!errors.phone && formData.phone.length > 0}
        />
        <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
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

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          value={formData.password}
          onChange={handleChange}
          isInvalid={!!errors.password}
          isValid={!errors.password && formData.password.length > 0}
          required
        />
        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="confirmPassword">
        <Form.Label>Confirmar Contraseña</Form.Label>
        <Form.Control
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          isInvalid={!!errors.confirmPassword}
          isValid={!errors.confirmPassword && formData.confirmPassword.length > 0}
          required
        />
        <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="terms">
        <Form.Check
          type="checkbox"
          label="Acepto los términos y condiciones"
          checked={formData.terms}
          onChange={handleChange}
          isInvalid={!!errors.terms}
          feedback={errors.terms}
          feedbackType="invalid"
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100">
        Registrarse
      </Button>

      <p className="mt-3 text-center">
        <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>
          Volver a Iniciar Sesión
        </a>
      </p>
    </Form>
  );
}