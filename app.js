/***** IMPORTS *****/

// Imports the Express package
require('dotenv/config');
const express = require('express');
const mongoose = require('mongoose');
const Post = require('./models/post'); // This pulls the Post Schema into the scope of this file.

/***** SERVER SETUP *****/

// Creates the server object as an express server.
const app = express();

// This is the connection string for MongoDB. It provides the login credentails and the information necessary to access the database over the internet.
const dbURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@goldenramenbowl.i1xlf.mongodb.net/goldenRamenBowl?retryWrites=true&w=majority`;

// Connecting to the database using Mongoose. Also starting the server and listening on port 11000.
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(11000);
        console.log("Connected to database and server started on port 11000.");
    })
    .catch(err => { console.log(err.message) }); // TODO: Figure out a better way to deal with database connection issues. Is there a way to notify us if there is an issue here? At the very least, set this up to log to a logging file instead of the console so we can see the error logs after something happens.

// EJS is a view engine. It allows you to write JavaScript directly in an html file (in this case a .ejs file). When that file is served to the browser, before it is sent, the view engine (EJS), and to some degree Express, will run that JavaScript and use it to generate additional HTML that it inserts into the HTML page before sending it to the browser. This is useful for inserting content from a database or filling the values of variables. Here's how to use it: https://www.youtube.com/watch?v=yXEesONd_54 and here's the docs https://ejs.co/
app.set('view engine', 'ejs');

// Allows app.js to use functions that can parse URL encoded data.
app.use(express.urlencoded({ extended: true }));

// This makes the directory 'public' and all of it's contents available to the frontend.
app.use(express.static('public'));

// This makes the directory 'public' and all of it's contents available to the frontend.
app.use(express.static('public'));

/***** MONGODB COMMUNICATION *****/

// This function creates a new post and adds it to the MongoDB database.
app.get('/auto-post', (req, res) => {
    // This creates a new instance of a Post object
    const post = new Post({
        title: 'Auto Post',
        snippet: "An auto-generated post.",
        body: "This post was auto-generated."
    });

    // This call saves the new post object to the MongoDB database. This is asynchronous and returns a Promise.
    post.save()
        .then( (result) => {
            res.send(result); // This line sends the new post object (it's data) to the MongoDB database.
        })
        .catch( (err) => {
            console.log(err.message);
        })
});

// This function returns all of the posts saved in the MongoDB database.
app.get('/get-all-posts', (req, res) => {
    Post.find()
        .then( (result) => {
            res.send(result); // This sends the data (blog posts retrieved from the database) to the browser.
        })
        .catch( (err) => {
            console.log(err.message);
        })
});

app.get('/get-post', (req, res) => {
    Post.findById('62bd02562df2e39ad99c7d36') // Mongoose handles the conversion of the Id from a string on our end to an ID object for use with MongoDB.
        .then( (result) => {
            res.send(result); // Sending the retrieved data to the browser
        })
        .catch( (err) => {
            console.log(err.message);
        })
});

/***** ROUTING *****/

// This handles requests for the base domain https://www.goldenramenbowl.com/ - the homepage.
app.get('/', (req, res) => {
    res.render('index', { title: 'Home'} );
});

/* 'app' is the server object. When a request is made to the server (browser sends a 
 *  request to the server), the server object (app) gets that request. We can access
 *  that request using .get, .post, etc. and respond to it. In this case, we parse the
 *  URL that comes in as a GET request and if it matches the specified path ('/about-us')
 *  we use the response object to send the desired HTML (.ejs) page back to the browser.
 */
app.get('/about-us', (req, res) => {
    res.render('about-us', { title: 'About Us'} );
});

/*  Handling invalid URLs by redirecting that request to the 404 page. If no match is found in any of the above functions, this function will fire. If a match is found above, this function will never run.
 *  This function does not take in a URL as a parameter b/c it fires for any request. This is why this one must be at the bottom of the file. It is the default case if all others don't match the incoming request. If you move this up in the code, it will cause other valid URLs to go to the 404 page.
 *  This method does not automatically know that we're handling a 404 or serving any other kind of page for that matter. So we have to specify with the .status() function.
 *  This method is used to run middleware
 */
app.use( (req, res) => { 
    res.status(404).render('404', { title: '404'} );
});