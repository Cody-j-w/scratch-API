/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('users', (table) => {
    table.increments('id').primary()
    table.string('username')
    table.string('password')
    table.string('auth')
  })
  .createTable('users_recipes', (table) => {
    table.increments('id').primary()
    table
    .integer('userId')
    .unsigned()
    .references('id')
    .inTable('users')
    .onDelete('CASCADE')
    .index()

    table
    .integer('recipeId')
    .unsigned()
    .references('id')
    .inTable('recipes')
    .onDelete('CASCADE')
    .index()
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('recipes_ingredients')
    .dropTableIfExists('regions')
    .dropTableIfExists('ingredients')
    .dropTableIfExists('recipes')
};
