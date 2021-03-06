// Dependencies
const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const logger = require('morgan');

// Require all models
const db = require('./models');

// Initialize Express
const app = express();

// Use morgan logger for logging requests
app.use(logger('dev'));
// Parse request body as JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// Make public a static folder
app.use(express.static('public'));

// Initialize Handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

// TODO: will need to host this on heroku eventually
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';
mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

// Routes

// Route for getting all Articles from the db, returned as JSON
app.get('/articles-json', function(req, res) {
  db.Article.find()
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
});

// Route for getting all unsaved articles and calling index page
app.get('/articles', function(req, res) {
  db.Article.find({saved: false}).sort({'_id': -1}).limit(100)
      .then((articles) => {
        res.render('index', {article: articles});
      })
      .catch(function(err) {
      // log the error message
        console.log(err.message);
      });
});

// Route for scraping articles and then calling index page to display all unsaved articles
app.get('/scrape', function(req, res) {
  axios.get('https://www.npr.org/')
      .then(function(response) {
      // Load the HTML into cheerio
        const $ = cheerio.load(response.data);
        // Cheerio, finds each tag with the 'title' class
        const stories = $('div.story-wrap');
        stories.each(function(i, element) {
          const data = {
            slug: $(element)
                .children('div.story-text')
                .children('div.slug-wrap')
                .find('h2').text(),
            title: $(element)
                .children('div.story-text')
                .children('a')
                .find('h3.title').text(),
            link: $(element)
                .children('div.story-text')
                .children('a')
                .attr('href'),
            summary: $(element)
                .children('div.story-text')
                .find('p.teaser').text(),
            imgSource: $(element)
                .find('img').attr('src'),
          };
          console.log(data);
          // Saves results to db
          if (data.title && data.link) {
          // Saves article to db if an entry doesn't exist
            db.Article.updateOne({title: data.title}, {$set: data, $setOnInsert: {saved: false}}, {upsert: true})
                .then(function(dbArticle) {
                  // If saved successfully, print the new Article document to the console
                  console.log('Articles sraped');
                })
                .catch(function(err) {
                  // log the error message
                  console.log(err.message);
                });
          }
        });
      })
      .then(function() {
      // gets all unsaved articles from database and pushes to handlebars page
        db.Article.find({saved: false})
            .then((articles) => {
              res.render('index', {article: articles});
            })
            .catch(function(err) {
              // log the error message
              console.log(err.message);
            });
      });
});

// Clears articles
app.get('/clearAll', function(req, res) {
  db.Article.deleteMany({}, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log('Articles removed');
    }
  });
  res.render('index');
});


// Route for saving the article
app.post('/saved/:id', function(req, res) {
  db.Article.updateOne({_id: req.params.id}, {$set: {saved: true}}, function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      console.log('Article is saved');
      res.redirect('/articles');
    }
  });
});

// Route for removing saved articles
app.post('/remove/:id', function(req, res) {
  db.Article.updateOne({_id: req.params.id}, {$set: {saved: false}}, function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      console.log('Article is no longer saved');
      res.redirect('/saved');
    }
  });
});

// Gets saved articles and calls saved handlebars page
app.get('/saved', function(req, res) {
  db.Article.find({saved: true}).sort({'_id': -1}).populate('comments')
      .then((articles) => {
        console.log(articles);
        res.render('saved', {article: articles});
      })
      .catch(function(err) {
      // log the error message
        console.log(err.message);
      });
});


// Routes for Comments

// Route for getting a specific Article by id, populate it with it's comment
app.get('/articles/:id', function(req, res) {
  db.Article.findOne({_id: req.params.id})
      .populate('comment') // the key in the article schema
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
});

// Route for saving/updating an Article's associated Comment
app.post('/articlenotes/:id', function(req, res) {
  // Insert Comments into database
  db.Comment.create(req.body)
      .then(function(dbComment) {
      // Update article document with Comment ID
        return db.Article.findOneAndUpdate({_id: req.params.id},
            {
              $push: {
                comments: {
                  $each: [
                    dbComment._id,
                  ],
                  $position: 0,
                },
              },
            },
            {upsert: true, new: true});
      })
      .then(function(dbArticle) {
        res.redirect('/saved');
      })
      .catch(function(err) {
      // If an error occurred, log it
        console.log(err);
      });
});

// Route for deleting comments
app.post('/remove/comment/:id', function(req, res) {
  console.log('remove comment clicked');
  console.log(req.params.id);
  db.Comment.remove({_id: req.params.id}, function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      console.log('comment deleted');
      res.redirect('/saved');
    }
  });
});

// HTML Route for home page
app.get('/', function(req, res) {
  res.redirect('/articles');
});

// Setup port
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('App running on port ' + PORT);
});
