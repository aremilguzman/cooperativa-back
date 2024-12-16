export default {
  transform: {
    "^.+\\.js$": "babel-jest", // Usa babel-jest para archivos JS
  },
  testEnvironment: "node", // Usa el entorno Node.js para pruebas
  setupFiles: ["<rootDir>/tests/setup.js"], // Configura setup.js
  verbose: true, // Proporciona más detalles durante las pruebas
};