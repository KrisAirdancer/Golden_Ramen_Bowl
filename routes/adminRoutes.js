const express = require('express');
const multer = require('multer');
const adminController = require('../controllers/adminController')

const router = express.Router();

// Displays the admin console page
router.get('/', adminController.serve_admin_console_page);

// Displays the form to create a new blog post.
router.get('/create', adminController.serve_create_post_page);

// Sends a new blog post to the database.
router.post('/', adminController.send_new_post_to_database);

/* Serves the file upload page. The page where files can be uploaded to the server.
 */
router.get('/upload', adminController.serve_file_upload_page);

/* Serves the edit posts list page. A list of posts, hyperlinked to thier
 * corresponding "Edit Post" page.
 */
router.get('/edit-posts-list', adminController.serve_edit_posts_list_page);

/* Serves the login page.
 */
router.get('/login', adminController.serve_login_page);

router.post('/login', adminController.log_user_in);

/***** IMPORTANT *****/
/* All ':id' routes must be below the rest of the routes. Else the last part of a
 * route will be interpreted as an id and the id route triggered.
 */

// Updates a post's data in the MongoDB database
router.post('/update-post/:id', adminController.update_post_in_database);

// Displays the form to edit an existing blog post
router.get('/edit/:id', adminController.serve_edit_post_page);

// Deletes a post.
router.delete('/:id', adminController.delete_post_from_database);

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
    res.render('admin/file-upload-form', { title: 'File Upload' } );
});

/***** END MULTER FILE UPLOAD CODE *****/

module.exports = router;