// Require mongoose
const mongoose = require('mongoose');

// reference to the mongoose Schema constructor
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  slug: {
    type: String,
    trim: true,
    required: 'Slug is Required',
  },
  title: {
    type: String,
    trim: true,
    required: 'Title is Required',
  },
  link: {
    type: String,
    trim: true,
    required: 'Link is Required',
  },
  summary: {
    type: String,
    trim: true,
  },
  imgSource: {
    type: String,
  },
  saved: {
    type: Boolean,
    default: false,
  },
  // `date` must be of type Date. The default value is the current date
  createdDate: {
    type: Date,
    default: Date.now,
  },
  // `comments` is an array that stores ObjectIds
  // The ref property links these ObjectIds to the comment model
  // populates the article with any associated comments
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

// creates model from the above schema, using mongoose's model method
const Article = mongoose.model('Article', ArticleSchema);

// Export the Example model
module.exports = Article;
