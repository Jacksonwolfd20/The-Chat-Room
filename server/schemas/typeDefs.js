const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
  }

  type Message {
    id: ID!
    user: String!
    text: String!
  }


  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    messages: [Message!]
    message(messageId: ID!): Message
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    postMessage(user: String!, text: String!): ID!
    removeUser(username: String!): User
    updateUser(username: String!, email: String!): Message
  }


  
`;

module.exports = typeDefs;
