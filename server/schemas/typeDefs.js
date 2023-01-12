const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    messages: [Message]!
  }

  type Message {
    _id: ID
    sender: String
    text: String
  }


  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    messages(username: String): [Message]
    message(messageId: ID!): Message
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addMessage(messageText: String!): Message
    removeMessage(messageId: ID!): Message
  }
`;

module.exports = typeDefs;