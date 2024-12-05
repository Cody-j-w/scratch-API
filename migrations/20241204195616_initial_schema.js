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
