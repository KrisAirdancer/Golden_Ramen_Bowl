//   _____ _____  ____       __   ___  
//  / ____|  __ \|  _ \     /_ | / _ \ 
// | |  __| |__) | |_) |_   _| || | | |
// | | |_ |  _  /|  _ <\ \ / / || | | |
// | |__| | | \ \| |_) |\ V /| || |_| |
//  \_____|_|  \_\____/  \_/ |_(_)___/ 
// https://onlineasciitools.com/convert-text-to-ascii-art

/* This file, the app.js file, is exactly the same as the server.js file we made earlier in this course
 * (with maybe a few additional features). That is, they do the same thing, but this one takes advantage
 * of the Express package for Node.js. The Express package simplifies
 * Node.js development by abstracting away routing code and other common operations into functions built
 * in Node.js. This simplifies our code and makes it faster and easier to write Node.js applications.
 * 
 * Note: The server.js file was deleted as part of this commit b/c it was replaced by the app.js file.
 * To view the server.js file, go to the commit just before this one.
 */

const express = require('express');
const morgan = require('morgan'); // A middleware package for logging
const mongoose = require('mongoose');
const postsRoutes = require('./routes/postsRoutes') // Importing the router from the blogRoutes.js file.
const adminRoutes = require('./routes/adminRoutes');
const bodyParser = require('body-parser');
require('dotenv/config');

// Setting up the Express app object
const app = express(); // Initialize the Express app object. Not an instance of this file (app.js).

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
// EJS looks in the views folder for its files by default. This is changing that from the default "views" to "myviews"
// app.set('views', "myviews"); // We aren't changing the directory for EJS files.

// Allows app.js to use functions that can parse URL encoded data.
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true} ));

// This makes the directory 'public' and all of it's contents available to the frontend.
app.use(express.static('public'));

// Setting up logging with morgan. This loggs information to the console.
app.use(morgan('dev'));

/***** ROUTING *****/

// Listen for GET requests for the root of the domain ('/').
app.get('/', (req, res) => {
    res.redirect('/posts'); // Redirects homepage traffic to the page displaying all of the blog posts.
});

/***** POST ROUTES *****/

// The syntax for this can be .use(postsRoutes) or as below. If we use it as below, it only uses the routes in postsRoutes.js if the URL has /posts in it. As such, when we define the routes inside postsRoutes, we don't have to include /posts in front of every route in that file. Instead, in the postsRoutes.js file, we can just write the part of the route that comes after the /posts. eg. The route for /posts/:id would just be /:id in the postsRoutes.js file.
app.use('/posts', postsRoutes); // This tells Node.js to apply all of the handlers that are defined in postsRoutes.js to the app.js object. This is equivalent to putting all of the code from postsRoutes.js right here. In fact, if you look at previous commits before Express was added, that is exactly what you will see.

/***** ADMIN ROUTES *****/

app.use('/admin', adminRoutes);

/***** OTHER ROUTES *****/

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

