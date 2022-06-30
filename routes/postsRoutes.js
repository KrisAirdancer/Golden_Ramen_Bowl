// This file defines all of the routes for '/posts'.

// Here, instead of attaching all of our handlers to the 'app' object (as defined by app.js), we attach all of our handlers to the Router object. The Router is like a min app.js. We have to export the Router object (see bottom of file) for use as an import inside app.js.

const express = require('express');
const blogController = require('../controllers/blogController')

const router = express.Router();

// Builds a page that displays all of the blog posts on it.
router.get('/', blogController.blog_index);

// This variation does NOT work. Likely because the req and res variables are not initialized anywhere in the scope of this statement so they cannot be passed in. The first option (above) passes them in implicitly while the third (below) explicitly initializes them before passing them in.
// router.get('/', blogController.blog_index(req, res));

// This variation DOES work.
// router.get('/', (req, res) => {
//     blogController.blog_index(req, res)
// });

// Sends a new blog post to the database.
router.post('/', blogController.blog_create_post);

// Displays the form to create a new blog post.
router.get('/create', blogController.blog_create_get);

// Displays a single post.
router.get('/:id', blogController.blog_details); // We must use the colon in front of the route parameter. If we don't, it will be interpreted as a string literal.

// Deletes a post.
router.delete('/:id', blogController.blog_delete);


module.exports = router;