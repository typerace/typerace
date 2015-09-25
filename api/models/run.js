"use strict";
module.exports = function (sequelize, DataTypes) {
    var run = sequelize.define("run", {
        started: DataTypes.DATE,
        finished: DataTypes.DATE,
        progress: DataTypes.STRING,
    }, {
        paranoid: true, // use deleted-at
        underscored: true, // don"t camelcase
        tableName: "runs",
        classMethods: {
            associate: function (model) {
                run.belongsTo(model.user);
                run.belongsTo(model.race);
                run.belongsTo(model.text);
            },
        },
    });

    return run;
};
