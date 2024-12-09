const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Around the World Cuisine API',
      version: '1.0.0',
      description: 'An API to search for recipes by ingredients and region, list regions, and fetch recipe details.',
    },
    servers: [
      {
        url: 'http://localhost:5000', // Update with your server's URL if needed
        description: 'Local server',
      },
    ],
    components: {
      schemas: {
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
              description: 'The region this recipe belongs to.',
              example: 'Italy',
            },
          },
        },
        Region: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'The name of the region.',
              example: 'Italy',
            },
          },
        },
      },
    },
  },
  apis: ['./server.js'],
};

const swaggerSpecs = swaggerJsdoc(options);
module.exports = swaggerSpecs;
