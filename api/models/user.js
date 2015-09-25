"use strict";
module.exports = function (sequelize, DataTypes) {
    var user = sequelize.define("user", {
        name: DataTypes.STRING,
        sessionkey: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        customer: DataTypes.STRING,
        location: DataTypes.STRING,
        dob: DataTypes.DATE,
        reset: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ip: DataTypes.STRING,
        useragent: DataTypes.STRING,
        wpm_avg: DataTypes.DECIMAL,
        wpm_top: DataTypes.DECIMAL,
        role: DataTypes.ENUM("user", "mod", "admin"),
        status: DataTypes.ENUM("normal", "banned", "premium"),
    }, {
        paranoid: true, // use deleted-at
        underscored: true, // don"t camelcase
        tableName: "users",
        classMethods: {
            associate: function (model) {
                user.hasMany(model.race);
                user.hasMany(model.text);
                user.hasMany(model.run);
                // Needs bindings for wins and held koth
            },
        },
    });

    return user;
};
