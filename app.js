const express = require('express');
const app = express();
const Knex = require('knex');
const knexConfig = require('./knexfile');
const { Model, ForeignKeyValidationError, ValidationError } = require('objection');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swaggerConfig');

const knex = Knex(knexConfig.development);

Model.knex(knex);

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded());

const routes = require('./server');
app.use('/', routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
