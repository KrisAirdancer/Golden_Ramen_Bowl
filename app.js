// Imports the Express package
const express = require('express');

// Creates the server object as an express server.
const app = express();

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

// This handles requests for the base domain https://www.goldenramenbowl.com/ - the homepage.
app.get('/', (req, res) => {
    res.render('index');
});