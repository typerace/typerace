"use strict";
module.exports = function(sequelize, DataTypes) {
    var text = sequelize.define("text", {
        content: DataTypes.STRING,
        description: DataTypes.STRING,
        difficulty: DataTypes.INTEGER,
        wpm_avg: DataTypes.DECIMAL,
        wpm_top: DataTypes.DECIMAL,
        status: DataTypes.ENUM("hidden", "public"),
        source_name: DataTypes.STRING,
        source_author: DataTypes.STRING,
        source_link: DataTypes.STRING,
    }, {
        paranoid: true, // use deleted-at
        underscored: true, // don"t camelcase
        tableName: "texts",
        classMethods: {
            associate: function(model) {
                text.hasMany(model.race);
                text.hasMany(model.run);
                text.belongsTo(model.user);
                text.belongsTo(model.user, {
                    as: "koth",
                    foreignKey: "koth_id",
                });
            },
        },
    });

    return text;
};
