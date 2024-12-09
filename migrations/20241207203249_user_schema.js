/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('regions', (table) => {
    table.increments('id').primary()
    table.string('name')
  })
  .createTable('recipes', (table) => {
    table.increments('id').primary()
    table
    .integer('regionId')
    .unsigned()
    .references('id')
    .inTable('regions')
    .onDelete('SET NULL')
    .index()
    table.string('name')
    table.string('directions')
  })
  .createTable('ingredients', (table) => {
    table.increments('id').primary()
    table.string('name')
  })
  .createTable('recipes_ingredients', (table) => {
    table.increments('id').primary()
    table
    .integer('recipeId')
    .unsigned()
    .references('id')
    .inTable('recipes')
    .onDelete('CASCADE')
    .index()

    table
    .integer('ingredientId')
    .unsigned()
    .references('id')
    .inTable('ingredients')
    .onDelete('CASCADE')
    .index()
  })
  .createTable('users', (table) => {
    table.increments('id').primary()
    table.string('username')
    table.string('password')
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
