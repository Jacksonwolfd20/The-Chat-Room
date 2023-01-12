const { AuthenticationError } = require('apollo-server-express');
const { User, Message } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('messages');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate('messages');
    },
    messages: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Message.find(params).sort({ createdAt: -1 });
    },
    message: async (parent, { messageId }) => {
      return Message.findOne({ _id: messageId });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('messages');
      }
      throw new AuthenticationError('You need to be logged in!');
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
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    addMessage: async (parent, { text }, context) => {
      if (context.user) {
        const message = await Message.create({
            text,
          sender: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { messages: message._id } }
        );

        return message;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    
    removeMessage: async (parent, { messageId }, context) => {
      if (context.user) {
        const message = await Message.findOneAndDelete({
          _id: messageId,
          sender: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { messages: message._id } }
        );

        return message;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
   
  },
};

module.exports = resolvers;
