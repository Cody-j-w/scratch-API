const Ingredient = require("../models/Ingredient");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('ingredients').del()
  await knex('ingredients').insert([
    {name: 'tomato'},
    {name: 'basil'},
    {name: 'garlic'},
    {name: 'olive oil'}
  ]);
  await knex('regions').del()
  await knex('regions').insert([
    {name: 'Italy'}
  ]);
  await knex('recipes').del()
  await knex('recipes').insert([
    {name: 'Marinara', directions: 'make some sauce', regionId: 1}
  ]);
  await knex('recipes_ingredients').del()
  await knex('recipes_ingredients').insert([
    {recipeId: 1, ingredientId: 1},
    {recipeId: 1, ingredientId: 2},
    {recipeId: 1, ingredientId: 3},
    {recipeId: 1, ingredientId: 4}
  ]);
};
