import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useShop } from '../../context/ShopContext';
import { 
  soloLetrasEspacios, 
  isDuocMail, 
  validPhone, 
  strongPassword, 
  comunas 
} from '../../data/constants';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: () => void;
}

// Estado inicial para los datos del formulario
const initialFormData = {
  name: '',
  email: '',
  phone: '',
  comuna: '',
  password: '',
  confirmPassword: '',
  terms: false,
};

// Estado inicial para los errores de validación
const initialErrors = {
  name: '',
  email: '',
  phone: '',
  comuna: '',
  password: '',
  confirmPassword: '',
  terms: '',
};

export default function RegisterForm({ onSwitchToLogin, onRegisterSuccess }: RegisterFormProps) {
  const { handleRegister, showToast } = useShop();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);

// Función genérica para manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setFormData(prev => ({
      ...prev,
      [id]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));

    // Validar en tiempo real
    validateField(id, value);
  };

  // Función para validar un campo específico
  const validateField = (id: string, value: any) => {
    let errorMsg = '';
    switch (id) {
      case 'name':
        if (!soloLetrasEspacios(value) || value.length > 50) {
          errorMsg = 'El nombre solo puede contener letras y espacios, máx 50 caracteres.';
        }
        break;
      case 'email':
        if (!isDuocMail(value)) {
          errorMsg = 'El correo debe ser un email válido de @duoc.cl.';
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
        // Validar también la confirmación si la contraseña cambia
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

  // Validar todo el formulario al enviar
  const validateForm = () => {
    const newErrors = {
      name: validateField('name', formData.name) ? '' : errors.name || 'Error en nombre.',
      email: validateField('email', formData.email) ? '' : errors.email || 'Error en email.',
      phone: validateField('phone', formData.phone) ? '' : errors.phone || '', // Opcional
      comuna: validateField('comuna', formData.comuna) ? '' : errors.comuna || 'Selecciona comuna.',
      password: validateField('password', formData.password) ? '' : errors.password || 'Error en contraseña.',
      confirmPassword: validateField('confirmPassword', formData.confirmPassword) ? '' : errors.confirmPassword || 'Error en confirmación.',
      terms: formData.terms ? '' : 'Debes aceptar los términos.'
    };
    setErrors(newErrors);
    // Devuelve true si no hay ningún string de error
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Llamamos a la función de registro del contexto
      const success = handleRegister(formData);
      
      if (success) {
        onRegisterSuccess(); // Vuelve al login
        setFormData(initialFormData); // Resetea el formulario
        setErrors(initialErrors);
      } else {
        showToast('Ocurrió un error en el registro', 'error');
      }
    } else {
      showToast('Por favor, corrige los errores en el formulario', 'error');
    }
  };

  return (
    <Form noValidate onSubmit={handleSubmit}>
      
      {/* Name */}
      <Form.Group className="mb-3" controlId="name">
        <Form.Label>Nombre Completo</Form.Label>
        <Form.Control
          type="text"
          value={formData.name}
          onChange={handleChange}
          isInvalid={!!errors.name}
          isValid={!errors.name && formData.name.length > 0}
          required
        />
        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
      </Form.Group>

      {/* Email */}
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

      {/* Phone */}
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

      {/* Comuna */}
      <Form.Group className="mb-3" controlId="comuna">
        <Form.Label>Comuna</Form.Label>
        <Form.Select
          value={formData.comuna}
          onChange={handleChange}
          isInvalid={!!errors.comuna}
          isValid={!errors.comuna && formData.comuna.length > 0}
          required
        >
          <option value="">Selecciona una comuna</option>
          {/* Mapeamos el objeto de comunas importado */}
          {Object.entries(comunas).map(([codigo, nombre]) => (
            <option key={codigo} value={codigo}>{nombre}</option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">{errors.comuna}</Form.Control.Feedback>
      </Form.Group>

      {/* Password */}
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

      {/* Confirm Password */}
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

      {/* Terms */}
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