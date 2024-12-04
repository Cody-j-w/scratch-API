// Routes

// 1. Search Recipes by Ingredients
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
