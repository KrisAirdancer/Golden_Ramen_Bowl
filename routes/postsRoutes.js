// This file defines all of the routes for '/posts'.

// Here, instead of attaching all of our handlers to the 'app' object (as defined by app.js), we attach all of our handlers to the Router object. The Router is like a min app.js. We have to export the Router object (see bottom of file) for use as an import inside app.js.

// Note: The .get, .put, etc. calls are synonomus with GET, PUT, etc. - the method names specify the type of call, so we are okay to re-use URL path strings when they correspond to different types of requests.

const express = require('express');
const multer = require('multer');
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

/***** MULTER FILE UPLOAD CODE *****/

// This sets the filename of the file that is being uploaded. Without this the file would be given an alphanumeric name with no file extension.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        // or 
        // uuid, or fieldname
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
    console.log('AT: router.post(\'upload-image\')');

    // return res.json({ status: 'OK' });
    // res.end();
});

/***** END MULTER FILE UPLOAD CODE *****/

module.exports = router;