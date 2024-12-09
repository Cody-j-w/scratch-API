const express = require('express');
const Region = require('./models/Region');
const Recipe = require('./models/Recipe');
const Ingredient = require('./models/Ingredient');
const app = express.Router();

app.get('/', (req, res) => {
  res.send('Welcome to the API! Visit /api-docs for Swagger documentation.');
});

/**
 * @swagger
 * /recipes/search:
 *   get:
 *     summary: Search for recipes
 *     description: Retrieve recipes by ingredients and optional region filter.
 *     parameters:
 *       - in: query
 *         name: ingredients
 *         schema:
 *           type: string
 *         required: true
 *         description: Comma-separated list of ingredients.
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter recipes by region.
 *     responses:
 *       200:
 *         description: A list of recipes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 query:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 */
app.get('/recipes/search', async (req, res) => {
  const { ingredients, region } = req.query;
  try {
    const ingredientList = ingredients.split(',').map((item) => item.trim());
    let query;
    if (region) {
      let regionQuery = await Region.query().where('name', region);
      query = await regionQuery[0].$relatedQuery('recipes').withGraphFetched('ingredients')
        .whereExists(Recipe.relatedQuery('ingredients').whereIn('name', ingredientList));
      res.json({ query });
    } else {
      query = Recipe.query().withGraphFetched('ingredients');
      const recipes = await query.whereExists(
        Recipe.relatedQuery('ingredients').whereIn('name', ingredientList)
      );
      res.json({ recipes });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch recipes.' });
  }
});

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Fetch a recipe by ID
 *     description: Retrieve a recipe's details and ingredients using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The recipe ID.
 *     responses:
 *       200:
 *         description: Recipe details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found.
 */
app.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.query().findById(req.params.id).withGraphFetched('ingredients');
    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ error: 'Recipe not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipe.' });
  }
});

/**
 * @swagger
 * /regions:
 *   get:
 *     summary: List all regions
 *     description: Retrieve a list of all available regions.
 *     responses:
 *       200:
 *         description: A list of regions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 regions:
 *                   type: array
 *                   items:
 *                     type: string
 */
app.get('/regions', async (req, res) => {
  try {
    const regions = await Region.query().select('name');
    res.json({ regions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch regions.' });
  }
});

/**
 * @swagger
 * /recipes/region/{region}:
 *   get:
 *     summary: Fetch recipes by region
 *     description: Retrieve recipes that belong to a specific region.
 *     parameters:
 *       - in: path
 *         name: region
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the region.
 *     responses:
 *       200:
 *         description: A list of recipes for the region.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 */
app.get('/recipes/region/:region', async (req, res) => {
  try {
    let regionQuery = await Region.query().where('name', req.params.region);
    let recipes = await regionQuery[0].$relatedQuery('recipes').withGraphFetched('ingredients');

    res.json({ recipes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch recipes.' });
  }
});

module.exports = app;
