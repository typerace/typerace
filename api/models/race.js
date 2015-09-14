'use strict';
module.exports = function (sequelize, DataTypes) {
    var race = sequelize.define("race", {
        started: DataTypes.DATE,
        finished: DataTypes.DATE
    }, {
        paranoid: true, // use deleted-at
        underscored: true, // don't camelcase
        tableName: 'races',
        classMethods: {
            associate: function (model) {
                race.hasMany(model.run);
                race.belongsTo(model.text);
                race.belongsTo(model.user);
                race.belongsTo(model.user, {
                    as: 'winner',
                    foreignKey: 'winner_id'
                });
            }
        }
    });

    return race;
};