const { AuthenticationError } = require("apollo-server-express");
const { User, Message } = require("../models");
const { signToken } = require("../utils/auth");


const messages = [];
const subscribers = [];
const onMessagesUpdates = (fn) => subscribers.push(fn);
const resolvers = {
  Query: {
    users: async () => {
      return User.find()
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
    },
    messages: () => messages,
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
    removeUser: async (parent, { username }) => {
        return User.findOneAndDelete({ username: username });
      },
      updateUser: async (parent, { username, email }) => {
        await User.findOneAndUpdate(
            { username: username },
            { email: email  }
        );
      },
      postMessage: (parent, { user, text }) => {
        const id = messages.length;
        messages.push({
          id,
          user,
          text,
        });
        subscribers.forEach((fn) => fn());
        return id;
      },
  },

};



module.exports = resolvers;