// src/data/constants.spec.ts
import { isValidEmail } from './constants'; // Importamos la función que queremos probar

// "describe" agrupa un conjunto de pruebas (TestSuite)
// Esto es de Jasmine
describe('Pruebas de Funciones (constants.ts)', () => {

  // "it" define una prueba unitaria individual (Test Case)
  // Esto es de Jasmine
  it('isValidEmail debe validar los correos permitidos', () => {
    
    // "expect" es la verificación (Assertion)
    // Esto es de Jasmine
    expect(isValidEmail('test@duoc.cl')).toBeTrue();
    expect(isValidEmail('test@gmail.com')).toBeTrue();
    expect(isValidEmail('test@profesor.com')).toBeTrue();
  });

  it('isValidEmail debe rechazar correos no permitidos', () => {
    expect(isValidEmail('test@hotmail.com')).toBeFalse();
    expect(isValidEmail('test@duoc.com')).toBeFalse(); // Dominio incorrecto
    expect(isValidEmail('test')).toBeFalse(); // Sin @
  });

});