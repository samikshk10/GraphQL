import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import express from "express";
import userList from "./mock-database/users.json" assert { type: "json" };

const app = express();
const typeDefs = `
  type UserType {
    id: ID
    name: String
    email: String
    age: Int
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
    user: (parent: any, args: any) =>
      userList.find((user: any) => user.id === args.id),
  },
  Mutation: {
    addUser: (parent: any, args: any) => {
      const newUser = {
        name: args.name,
        email: args.email,
        id: Date.now(),
        age: args.age,
      };
      userList.push(newUser);
      return {
        ...newUser,
        message: "user added successfully",
      };
    },
    deleteUser: (parent: any, args: any) => {
      const userIndex = userList.findIndex((u: any) => u.id === args.id);
      if (userIndex === -1) {
        throw new Error(`User with id: ${args.id} not found`);
      }
      const deletedUser = userList.splice(userIndex, 1)[0];
      return deletedUser;
    },
    updateUser: (parent: any, args: any) => {
      const user = userList.find((u: any) => u.id === args.id);
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

startServer();
