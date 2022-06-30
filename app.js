/***** IMPORTS *****/

// Imports the Express package
require('dotenv/config');
const express = require('express');
const mongoose = require('mongoose');

/***** SERVER SETUP *****/

// Creates the server object as an express server.
const app = express();

const dbURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@goldenramenbowl.i1xlf.mongodb.net/?retryWrites=true&w=majority`;

// EJS is a view engine. It allows you to write JavaScript directly in an html file (in this case a .ejs file). When that file is served to the browser, before it is sent, the view engine (EJS), and to some degree Express, will run that JavaScript and use it to generate additional HTML that it inserts into the HTML page before sending it to the browser. This is useful for inserting content from a database or filling the values of variables. Here's how to use it: https://www.youtube.com/watch?v=yXEesONd_54 and here's the docs https://ejs.co/
app.set('view engine', 'ejs');

// TODO: Might need to add some kind of error handling on server startup.
// This starts the server listening on port 11000.
app.listen(11000);

// Allows app.js to use functions that can parse URL encoded data.
app.use(express.urlencoded({ extended: true }));

// This makes the directory 'public' and all of it's contents available to the frontend.
app.use(express.static('public'));

// This makes the directory 'public' and all of it's contents available to the frontend.
app.use(express.static('public'));

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