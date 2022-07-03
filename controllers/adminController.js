const Post = require('../models/post');

/* Serves the Admin Console page.
 */
const serve_admin_console_page = (req, res) => {
    console.log('AT: serve_admin_console_page');

    // The res.render function compiles your template (please don't use ejs), inserts locals there, and creates html output out of those two things.
    res.render('admin/admin-console', { title: 'Admin Console' });
}

// This serves the page with the create post form on it to the browser.
const serve_create_post_page = (req, res) => {
    console.log('AT: serve_create_post_page');

    // The res.render function compiles your template (please don't use ejs), inserts locals there, and creates html output out of those two things.
    res.render('admin/create', { title: 'Create', postData: new Post(), editing: false } ); // Here we pass in an empty post to create values for the Mongoose post.js variables in the create-edit-form.ejs form. This is necessary b/c the edit post functionality needs to populate the variables on the create-edit-form.ejs.
}

/* Deletes the specified post from the MongoDB database.
 */
const delete_post_from_database = (req, res) => {
    console.log('AT: delete_post_from_database');

    const id = req.params.id;
    
    Post.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/admin' }); // TODO: Upgrade. Have this redirect back to the "Edit Posts" page instead of back to the admin page. Just reload the "Edit Posts" page so it doesn't show the deleted post anymore.
      })
      .catch(err => {
        console.log(err.message);
      });
}

// This updates the post in the MongoDB database
const update_post_in_database = (req, res) => {
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
}

/* This sends a POST request to the MongoDB database to add a newly created post to
 * the database and then redirects the user to the blog homepage.
 */
const send_new_post_to_database = (req, res) => {
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
}

/* Serves the page with the file upload form.
 */
const serve_file_upload_page = (req, res) => {
    console.log('AT: serve_file_upload_page');

    res.render('admin/file-upload-form', { title: 'File Upload' } );
}

// This serves the pages with the edit post form on it to the browser.
const serve_edit_post_page = (req, res) => {
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
}

/***** HELPER METHODS *****/

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

module.exports = {
    serve_create_post_page,
    serve_admin_console_page,
    serve_edit_post_page,
    serve_file_upload_page,
    send_new_post_to_database,
    update_post_in_database,
    delete_post_from_database
}