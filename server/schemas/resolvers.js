const { AuthenticationError } = require("apollo-server-express");
const { User, Message } = require("../models");
const { signToken } = require("../utils/auth");
const { GraphQLServer, PubSub } = require("graphql-yoga");

const onMessagesUpdates = (fn) => subscribers.push(fn);
const subscribers = [];
const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate("messages");
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate("messages");
    },
    messages: async () => {
      return Message.find().sort({ createdAt: -1 });
    },
    message: async (parent, { messageId }) => {
      return Message.findOne({ _id: messageId });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("messages");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    postMessage: async (parent, { sender, text }) => {
      let number = 0;
      number = await Message.count();

      Message.create({
        number,
        sender,
        text,
      });
      /* subscribers.forEach((fn) => fn()); */
      return { number, sender, text };
    },
  },
  /* Subscription: {
    messages: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random().toString(36).slice(2, 15);
        onMessagesUpdates(() => pubsub.publish(channel, { messages }));
        setTimeout(() => pubsub.publish(channel, { messages }), 0);
        return pubsub.asyncIterator(channel);
      },
    },
  }, */
};

 const pubsub = new PubSub(); 

module.exports = resolvers;