const { Model } = require('objection');

class Recipe extends Model {
    static get tableName() {
        return 'recipes';
    }

    static get relationMappings() {
        const Ingredient = require('./Ingredient');
        const Region = require('./Region');
        const User = require('./User')

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

            users: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'recipes.id',
                    through: {
                        from: 'users_recipes.recipeId',
                        to: 'users_recipes.userId'
                    },
                    to: 'users.id'
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