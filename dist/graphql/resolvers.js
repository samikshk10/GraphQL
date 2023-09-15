"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const AuthController_1 = require("../Controller/AuthController");
const ProductController_1 = require("../Controller/ProductController");
exports.resolvers = {
    Query: {
        //User query
        users: AuthController_1.getUsers,
        //Product query
        getallproduct: ProductController_1.GetAllProduct,
        getproduct: ProductController_1.GetProduct,
    },
    Mutation: {
        //User Mutation
        signup: AuthController_1.SignUp,
        login: AuthController_1.Login,
        //product Mutation
        addproduct: ProductController_1.AddProduct,
        deleteproduct: ProductController_1.DeleteProduct,
    },
};
