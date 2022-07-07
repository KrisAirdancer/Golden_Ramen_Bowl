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
const postsRoutes = require('./routes/blogRoutes') // Importing the router from the blogRoutes.js file.
const adminRoutes = require('./routes/adminRoutes');
const bodyParser = require('body-parser');
const Post = require('./models/post');
require('dotenv/config');

/****************************
 * ADMIN LOGIN DEPENDENCIES *
 ****************************/

const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

/*****************************************
 * SETTING UP PASSPORT - for admin login *
 *****************************************/

// This makes the function .initialize in passport-config.js available for use in this file.
const initializePassport = require('./models/passport-config')

/* This calls the initialize function in the passport-config.js file
 * that sets up the passport "object" for use in this project.
 */
initializePassport(
  passport, // This is the passport object to be used for authentication.
  email => users.find(user => user.email === email), // This is the function being passed into passport-config.js as getUserByEmail
  id => users.find(user => user.id === id) // This is the function being passed into passport-config.js as getUserById
)

/****************
 * SERVER SETUP *
 ****************/

/***** BASIC SERVER AND MONGODB SETUP *****/

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

/*********************
 * ADMIN LOGIN SETUP *
 *********************/

// TODO: Replace the 'users' variable with a JSON file that stores the users. Hand code it. That is, the server shouldn't have logic to write to the JSON file (there will be no register page on this site), but will read from the JSON file on server startup and populate a variable like this one that is used to run the login system.
/* This is storing the users that register on the site. Note that the data in
 * this field is erased each time the server shuts down. Thus, this will need
 * to be replaced with a data store that persists, such as a JSON file or a 
 * database.
 */
const users = [
    {
        id: '1657129412975',
        name: 'GRB',
        email: 'goldenramenbowl@gmail.com',
        password: `${process.env.SITE_PWD}`
      }
];

// Telling our server to use express-flash
app.use(flash())
// Telling our server to use express-session
app.use(session({
  secret: process.env.SESSION_SECRET, // A key that is used by bcrypt to encrypt data. The key is used to encrypt data and then to decrypt the data. Anyone with the key can decrypt data that was encrypted using that key.
  resave: false, // This is asking, "Should we save our session variables if nothing has changed?" In this case, no.
  saveUninitialized: false // This is asking, "Do you want to save an empty value in the session if there is no value?" In this case, no.
}))

// This .initialize is NOT the same as .initialize() in passport-config.js. This simply sets up some of the passport stuff for us.
app.use(passport.initialize())
// This tells our server to persist users across sessions.
app.use(passport.session())
// method-override allows us to override methods when making/receiving POST, GET, etc. reqeusts.
app.use(methodOverride('_method'))

/***********
 * ROUTING *
 ***********/

// Listen for GET requests for the root of the domain ('/').
app.get('/', (req, res) => {
    res.redirect('/posts'); // Redirects homepage traffic to the page displaying all of the blog posts.
});

/***** BLOG ROUTES *****/

// The syntax for this can be .use(postsRoutes) or as below. If we use it as below, it only uses the routes in postsRoutes.js if the URL has /posts in it. As such, when we define the routes inside postsRoutes, we don't have to include /posts in front of every route in that file. Instead, in the postsRoutes.js file, we can just write the part of the route that comes after the /posts. eg. The route for /posts/:id would just be /:id in the postsRoutes.js file.
// app.use('/posts', postsRoutes); // This tells Node.js to apply all of the handlers that are defined in postsRoutes.js to the app.js object. This is equivalent to putting all of the code from postsRoutes.js right here. In fact, if you look at previous commits before Express was added, that is exactly what you will see.

// Displays a page that displays all of the blog posts on it.
app.get('/posts', (req, res) => {
    console.log('AT: serve_index_page');

    Post.find().sort({ createdAt: -1 }) // Sorts the returned data based on the time it was created (createdAt) in descending order (-1).
    .then( (result) => {
        res.render('posts/index', { title: 'All Posts', posts: result }); // This sends the retrieved data to the browser. The "title" tag matches the HTML tag in header.ejs partial and therefore MUST include it. The "blogs" field is sending over the data itself (the data is stored in "result").
    })
    .catch( (err) => {
        console.log(err.message);
    })
});


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

/***** id ROUTES *****/

/* IMPORTANT:
 * All ':id' routes must be below the rest of the routes (except the 404 route).
 * Else the last part of a route will be interpreted as an id and the id route triggered.
 */

// Displays a single post.
// We must use the colon in front of the route parameter. If we don't, it will be interpreted as a string literal.
app.get('/posts/:id', (req, res) => {
    console.log('AT: serve_post_details_page');

    const id = req.params.id; // This gets the ID from the path that was generated in the browser by the JavaScript. I think. Something close to that. It definitely isn't accessing the database.
    // console.log(id); // This just logs the id to the console to show that it is working.
    Post.findById(id) // This retrieves the post associated with the ID from the database.
        .then(result => {
            res.render('posts/details', { post: result, title: 'Post Details' }); // 'details' is the view (an file called details.ejs) that contains the HTML outline of the page.
        })
        .catch(err => {
            // console.log(err.message);
            res.status(404).render('404', { title: 'Blog not found' })
        })
});

/***** ERROR ROUTES *****/

/*  Handling invalid URLs by redirecting that request to the 404 page. If no match is found in any of the above functions, this function will fire. If a match is found above, this function will never run.
 *  This function does not take in a URL as a parameter b/c it fires for any request. This is why this one must be at the bottom of the file. It is the default case if all others don't match the incoming request. If you move this up in the code, it will cause other valid URLs to go to the 404 page.
 *  This method does not automatically know that we're handling a 404 or serving any other kind of page for that matter. So we have to specify with the .status() function.
 *  This method is used to run middleware
 */
app.use( (req, res) => { 
    res.status(404).render('404', { title: '404'} );
});