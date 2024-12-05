// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'pass',
      database: 'recipes_api'
    }
  },

  staging: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'pass',
      database: 'recipes_api'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'pass',
      database: 'recipes_api'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
