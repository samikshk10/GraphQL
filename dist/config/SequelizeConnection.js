"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sequelize/core");
const dbConfig_js_1 = __importDefault(require("./dbConfig.js"));
const { username, password, database, host, dialect, port } = dbConfig_js_1.default.development;
const sequelize = new core_1.Sequelize(database, username, password, {
    host: host,
    port: +port,
    dialect: dialect,
});
exports.default = sequelize;
