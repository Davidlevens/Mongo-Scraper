// Require mongoose
const mongoose = require('mongoose');

// reference to the mongoose Schema constructor
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: 'Title is Required',
  },
  message: {
    type: String,
    trim: true,
    required: 'Message is Required',
  },
  // `date` must be of type Date. The default value is the current date
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// creates model from the above schema, using mongoose's model method
const Comment = mongoose.model('Comment', CommentSchema);

// Export the Example model
module.exports = Comment;
