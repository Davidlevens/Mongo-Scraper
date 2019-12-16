<h1>News Scraper</h1>

Live version: https://dave-mongo-scraper.herokuapp.com/articles
<hr></hr>

Author: David Levens

Feel free to use some or all of this code if you're trying to complete a similar project.
<hr></hr>

<h3> App screenshot </h3>

![alt text](https://github.com/Davidlevens/Mongo-Scraper/blob/master/public/assets/img/scraper-scraped.png "News Scraper")

<h2> Project overview</h2>
This news scraper allows users to scrape news articles from NPR.org. Users can then view and leave comments on saved articles. This app uses Cheerio to scrape news from NPR and stores them in MongoDB using Mongoose. 

<hr></hr>

<h2>Technology used</h2>

[Node.js](https://nodejs.org/en/)

[Express](https://expressjs.com/)

[Heroku](https://heroku.com/)

[Handlebars](https://handlebarsjs.com/)

[MongoDB](https://www.mongodb.com/)

[Mongoose](https://mongoosejs.com/)

[Cheerio.js](https://cheerio.js.org/)

<hr></hr>

<h2>How it works</h2>

- The NPR News Scraper App uses Cheerio to gather data from the NPR.org web page. It uses Mongoose to interface with the Mongo database making it easier and faster to perform the necessary 'CRUD' operations(Create, Read, Update and Delete). The Scraper App takes advantage of Express and Handlebars to manage everything from routes to rendering the view and preforming HTTP requests. 

<p></p>

