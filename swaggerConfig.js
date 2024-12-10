const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Around the World Cuisine API',
      version: '1.0.0',
      description: 'An API to manage recipes, regions, and user accounts.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The unique ID of the user.',
              example: 1,
            },
            username: {
              type: 'string',
              description: 'The username of the user.',
              example: 'john_doe',
            },
            password: {
              type: 'string',
              description: 'The hashed password of the user.',
              example: '$2b$10$7q03WxN.KMs...',
            },
            auth: {
              type: 'string',
              description: 'The unique authentication token for the user session.',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
          },
        },
        Recipe: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The unique ID of the recipe.',
              example: 1,
            },
            name: {
              type: 'string',
              description: 'The name of the recipe.',
              example: 'Pasta Primavera',
            },
            ingredients: {
              type: 'array',
              items: {
                type: 'string',
                example: 'Tomatoes, Basil, Olive Oil',
              },
            },
            region: {
              type: 'string',
              description: 'The region the recipe belongs to.',
              example: 'Italy',
            },
          },
        },
      },
    },
  },
  apis: ['./server.js'], // Path to your route files with Swagger comments
};

const swaggerSpecs = swaggerJsdoc(options);
module.exports = swaggerSpecs;
