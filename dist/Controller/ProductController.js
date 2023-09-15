"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteProduct = exports.AddProduct = exports.GetProduct = exports.GetAllProduct = void 0;
const graphql_1 = require("graphql");
const models_1 = require("../models");
const AuthController_1 = require("./AuthController");
const GetAllProduct = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getProduct = yield models_1.Product.findAll();
        if (!getProduct) {
            throw new graphql_1.GraphQLError(`Product not found`, {
                extensions: {
                    code: "NO_PRODUCT_FOUND",
                    http: {
                        status: 400,
                    },
                },
            });
        }
        return getProduct;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.GetAllProduct = GetAllProduct;
const GetProduct = (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!(context === null || context === void 0 ? void 0 : context.token)) {
            throw new Error("Authorization Token Missing");
        }
        const tokenData = (yield (0, AuthController_1.authenticate)(context === null || context === void 0 ? void 0 : context.token));
        if (tokenData === null || tokenData === void 0 ? void 0 : tokenData.user) {
            const getProduct = yield models_1.Product.findAll({
                where: { user_id: (_a = tokenData === null || tokenData === void 0 ? void 0 : tokenData.user) === null || _a === void 0 ? void 0 : _a.id },
            });
            if (getProduct.length <= 0) {
                throw new graphql_1.GraphQLError("There are no Product for current User", {
                    extensions: {
                        code: "NO_PRODUCT_FOUND",
                        http: { status: 400 },
                    },
                });
            }
            return getProduct;
        }
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.GetProduct = GetProduct;
const AddProduct = (parents, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { name, price, category } = args.input;
    if (!(context === null || context === void 0 ? void 0 : context.token)) {
        throw new Error("Authorization Token missing");
    }
    const tokenData = (yield (0, AuthController_1.authenticate)(context === null || context === void 0 ? void 0 : context.token));
    try {
        const newUser = yield models_1.Product.create({
            name,
            price,
            user_id: (_b = tokenData === null || tokenData === void 0 ? void 0 : tokenData.user) === null || _b === void 0 ? void 0 : _b.id,
            category,
        });
        return {
            message: "Product added successfully",
            data: newUser,
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.AddProduct = AddProduct;
const DeleteProduct = (parents, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { id } = args.input;
    if (!(context === null || context === void 0 ? void 0 : context.token)) {
        throw new Error("Authorization Token missing");
    }
    const tokenData = (yield (0, AuthController_1.authenticate)(context === null || context === void 0 ? void 0 : context.token));
    try {
        const ProductDetails = yield models_1.Product.findOne({ where: { id } });
        if (ProductDetails == null) {
            throw new Error("Product Not Found");
        }
        if (((_c = tokenData === null || tokenData === void 0 ? void 0 : tokenData.user) === null || _c === void 0 ? void 0 : _c.id) !== ProductDetails.user_id) {
            throw new graphql_1.GraphQLError("Unauthorized User", {
                extensions: {
                    code: "UNAUTHORIZED",
                    http: { status: 401 },
                },
            });
        }
        yield ProductDetails.destroy();
        console.log(ProductDetails);
        return {
            message: "Product Deleted successfully",
            data: ProductDetails,
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.DeleteProduct = DeleteProduct;
