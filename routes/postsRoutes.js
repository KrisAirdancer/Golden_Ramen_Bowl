/* This file defines all of the routes for '/posts'.
 * 
 * Here, instead of attaching all of our handlers to the 'app' object (as defined by app.js),
 * we attach all of our handlers to the Router object. The Router is like a min app.js.
 * We have to export the Router object (see bottom of file) for use as an import inside app.js.
 * 
 * Note: The .get, .put, etc. calls are synonomus with GET, PUT, etc. - the method names
 * specify the type of call, so we are okay to re-use URL path strings when they correspond
 * to different types of requests.
 */

const express = require('express');
const blogController = require('../controllers/blogController')

const router = express.Router();

// Displays a page that displays all of the blog posts on it.
router.get('/', blogController.serve_index_page);

/***** IMPORTANT *****/
/* All ':id' routes must be below the rest of the routes. Else the last part of a
 * route will be interpreted as an id and the id route triggered.
 */

// Displays a single post.
router.get('/:id', blogController.serve_post_details_page); // We must use the colon in front of the route parameter. If we don't, it will be interpreted as a string literal.

module.exports = router;