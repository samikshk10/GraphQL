"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.dbConfig = void 0;
const dbConfig_js_1 = __importDefault(require("./dbConfig.js"));
exports.dbConfig = dbConfig_js_1.default;
const SequelizeConnection_js_1 = __importDefault(require("./SequelizeConnection.js"));
exports.sequelize = SequelizeConnection_js_1.default;
