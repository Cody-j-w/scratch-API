const express = require('express');
const Region = require('./models/Region');
const Recipe = require('./models/Recipe');
const Ingredient = require('./models/Ingredient');
const User = require('./models/User');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const app = express.Router();

// Routes

// Search Recipes by Ingredients
app.get('/recipes/search', async (req, res) => {
  const { ingredients, region } = req.query;
  try {
      const ingredientList = ingredients.split(',').map((item) => item.trim());
      let query;
      if (region) {
        let regionQuery = await Region.query().where('name', region);
        query = await regionQuery[0].$relatedQuery('recipes').withGraphFetched('ingredients')
        .whereExists(Recipe.relatedQuery('ingredients').whereIn('name', ingredientList));
        res.json({ query })
      } else {
        query = Recipe.query().withGraphFetched('ingredients');
        const recipes = await query
          .whereExists(
              Recipe.relatedQuery('ingredients')
                  .whereIn('name', ingredientList)
          );
          res.json({ recipes });
      }
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to fetch recipes.' });
  }
});

// Fetch Recipe by ID
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

// List All Countries
app.get('/regions', async (req, res) => {
  try {
      const regions = await Region.query().select('name');
      res.json({ regions });
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch regions.' });
  }
});

// Fetch Recipes by Region
app.get('/recipes/region/:region', async (req, res) => {
  try {
    let regionQuery = await Region.query().where('name', req.params.region);
    let recipes = await regionQuery[0].$relatedQuery('recipes').withGraphFetched('ingredients')

      res.json({ recipes });
  } catch (error) {
      console.log(error);

      res.status(500).json({ error: 'Failed to fetch recipes.' });
  }
});

app.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        res.status(400).json({error: 'Please provide both a username and a password'});
    }
    console.log(username + ' ' + password);
    const testQuery = await User.query().select('username').where('username', username);
    if (testQuery.length > 0) {
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
                res.status(200).json({success: `welcome ${newUser.username}!`});
            });
        })
    }
});

app.post('/login', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        res.status(400).json({error: 'Please provide both a username and a password'});
    }
    const userCheck = await User.query().where('username', username);
    bcrypt.compare(password, userCheck.password, (err, result) => {
        if (result) {
            req.session.auth = userCheck.auth;
            res.status(200).json({success: `you are now logged in, ${userCheck.username}`})
        } else {
            res.status(400).json({error: 'invalid login information'});
        }
    })
})
module.exports = app;