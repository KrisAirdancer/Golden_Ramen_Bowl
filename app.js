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
const bodyParser = require('body-parser');
const Post = require('./models/post');
const multer = require('multer');
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
// app.set('views', "myviews"); // We aren't changing the directory for EJS files, so we don't need this.

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

// isAuthenticated
// Displays the admin console page
app.get('/admin', (req, res) => {
    console.log('AT: serve_admin_console_page');

    // The res.render function compiles your template (please don't use ejs), inserts locals there, and creates html output out of those two things.
    res.render('admin/admin-console', { title: 'Admin Console' });
});

// isAuthenticated
// Displays the form to create a new blog post.
app.get('/admin/create', (req, res) => {
    console.log('AT: serve_create_post_page');

    // The res.render function compiles your template (please don't use ejs), inserts locals there, and creates html output out of those two things.
    res.render('admin/create', { title: 'Create', postData: new Post(), editing: false } ); // Here we pass in an empty post to create values for the Mongoose post.js variables in the create-edit-form.ejs form. This is necessary b/c the edit post functionality needs to populate the variables on the create-edit-form.ejs.
});

// isAuthenticated
// Sends a new blog post to the database.
app.post('/admin', (req, res) => {
    console.log('AT: send_new_post_to_database');

    // req.body contains all of the information from the submitted new blog post form. But we can only parse the data as a string if we use the .urlencoded middleware.
    const post = new Post(req.body); // This property (req.body) is made readable in app.js by the app.use(express.urlencoded()) call above.
    // Convert the tags string into an array of tags
    post.tags = parseTags(req.body.tags);

    console.log(req.body); // TODO: May want to remvoe this print line.
    post.save()
        .then( (result) => {
            res.redirect(`/admin/edit/${result.id}`);
        })
        .catch( (err) => {
            console.log(err.message);
        })
});

// isAuthenticated
/* Serves the file upload page. The page where files can be uploaded to the server.
 */
app.get('/admin/upload', (req, res) => {
    console.log('AT: serve_file_upload_page');

    res.render('admin/file-upload-form', { title: 'File Upload' } );
});

// isAuthenticated
/* Serves the edit posts list page. A list of posts, hyperlinked to thier
 * corresponding "Edit Post" page.
 */
app.get('/admin/edit-posts-list', (req, res) => {
    console.log('AT: serve_edit_posts_list_page');

    // res.render('admin/edit-posts-list', { title: 'Edit Posts' } );

    Post.find().sort({ createdAt: -1 }) // Sorts the returned data based on the time it was created (createdAt) in descending order (-1).
    .then( (result) => {
        res.render('admin/edit-posts-list', { title: 'Edit Posts', posts: result }); // This sends the retrieved data to the browser. The "title" tag matches the HTML tag in header.ejs partial and therefore MUST include it. The "blogs" field is sending over the data itself (the data is stored in "result").
    })
    .catch( (err) => {
        console.log(err.message);
    })
});

// isNotAuthenticated
/* Serves the login page.
 */
app.get('/admin/login', (req, res) => {
    console.log('AT: serve_login_page');

    console.log(`request data: ${req.params}`)

    res.render('admin/login', { title: 'Admin Login' } );
});

// isNotAuthenticated
app.post('/admin/login', (req, res) => {
    console.log('AT: log_user_in');
});

/***** IMPORTANT *****/
/* All ':id' routes must be below the rest of the routes. Else the last part of a
 * route will be interpreted as an id and the id route triggered.
 */

// isAuthenticated
// Updates a post's data in the MongoDB database
app.post('/admin/update-post/:id', (req, res) => {
    console.log('AT: update_post_in_database');

    // Get the id of the post to be updated from the request (req)
    const id = req.params.id;

    // Retrieve the Post object with matching id from the MongoDB database
    Post.findById(id)
        .then(post => {
            // .set() updates all of the fields that are inputted via the obhject passed to it as an argument:
                // https://mongoosejs.com/docs/api/document.html#document_Document-set
                // Better explanation of .set() here: https://mongoosejs.com/docs/api/document.html#document_Document-overwrite
            post.set(req.body);
            // .save() updates the MongoDB database with the changes in the object
            post.save();
            res.redirect(`/admin/edit/${id}`);
        })
        .catch(err => {
            // console.log(err.message);
            res.status(404).render('404', { title: 'Page not found' })
        })
});

