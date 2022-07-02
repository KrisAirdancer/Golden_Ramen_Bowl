// This file defines all of the routes for '/posts'.

// Here, instead of attaching all of our handlers to the 'app' object (as defined by app.js), we attach all of our handlers to the Router object. The Router is like a min app.js. We have to export the Router object (see bottom of file) for use as an import inside app.js.

// Note: The .get, .put, etc. calls are synonomus with GET, PUT, etc. - the method names specify the type of call, so we are okay to re-use URL path strings when they correspond to different types of requests.

const express = require('express');
const blogController = require('../controllers/blogController')

const router = express.Router();

// Updates a post's data in the MongoDB database
router.post('/update-post/:id', blogController.blog_edit_update);

// Displays a page that displays all of the blog posts on it.
router.get('/', blogController.blog_index);

// Sends a new blog post to the database.
router.post('/', blogController.blog_create_post);

// Displays the form to create a new blog post.
router.get('/create', blogController.blog_create_get);

// Displays the form to edit an existing blog post
router.get('/edit/:id', blogController.blog_edit_post);

// Displays a single post.
router.get('/:id', blogController.blog_details); // We must use the colon in front of the route parameter. If we don't, it will be interpreted as a string literal.

// Deletes a post.
router.delete('/:id', blogController.blog_delete);


module.exports = router;