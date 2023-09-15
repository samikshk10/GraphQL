"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql
scalar Date
type User {
    id: ID
    firstName:String
    lastName: String
    email:String
    createdAt: Date
    updatedAt: Date
    message: String
    token: String
}

type Product{
    id:ID
    name: String
    price: Int
    category: String
    user_id: Int
    createdAt: Date
    updatedAt: Date
}

type Response {
    data:Product
    message: String
}

type Query{
    users: [User]
    getallproduct: [Product]
    getproduct:[Product]
}


input SignUpUserInput{
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    confirmPassword: String!

}

input LoginUserInput{
    email: String!
    password: String!
}


input AddProductInput{
  name: String!
  price: Int!
  category: String!
}



input DeleteProductInput{
    id: ID!
}


type Mutation{
    signup(input: SignUpUserInput):User
    login(input: LoginUserInput):User

    addproduct(input: AddProductInput):Response
    deleteproduct(input: DeleteProductInput): Response
}
`;
