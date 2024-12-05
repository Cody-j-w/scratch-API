const { Model } = require('objection');

class Recipe extends Model {
    static get tableName() {
        return 'recipes';
    }

    static get relationMappings() {
        const Ingredient = require('./Ingredient');
        const Region = require('./Region');

        return {
            ingredients: {
                relation: Model.ManyToManyRelation,
                modelClass: Ingredient,
                join: {
                    from: 'recipes.id',
                    through: {
                        from: 'recipes_ingredients.recipeId',
                        to: 'recipes_ingredients.ingredientId'
                    },
                    to: 'ingredients.id'
                }
            },

            region: {
                relation: Model.BelongsToOneRelation,
                modelClass: Region,
                join: {
                    from: 'recipes.regionId',
                    to: 'regions.id'
                }
            }
        }
    }
}

module.exports = Recipe;