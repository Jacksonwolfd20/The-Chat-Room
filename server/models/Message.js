const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  number: {
    type: Number,
    required: true,
  },
  sender: {
    type: String,
    required: true,
    trim: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
});

const Message = model("Message", messageSchema);

module.exports = Message;
