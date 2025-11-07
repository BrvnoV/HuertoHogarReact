// karma.conf.cjs
module.exports = function(config) {
  config.set({

    // 1. Frameworks de prueba
    frameworks: ['jasmine'],

    // 2. Plugins a cargar
    // Le dice a Karma qué herramientas usar.
    plugins: [
      'karma-vite',
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-jasmine-html-reporter' // El que acabamos de instalar
    ],

    // 3. Archivos de prueba
    // Le decimos que cargue TODOS los archivos de prueba
    files: [
      { pattern: 'src/**/*.spec.ts', type: 'module' },
      { pattern: 'src/**/*.spec.tsx', type: 'module' }
    ],

    // 4. Preprocesadores
    // Le dice a Karma que use 'vite' para procesar
    // nuestros archivos de React/TS.
    preprocessors: {
      'src/**/*.spec.ts': ['vite'],
      'src/**/*.spec.tsx': ['vite']
    },

    // 5. Reporteros
    // Cómo queremos ver los resultados
    reporters: ['progress', 'kjhtml'], // 'progress' (en la terminal) y 'kjhtml' (en el HTML)

    // 6. Navegador
    browsers: ['Chrome'],

    // 7. Configuración de Auto-Watch (para desarrollar)
    autoWatch: true,
    singleRun: false,

    // Configuración para el reporter HTML
    client: {
      clearContext: false // Muestra los resultados en el navegador
    },
    
    // Configuración de Vite (generalmente no se necesita más)
    vite: {
      // (configuraciones de Vite aquí)
    },
  });
};