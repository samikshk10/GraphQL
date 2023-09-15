"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sequelize/core");
const config_1 = require("../config");
const Product = config_1.sequelize.define("Products", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: core_1.DataTypes.INTEGER,
    },
    name: {
        type: core_1.DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: core_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    category: {
        type: core_1.DataTypes.ENUM("Grocery", "Electronics", "Clothings", "Others"),
        defaultValue: "Others",
        allowNull: false,
    },
    user_id: {
        type: core_1.DataTypes.INTEGER,
        references: {
            table: "Users",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
    },
    createdAt: {
        allowNull: false,
        type: core_1.DataTypes.DATE,
    },
    updatedAt: {
        allowNull: false,
        type: core_1.DataTypes.DATE,
    },
}, {
    timestamps: true,
    // paranoid: true,
});
exports.default = Product;
