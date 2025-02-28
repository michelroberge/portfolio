const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const path = require('path');

// Load OpenAPI YAML file
const openApiDoc = yaml.load(path.join(__dirname, '../docs/openapi.yml'));

// Middleware to serve Swagger UI
const swaggerMiddleware = swaggerUi.serve;
const swaggerSetup = swaggerUi.setup(openApiDoc);

module.exports = { swaggerMiddleware, swaggerSetup };