// isAuthenticated
// Displays the form to edit an existing blog post
app.get('/admin/edit/:id', (req, res) => {
    console.log('AT: serve_edit_post_page');

    // Pull the id of the post that has been requested to be edited
    const id = req.params.id;

    Post.findById(id) // This retrieves the post associated with the ID from the database. The post object is stored in 'result'.
        .then(result => {
            // Render the page (aka. send the page to the browser).
            // Note: .render() is an Express method/function: https://expressjs.com/en/api.html#res.render 
            res.render('admin/edit', { title: 'Edit', postData: result, editing: true } ); // First parameter is the path of the file to be rendered. Second parameter is an objec that contains variables (data) that we can use via EJS in the associated .ejs file. In this case, we could use 'Edit' in edit.ejs by writing `<%= title %>`.
        })
        .catch(err => {
            // console.log(err.message);
            res.status(404).render('404', { title: 'Page not found' })
        })
});

// isAuthenticated
// Deletes a post.
app.delete('/admin/:id', (req, res) => {
    console.log('AT: delete_post_from_database');

    const id = req.params.id;
    
    Post.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/admin/edit-posts-list' }); // TODO: Upgrade. Have this redirect back to the "Edit Posts" page instead of back to the admin page. Just reload the "Edit Posts" page so it doesn't show the deleted post anymore.
      })
      .catch(err => {
        console.log(err.message);
      });
});

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

// NOTE: ERROR ROUTES ARE BELOW THE MULTER CODE

/***************************
 * MULTER FILE UPLOAD CODE *
 ***************************/

// This sets the filename of the file that is being uploaded. Without this the file would be given an alphanumeric name with no file extension.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, originalname);
    }
})

// This is Multer object that we use below in the .post() request to process the file.
const multerUploader = multer({ storage: storage }); // or simply { dest: 'uploads/' }

/* Uploads a file to the server (Stores files in the /images directory. Not in the
 * MongoDB database.)
 * The 'name_imageUpload' argument is linking the Malta middleware to the file input
 * HTML field in image-upload.jpg. This is how the file gets sent from the HTML form
 * to this method to be uploaded.
 * 
 * Followed this tutorial to set this up: https://www.youtube.com/watch?v=ysS4sL6lLDU&t=374s
 */
app.post('/admin/upload-image', multerUploader.single('name_imageUpload'), (req, res) => {
    console.log('AT: multerUploader in postsRoutesjs');

    // Redirect to the file uploads page
    res.render('admin/file-upload-form', { title: 'File Upload' } );
});

/****************
 * ERROR ROUTES *
 ****************/

/*  Handling invalid URLs by redirecting that request to the 404 page. If no match is found in any of the above functions, this function will fire. If a match is found above, this function will never run.
 *  This function does not take in a URL as a parameter b/c it fires for any request. This is why this one must be at the bottom of the file. It is the default case if all others don't match the incoming request. If you move this up in the code, it will cause other valid URLs to go to the 404 page.
 *  This method does not automatically know that we're handling a 404 or serving any other kind of page for that matter. So we have to specify with the .status() function.
 *  This method is used to run middleware
 */
app.use( (req, res) => { 
    res.status(404).render('404', { title: '404'} );
});

/************************
 * ADDITIONAL FUNCTIONS *
 ************************/

// TODO: Consider renaming the below two methods requireAuthentication and requireNotAuthenticated

/* Checks if a user has been authenticated or not.
 * Returns 'next()' if user IS authenticated.
 * 
 * This function allows us to check if a user has been authenticated wherever
 * we want to. Such as when .get() and .post() requests are made to the server.
 * The `next` function is a function we call when we have finished
 * authenticating the user that simply tells the calling function to continue.
 * In this case, if the user hasn't been authenticated, and passport.isAuthenticated()
 * returns false, we redirect the user back to the login page instaed of allowing
 * them to go to the page they requested.
 */
function isAuthenticated(req, res, next) {
    console.log('AT: isAuthenticated');
    // .isAuthenicated() is a passport function that returns true if a user has been authenticated.
    if (req.isAuthenticated()) {
        console.log('HERE');
        return next()
    }
    console.log('THERE');
    // Redirect the user to the login page. This only triggers if the user hasn't been authenticated.
    res.redirect('admin/login');
  }
  
  /* Checks if a user is not authenticated.
   * Returns 'next()' if user is NOT authenticated.
   * 
   * If they aren't this will allow them to continiue with the
   * request that they made to the server. If they have been authenticated, they will be
   * redirected to the site homepage.
   * This is useful for keeping users from accessing the login page after they have logged in.
   */
  function isNotAuthenticated(req, res, next) {
    console.log('AT: isNotAuthenticated');
    if (!req.isAuthenticated()) {
        return next();
    }
    // This triggers if the user has been authenticted.
    res.redirect('login')
  }

/* Takes in a string of comma separated post tags and returns an
 * array of tags.
 */
function parseTags(tags) {
    // Strip all whitespace
    tags = tags.replace(/\s+/g, '');
    // Split tags on commas - tagList is an Array
    let tagList = tags.split(',');

    return tagList;
}