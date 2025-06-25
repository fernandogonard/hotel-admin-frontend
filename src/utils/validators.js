// utils/validators.js - Validaciones del lado cliente
import { useState } from 'react';
export const validators = {
  // Validar email
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'El email es requerido';
    if (!emailRegex.test(email)) return 'Formato de email inválido';
    return null;
  },

  // Validar teléfono
  phone: (phone) => {
    if (!phone) return null; // Campo opcional
    const phoneRegex = /^[+]?[0-9\s-()]{10,20}$/;
    if (!phoneRegex.test(phone)) return 'Formato de teléfono inválido';
    return null;
  },

  // Validar fechas
  checkInOut: (checkIn, checkOut) => {
    if (!checkIn) return 'La fecha de entrada es requerida';
    if (!checkOut) return 'La fecha de salida es requerida';
    
    // Usar fechas locales para evitar problemas de zona horaria
    const today = new Date();
    const todayString = today.getFullYear() + '-' + 
      String(today.getMonth() + 1).padStart(2, '0') + '-' + 
      String(today.getDate()).padStart(2, '0');
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const todayDate = new Date(todayString);
    
    if (checkInDate < todayDate) return 'La fecha de entrada no puede ser en el pasado';
    if (checkOutDate <= checkInDate) return 'La fecha de salida debe ser posterior a la de entrada';
    
    // Validar duración máxima (30 días)
    const maxDuration = 30 * 24 * 60 * 60 * 1000;
    if (checkOutDate - checkInDate > maxDuration) {
      return 'La duración máxima de estadía es de 30 días';
    }
    
    return null;
  },

  // Validar número de habitación
  roomNumber: (roomNumber) => {
    if (!roomNumber) return 'El número de habitación es requerido';
    const num = parseInt(roomNumber);
    if (isNaN(num) || num < 1 || num > 9999) {
      return 'Número de habitación inválido (1-9999)';
    }
    return null;
  },

  // Validar número de huéspedes
  guests: (guests) => {
    if (!guests) return 'El número de huéspedes es requerido';
    const num = parseInt(guests);
    if (isNaN(num) || num < 1 || num > 10) {
      return 'Número de huéspedes inválido (1-10)';
    }
    return null;
  },

  // Validar nombre
  name: (name, fieldName = 'nombre') => {
    if (!name || name.trim().length === 0) return `El ${fieldName} es requerido`;
    if (name.trim().length < 2) return `El ${fieldName} debe tener al menos 2 caracteres`;
    if (name.trim().length > 50) return `El ${fieldName} no puede tener más de 50 caracteres`;
    return null;
  },

  // Validar precio
  price: (price) => {
    if (!price) return 'El precio es requerido';
    const num = parseFloat(price);
    if (isNaN(num) || num <= 0) return 'El precio debe ser un número positivo';
    if (num > 999999) return 'El precio es demasiado alto';
    return null;
  },

  // Validar piso
  floor: (floor) => {
    if (!floor) return 'El piso es requerido';
    const num = parseInt(floor);
    if (isNaN(num) || num < 1 || num > 50) return 'Piso inválido (1-50)';
    return null;
  },

  // Validar capacidad
  capacity: (capacity) => {
    if (!capacity) return 'La capacidad es requerida';
    const num = parseInt(capacity);
    if (isNaN(num) || num < 1 || num > 10) return 'Capacidad inválida (1-10)';
    return null;
  },

  // Validar contraseña
  password: (password) => {
    if (!password) return 'La contraseña es requerida';
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[@$!%*?&]/.test(password);
    
    if (!hasLower) return 'La contraseña debe contener al menos una minúscula';
    if (!hasUpper) return 'La contraseña debe contener al menos una mayúscula';
    if (!hasNumber) return 'La contraseña debe contener al menos un número';
    if (!hasSymbol) return 'La contraseña debe contener al menos un símbolo (@$!%*?&)';
    
    return null;
  },

  // Validar confirmación de contraseña
  confirmPassword: (confirmPassword, originalPassword) => {
    if (!confirmPassword) return 'La confirmación de contraseña es requerida';
    if (confirmPassword !== originalPassword) return 'Las contraseñas no coinciden';
    return null;
  },

  // Validar URL
  url: (url) => {
    if (!url) return null; // Campo opcional
    try {
      new URL(url);
      return null;
    } catch {
      return 'URL inválida';
    }
  },

  // Validar código postal
  zipCode: (zipCode) => {
    if (!zipCode) return null; // Campo opcional
    const zipRegex = /^\d{4,5}$/;
    if (!zipRegex.test(zipCode)) return 'Código postal inválido (4-5 dígitos)';
    return null;
  },

  // Validar documento de identidad
  documentId: (documentId) => {
    if (!documentId) return 'El documento de identidad es requerido';
    // Remover espacios y guiones
    const cleanId = documentId.replace(/[\s-]/g, '');
    if (cleanId.length < 7 || cleanId.length > 12) {
      return 'Documento de identidad inválido (7-12 caracteres)';
    }
    return null;
  }
};

// Hook personalizado para validación de formularios mejorado
export const useFormValidation = (initialState, validationRules) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    if (validationRules[name]) {
      // Pasar todos los valores para validaciones que dependen de otros campos
      return validationRules[name](value, values);
    }
    return null;
  };

  const validateAll = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));
    
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({ ...prev, [name]: newValue }));
    
    // Validar campo individual si ya fue tocado
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const reset = () => {
    setValues(initialState);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Revalidar si el campo ya fue tocado
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Función helper para manejar submit de formularios
  const handleSubmit = async (submitFunction) => {
    setIsSubmitting(true);
    const isValid = validateAll();
    
    if (isValid) {
      try {
        await submitFunction(values);
      } catch (error) {
        console.error('Error en submit:', error);
      }
    }
    
    setIsSubmitting(false);
    return isValid;
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    setValues,
    setValue,
    handleSubmit,
    hasErrors: Object.keys(errors).some(key => errors[key]),
    isValid: Object.keys(validationRules).every(key => !validateField(key, values[key]))
  };
};

// Utilidades adicionales para validación
export const validationUtils = {
  // Crear reglas de validación comunes para formularios
  createReservationRules: () => ({
    name: validators.name,
    email: validators.email,
    phone: validators.phone,
    checkIn: (value, allValues) => validators.checkInOut(value, allValues.checkOut),
    checkOut: (value, allValues) => validators.checkInOut(allValues.checkIn, value),
    guests: validators.guests,
    roomNumber: validators.roomNumber
  }),

  createRoomRules: () => ({
    number: validators.roomNumber,
    type: validators.name,
    price: validators.price,
    floor: validators.floor,
    capacity: validators.capacity
  }),

  createUserRules: () => ({
    email: validators.email,
    password: validators.password,
    name: validators.name,
    phone: validators.phone
  }),

  createGuestRules: () => ({
    name: validators.name,
    email: validators.email,
    phone: validators.phone,
    documentId: validators.documentId
  }),

  // Validar múltiples campos a la vez
  validateMultiple: (values, rules) => {
    const errors = {};
    Object.keys(rules).forEach(field => {
      if (rules[field] && values[field] !== undefined) {
        const error = rules[field](values[field], values);
        if (error) errors[field] = error;
      }
    });
    return errors;
  },

  // Limpiar valores de formulario
  sanitizeFormData: (data) => {
    const sanitized = {};
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'string') {
        sanitized[key] = data[key].trim();
      } else {
        sanitized[key] = data[key];
      }
    });
    return sanitized;
  }
};

// Export por defecto
export default {
  validators,
  useFormValidation,
  validationUtils
};
