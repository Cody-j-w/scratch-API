const { Model } = require('objection');

class Ingredient extends Model {
    static get tableName() {
        return 'ingredients';
    }

    static get relationMappings() {
        const Recipe = require('./Recipe');
        return {
            recipes: {
                relation: Model.ManyToManyRelation,
                modelClass: Recipe,
                join: {
                    from: 'ingredients.id',
                    through: {
                        from: 'recipes_ingredients.ingredientId',
                        to: 'recipes_ingredients.recipeId'
                    },
                    to: 'recipes.id'
                }
            }
        }
    }
}

module.exports = Ingredient;