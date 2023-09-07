"use strict";
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const express = require("express");
const userList = require("./");
const app = express();
const typeDefs = `
  type UserType {
    id: ID
    name: String
    email: String
    message: String
  }

  type Query {
    users: [UserType]
    user(id: ID!): UserType
  }

  type Mutation {
    addUser(name: String!, email: String!): UserType
    deleteUser(id: ID!): UserType
    updateUser(id: ID!, name: String, email: String): UserType
  }
`;
// Define resolvers for Query and Mutation
const resolvers = {
    Query: {
        users: () => userList,
        user: (parent, args) => userList.find((user) => user.id === args.id),
    },
    Mutation: {
        addUser: (parent, args) => {
            const newUser = {
                name: args.name,
                email: args.email,
                id: Date.now().toString(),
            };
            userList.push(newUser);
            return {
                ...newUser,
                message: "user added successfully",
            };
        },
        deleteUser: (parent, args) => {
            const userIndex = userList.findIndex((u) => u.id === args.id);
            if (userIndex === -1) {
                throw new Error(`User with id: ${args.id} not found`);
            }
            const deletedUser = userList.splice(userIndex, 1)[0];
            return deletedUser;
        },
        updateUser: (parent, args) => {
            const user = userList.find((u) => u.id === args.id);
            if (!user) {
                throw new Error(`User with id: ${args.id} not found`);
            }
            if (args.name) {
                user.name = args.name;
            }
            if (args.email) {
                user.email = args.email;
            }
            return user;
        },
    },
};
const startServer = async () => {
    const server = new ApolloServer({ typeDefs, resolvers });
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
    });
    console.log(`🚀 Server running at port ${url}`);
};
startServer(); // Call the asynchronous function to start the server
