const { Model } = require('objection');

class Region extends Model {
    static get tableName() {
        return 'regions';
    }

    static get relationMappings() {
        const Recipe = require('./Recipe');

        return {
            recipes: {
                relation: Model.HasManyRelation,
                modelClass: Recipe,
                join: {
                    from: 'regions.id',
                    to: 'recipes.regionId'
                }
            }
        }
    }
}

module.exports = Region;