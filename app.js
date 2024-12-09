const express = require('express');
const app = express();
const Knex = require('knex');
const knexConfig = require('./knexfile');
const { Model, ForeignKeyValidationError, ValidationError } = require('objection');

const knex = Knex(knexConfig.development);

Model.knex(knex);

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded());

const routes = require('./server');
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});