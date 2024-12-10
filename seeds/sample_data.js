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
    {name: 'oil'},
    {name: 'potato'},
    {name: 'cheese'},
    {name: 'chile'},
    {name: 'cabbage'},
    {name: 'meat'},
    {name: 'onion'},
    {name: 'lime'},
    {name: 'stock'},
    {name: 'milk'},
    {name: 'flour'},
    {name: 'salt'},
    {name: 'sugar'},
    {name: 'celery'},
    {name: 'carrot'},
    {name: 'butter'}
    
  ]);
  await knex('regions').del()
  await knex('regions').insert([
    {name: 'Italy'},
    {name: 'Korea'},
    {name: 'Mexico'},
    {name: 'Canada'},
    {name: 'France'}
  ]);
  await knex('recipes').del()
  await knex('recipes').insert([
    {name: 'Marinara', directions: 'make some sauce', regionId: 1},
    {name: 'Salsa Roja', directions: 'Deseed and toast smoked chile, char other vegetables, blend chiles and vegetables with oil and lime juice, add salt', regionId: 3},
    {name: 'Bolognese', directions: 'Prepare marinara sauce. Chop vegetables and saute. Add meat to vegetables and let cook. Add marinara, and let simmer.', regionId: 1},
    {name: 'Bechamel', directions: 'Melt butter, add flour and whisk until smooth, and cook until lightly browned. Add milk and whisk, then let simmer. Add salt to taste.', regionId: 5}
  ]);
  await knex('recipes_ingredients').del()
  await knex('recipes_ingredients').insert([
    {recipeId: 1, ingredientId: 1},
    {recipeId: 1, ingredientId: 2},
    {recipeId: 1, ingredientId: 3},
    {recipeId: 1, ingredientId: 4},
    {recipeId: 2, ingredientId: 1},
    {recipeId: 2, ingredientId: 3},
    {recipeId: 2, ingredientId: 4},
    {recipeId: 2, ingredientId: 7},
    {recipeId: 2, ingredientId: 10},
    {recipeId: 2, ingredientId: 11},
    {recipeId: 3, ingredientId: 1},
    {recipeId: 3, ingredientId: 2},
    {recipeId: 3, ingredientId: 3},
    {recipeId: 3, ingredientId: 4},
    {recipeId: 3, ingredientId: 9},
    {recipeId: 3, ingredientId: 10},
    {recipeId: 3, ingredientId: 17},
    {recipeId: 3, ingredientId: 18},
    {recipeId: 4, ingredientId: 19},
    {recipeId: 4, ingredientId: 14},
    {recipeId: 4, ingredientId: 13},
    {recipeId: 4, ingredientId: 15},
  ]);
};
