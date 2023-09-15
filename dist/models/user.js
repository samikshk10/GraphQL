"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sequelize/core");
const config_1 = require("../config");
const User = config_1.sequelize.define("User", {
    id: {
        type: core_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: core_1.DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: core_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: core_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: core_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
    // paranoid: true,
});
exports.default = User;
