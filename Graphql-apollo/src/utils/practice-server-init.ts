// import { ApolloServer } from '@apollo/server';
// import { startStandaloneServer } from '@apollo/server/standalone';

// // A schema is a collection of type definitions (hence "typeDefs")
// // that together define the "shape" of queries that are executed against
// // your data.
// const typeDefs = `#graphql
//   # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

//   # This "Book" type defines the queryable fields for every book in our data source.
//   type Book {
//     title: String
//     author: String
//   }

//   # The "Query" type is special: it lists all of the available queries that
//   # clients can execute, along with the return type for each. In this
//   # case, the "books" query returns an array of zero or more Books (defined above).
//   type Query {
//     books: [Book]
//   }
// `;

// const books = [
//   {
//     title: "The Awakening",
//     author: "Kate Chopin"
//   },
//   {
//     title: "City of Glass",
//     author: "Paul Auster"
//   }
// ]

// //Resolvers define how to fetch the types defined in your schema.
// //This resolver retrieves books from the "books" array above.
// const resolvers = {
//   Query: {
//     books: ()=> books,
//   }
// }

// //The ApolloServer constructor requires two parameters: your schema
// //definition and your set of resolvers.
// const server = new ApolloServer({
//   typeDefs,
//   resolvers
// })

// //Passing an ApolloServer instance to the `startStandAloneServer` function:
// //1. creates an Express app
// //2. installs your ApolloServer instance as middleware
// //3. prepares your app to handle following requests
// const {url} = await startStandaloneServer(server,{
//   listen: { port: 4000}
// })

// console.log(`🚀 Server ready at: ${url}`)

//#NOTE: revision
// import { ApolloServer } from '@apollo/server'
// import { startStandaloneServer } from '@apollo/server/standalone'

// //hardcoded data
// const books = [
//   {
//     title: "The Awakening",
//     author: "Kate"
//   }, {
//     title: "City of Glass",
//     author: "Paul"
//   }
// ]

// //schema definitions
// const typeDefs = `#graphql
//   type Book{
//     title: String
//     author: String
//   }

//   type Query{
//     books: [Book]
//   }

// `

// //Resolver map
// const resolvers = {
//   Query: {
//     books: () => books
//   }
// }

// // pass schema and definition and resolvers to the
// //Apolloserver constructor
// const server = new ApolloServer({
//   typeDefs,
//   resolvers
// })

// //launch the server
// const {url} = await startStandaloneServer(server,{
//   listen: {port: 4000}
// })

// console.log(`🚀 Server listening at port: ${url}`);

//#NOTE: Resolver Chain
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

//hardcoded data
const libraries = [
  {
    branch: "downtown",
  },
  {
    branch: "riverside",
  },
];

//the branch field of a book indicates which library has it in stock

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
    branch: "riverside",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
    branch: "downtown",
  },
];

//Schema Definition
const typeDefs = `#graphql

  #A library has branch and books
  type Library{
    branch: String!
    books: [Book!]
  }

  #A book has a title and author
  type Book{
    title: String
    author: Author!
  }

  #An author has a name
  type Author{
    name: String!
  }

  #Queries can fetch a list of libraries
  type Query {
    libraries: [Library]
  }

`;

//Resolver map
const resolvers = {
  Query: {
    libraries() {
      //return hardcoded array of libraries
      return libraries;
    },
  },
  Library: {
    books(parent: any) {
      //Filter the hardcoded of books to only include books that are located at the correct branch
      return books.filter((book) => book.branch === parent.branch);
    },
  },
  Book: {
    //The parent resolver (Library.books) returns an object with the author's name in the "author" field.
    //Return a JSON object containing the name, because this field expects an object.
    author(parent: any) {
      return {
        name: parent.author,
      };
    },
  },

  //Because Book.author returns an object with a "name" field,
  //Apollo server's default resolver for Author.name will work.
  //We don't need to define them
};

//Pass schema definition and resolvers to the ApolloServer Constructor

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server running at port ${url}`);
