// This file defines all of the routes for '/posts'.

// Here, instead of attaching all of our handlers to the 'app' object (as defined by app.js), we attach all of our handlers to the Router object. The Router is like a min app.js. We have to export the Router object (see bottom of file) for use as an import inside app.js.

// Note: The .get, .put, etc. calls are synonomus with GET, PUT, etc. - the method names specify the type of call, so we are okay to re-use URL path strings when they correspond to different types of requests.

const express = require('express');
const multer = require('multer');
const blogController = require('../controllers/blogController')

const router = express.Router();

// Updates a post's data in the MongoDB database
router.post('/update-post/:id', blogController.update_post_in_database);

// Displays a page that displays all of the blog posts on it.
router.get('/', blogController.serve_index_page);

// Sends a new blog post to the database.
router.post('/', blogController.send_new_post_to_database);

// Displays the form to create a new blog post.
router.get('/create', blogController.serve_create_post_page);

/* Serves the file upload page. The page where files can be uploaded to the server.
 */
router.get('/upload', blogController.serve_file_upload_page);

/***** IMPORTANT *****/
/* All ':id' routes must be below the rest of the routes. Else the last part of a
 * route will be interpreted as an id and the id route triggered.
 */

// Displays the form to edit an existing blog post
router.get('/edit/:id', blogController.serve_edit_post_page);

// Displays a single post.
router.get('/:id', blogController.serve_post_details_page); // We must use the colon in front of the route parameter. If we don't, it will be interpreted as a string literal.

// Deletes a post.
router.delete('/:id', blogController.delete_post_from_database);

/***** MULTER FILE UPLOAD CODE *****/

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
router.post('/upload-image', multerUploader.single('name_imageUpload'), (req, res) => {
    console.log('AT: multerUploader in postsRoutesjs');

    // Redirect to the file uploads page
    res.render('posts/file-upload-form', { title: 'File Upload' } );
});

/***** END MULTER FILE UPLOAD CODE *****/

module.exports = router;