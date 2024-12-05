// Routes

// Search Recipes by Ingredients
app.get('/recipes/search', async (req, res) => {
  const { ingredients, country } = req.query;
  try {
      const ingredientList = ingredients.split(',').map((item) => item.trim());
      let query = Recipe.query().withGraphFetched('ingredients');

      if (country) {
          query = query.where('country', country);
      }

      const recipes = await query
          .whereExists(
              Recipe.relatedQuery('ingredients')
                  .whereIn('name', ingredientList)
          );

      res.json({ recipes });
  } catch (error) {
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
app.get('/countries', async (req, res) => {
  try {
      const countries = await Country.query().select('name');
      res.json({ countries });
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch countries.' });
  }
});

// Fetch Recipes by Country
app.get('/recipes/country/:country', async (req, res) => {
  try {
      const recipes = await Recipe.query().where('country', req.params.country);
      res.json({ recipes });
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch recipes.' });
  }
});
