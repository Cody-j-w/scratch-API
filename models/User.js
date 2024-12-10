const { Model } = require('objection');

class User extends Model {
    static get tableName() {
        return 'users';
    }

    static get relationMappings() {
        const Recipe = require('./Recipe');
        return {
            recipes: {
                relation: Model.ManyToManyRelation,
                modelClass: Recipe,
                join: {
                    from: 'users.id',
                    through: {
                        from: 'users_recipes.userId',
                        to: 'users_recipes.recipeId'
                    },
                    to: 'recipes.id'
                }
            }
        }
    }
}

module.exports = User;