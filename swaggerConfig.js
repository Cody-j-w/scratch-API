const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Around the World Cuisine API',
      version: '1.0.0',
      description: 'An API to search for recipes by ingredients and region',
    },
    servers: [
      { url: 'http://localhost:5000' },
    ],
  },
  apis: ['./server.js'],
};

const swaggerSpecs = swaggerJsdoc(options);
module.exports = swaggerSpecs;
