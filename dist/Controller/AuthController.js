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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.Login = exports.SignUp = exports.getUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const graphql_1 = require("graphql");
const models_1 = require("../models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield models_1.User.findAll();
        if (users.length <= 0) {
            throw new graphql_1.GraphQLError("No User Found", {
                extensions: {
                    code: "NO_USER",
                    http: {
                        status: 400,
                    },
                },
            });
        }
        return users;
    }
    catch (error) {
        throw new graphql_1.GraphQLError(error.message || "Internal Server Error", {
            extensions: {
                code: "FAILED ",
                http: {
                    status: 400,
                },
            },
        });
    }
});
exports.getUsers = getUsers;
//Sign Up
const SignUp = (parents, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, confirmPassword } = args.input;
    if (password.length < 8 || confirmPassword.length < 8) {
        throw new graphql_1.GraphQLError("The password must be of at least 8 characters", {
            extensions: {
                code: "INVALID_PASSWORD_FORMAT",
                http: {
                    status: 401,
                },
            },
        });
    }
    if (password !== confirmPassword) {
        throw new graphql_1.GraphQLError(`Password doesn't match with confirm password`, {
            extensions: {
                code: "INVALID_CPASSWORD",
                http: {
                    status: 409,
                },
            },
        });
    }
    try {
        const userFind = yield models_1.User.findOne({ where: { email: email } });
        if (userFind !== null) {
            throw new graphql_1.GraphQLError(`User ${email} already exists`, {
                extensions: {
                    code: "EMAIL_EXISTS",
                    http: {
                        status: 409,
                    },
                },
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 12);
        const newUser = yield models_1.User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        return Object.assign(Object.assign({}, newUser.dataValues), { message: "Sign up Successfully" });
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.SignUp = SignUp;
// Login
const Login = (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = args.input;
    if (password.length < 8) {
        // throw new Error("The password must be of at least 8 characters");
        throw new graphql_1.GraphQLError("The password must be of at least 8 characters", {
            extensions: {
                code: "INVALID_PASSWORD_FORMAT",
            },
        });
    }
    try {
        const userFind = yield models_1.User.findOne({ where: { email: email } });
        if (!userFind) {
            throw new graphql_1.GraphQLError(`User ${email} not found`, {
                extensions: {
                    code: "EMAIL_NOT_FOUND",
                },
            });
        }
        const isValidPassword = yield bcrypt_1.default.compare(password.toString(), userFind.dataValues.password);
        if (!isValidPassword) {
            throw new graphql_1.GraphQLError("Incorrect Email or Password", {
                extensions: {
                    code: "INCORRECT_EMAIL_PASSWORD",
                },
            });
        }
        const payload = {
            firstName: userFind.dataValues.firstName,
            lastName: userFind.dataValues.lastName,
            id: userFind.dataValues.id,
            email: userFind.dataValues.email,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return Object.assign(Object.assign({}, userFind.dataValues), { token, message: "Login Successfully" });
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.Login = Login;
const authenticate = (bearerToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = bearerToken.split("Bearer ")[1];
        if (token) {
            try {
                const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                if (user) {
                    return {
                        user,
                        token,
                    };
                }
                throw new graphql_1.GraphQLError("User not found", {
                    extensions: {
                        code: "UNAUTHORIZED",
                        http: { status: 402 },
                    },
                });
            }
            catch (error) {
                throw new Error("Invalid or Expired token");
            }
        }
        else {
            throw new Error("Authorization token must be 'Bearer [token]'");
        }
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.authenticate = authenticate;
