// const http = require('http');

// const server = http.createServer( (req, res) => {
//     console.log('Request made.');
// });

// server.listen(11000, 'localhost', () => {
//     console.log('Listening on port 11000.');
// });

const express = require('express');

// Creates the server object as an express server.
const app = express();

app.set('view engine', 'ejs');

// TODO: Might need to add some kind of error handling on server startup.
app.listen(11000);

// Allows app.js to use functions that can parse URL encoded data.
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public')); // This makes the directory 'public' and all of it's contents available to the frontend.

// This makes the directory 'public' and all of it's contents available to the frontend.
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});