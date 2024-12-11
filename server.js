const express = require('express');
const Region = require('./models/Region');
const Recipe = require('./models/Recipe');
const Ingredient = require('./models/Ingredient');
const User = require('./models/User');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const app = express.Router();
const winston = require('winston');

const logger = new winston.Logger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()),
    transports: [
        new (winston.transports.File)({
            name: 'info-log',
            filename: 'info.log',
            level: 'info',

        }),
        new (winston.transports.File)({
            name: 'error-log',
            filename: 'error.log',
            level: 'error'
        }),
        new (winston.transports.File)({
            name: 'warn-log',
            filename: 'warn.log',
            level: 'warn'
        })
    ]
});


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
 *       - in: query
 *         name: exclusive
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Set whether or not you want recipes that only include ingredients included in the ingredients parameter
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
    // TODO: add ability to make ingredients list inclusive or exclusive
  const { ingredients, region } = req.query;
  try {
    const ingredientList = ingredients.split(',').map((item) => item.trim());
    logger.log('info', `Endpoint '/recipes/search' hit with following query params: ingredients: ${ingredientList}, region: ${region}`);
    if (region) {
      let regionQuery = await Region.query().where('name', region);
      const recipes = await regionQuery[0].$relatedQuery('recipes').withGraphFetched('ingredients')
        .whereExists(Recipe.relatedQuery('ingredients').whereIn('name', ingredientList));
      let recipeList = [];
      if (Boolean(req.query.exclusive) === true) {
        for (const doc of recipes) {
            console.log(doc)
            let ingredientFlag = 0;
            for (const ingredient of doc.ingredients) {
                if (!(ingredientList.includes(ingredient.name))) {
                    console.log(`Missing ingredient! ${ingredient.name}`)
                    ingredientFlag = 1;
                }
            }
            if (ingredientFlag == 0) {
                recipeList.push(doc);
            }
        }
        logger.log('info', `query successful - '/recipes/search with region, ingredient list exclusive`)
        res.json({ recipeList });
      } else {
        logger.log('info', `query successful - '/recipes/search with region, igredient list not exclusive`)
        res.json({ recipes });
      }
    } else {
      query = Recipe.query().withGraphFetched('ingredients');
      const recipes = await query.whereExists(
        Recipe.relatedQuery('ingredients').whereIn('name', ingredientList)
      );
      let recipeList = [];
      if (req.query.exclusive === 'true') {
        for (const doc of recipes) {
            console.log(doc)
            let ingredientFlag = 0;
            for (const ingredient of doc.ingredients) {
                if (!(ingredientList.includes(ingredient.name))) {
                    console.log(`Missing ingredient! ${ingredient.name}`)
                    ingredientFlag = 1;
                }
            }
            if (ingredientFlag == 0) {
                recipeList.push(doc);
            }
        }
        logger.log('info', `query successful - '/recipes/search without region, ingredient list exclusive`)
        res.json({ recipeList });
      } else {
        logger.log('info', `query successful - '/recipes/search without region, ingredient list not exclusive`)
        res.json({ recipes });
      }
    }
  } catch (error) {
    logger.log('error', `Request of endpoint '/recipes/search' failed with following error: ${error} using the following query params: ingredients: ${req.query.ingredients}, region: ${req.query.region}`)
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
    logger.log('info', `Endpoint '/recipes/:id' hit with param ${req.params.id}`);
  try {
    const recipe = await Recipe.query().findById(req.params.id).withGraphFetched('ingredients');
    if (recipe) {
        logger.log('info', `request of endpoint '/recipes/:id' successful`);
      res.json(recipe);
    } else {
        logger.log('info', `request not endpoint '/recipes/:id' failed - no recipe found with id ${req.params.id}`);
      res.status(404).json({ error: 'Recipe not found.' });
    }
  } catch (error) {
    logger.log('error', `Endpoint '/recipes/:id with param ${req.params.id} encountered the following error: ${error}`);
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
    logger.log('info', `Endpoint '/regions hit`)
  try {
    const regions = await Region.query().select('name');
    logger.log('info', `request of endpoint '/regions' successful`)
    res.json({ regions });
  } catch (error) {
    logger.log('error', `Endpoint '/regions' failed with error ${error}`)
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
    logger.log('info', `Endpoint '/recipes/region/:region hit with region ${req.params.region}`)
  try {
    let regionQuery = await Region.query().where('name', req.params.region);
    let recipes = await regionQuery[0].$relatedQuery('recipes').withGraphFetched('ingredients');
    logger.log('info', `query successful - Endpoint '/recipes/region/:region' with param ${req.params.region}`);
    res.json({ recipes });
  } catch (error) {
    logger.log('info', `Endpoint '/recipes/region/:region encountered error ${error} with region ${req.params.region}`);
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch recipes.' });
  }
});

app.post('/signup', async (req, res) => {
    logger.log(`Endpoint '/signup' hit`);
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        logger.log('error', `request of endpoint '/signup' failed`);
        res.status(400).json({error: 'Please provide both a username and a password'});
    }
    console.log(username + ' ' + password);
    const testQuery = await User.query().select('username').where('username', username);
    if (testQuery.length > 0) {
        logger.log('error', `request of endpoint '/signup' failed - user already exists`);
        res.status(400).json({error: 'user already exists'});
    } else {
        const newAuth = crypto.randomUUID();
        bcrypt.genSalt(10, async (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                const newUser = await User.query().insert({
                    username: username,
                    password: hash,
                    auth: newAuth
                });
                logger.log('info', `new user created: ${newUser.username}`);
                req.session.auth = newUser.auth;
                res.status(200).json({success: `welcome ${newUser.username}!`});
            });
        })
    }
});

app.post('/login', async (req, res) => {
    logger.log('info', `Endpoint '/login' hit`);
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        logger.log('error', `request of endpoint '/login' failed`);
        res.status(400).json({error: 'Please provide both a username and a password'});
    }
    const userCheck = await User.query().where('username', username);
    bcrypt.compare(password, userCheck[0].password, (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result) {
            logger.log('info', `user ${userCheck[0].auth} logged in`);
            req.session.auth = userCheck[0].auth;
            res.status(200).json({success: `you are now logged in, ${userCheck[0].username}`});
        } else {
            logger.log('info', `login attempt failed`);
            res.status(400).json({error: 'invalid login information'});
        }
    })
});

app.put('/favorite', async (req, res) => {
    logger.log('info', `Endpoint '/favorite' hit`);
    if (!req.session.auth) {
        logger.log('info', `Endpoint '/favorite' hit while not logged in`);
        res.status(400).json({error: 'please log in to favorite a recipe'});
    }
    const user = await User.query().where('auth', req.session.auth).withGraphFetched('recipes');
    const recipe = await Recipe.query().findById(req.body.recipeId);
    await user[0].$relatedQuery('recipes').relate(recipe);
    logger.log('info', `Endpoint '/favorite' successfully hit`);
    res.json({'success': `${recipe.name} added to favorites`});
});

app.get('/favorites', async (req, res) => {
    logger.log('info', `Endpoint '/favorites' hit`)
    if (!req.session.auth) {
        logger.log('info', `Endpoint '/favorites' hit while not logged in`);
        res.status(400).json({error: 'please log in to view your favorites'});
    }
    const user = await User.query().where('auth', req.session.auth);
    const recipes = await user[0].$relatedQuery('recipes').withGraphFetched('ingredients');
    logger.log('info', `Endpoint '/favorites successfully hit`);
    res.json(recipes);
});

module.exports = app;
