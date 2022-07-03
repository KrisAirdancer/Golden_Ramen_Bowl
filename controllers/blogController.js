/* This file contains all of the functions that act as control in the MVC model.
 * The below functions are called in postRoutes.js
 */

const Post = require('../models/post');

const serve_index_page = (req, res) => {
    console.log('AT: serve_index_page');

    Post.find().sort({ createdAt: -1 }) // Sorts the returned data based on the time it was created (createdAt) in descending order (-1).
    .then( (result) => {
        res.render('posts/index', { title: 'All Posts', posts: result }); // This sends the retrieved data to the browser. The "title" tag matches the HTML tag in header.ejs partial and therefore MUST include it. The "blogs" field is sending over the data itself (the data is stored in "result").
    })
    .catch( (err) => {
        console.log(err.message);
    })
}

const serve_post_details_page = (req, res) => {
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
}

// // This serves the page with the create post form on it to the browser.
// const serve_create_post_page = (req, res) => {
//     console.log('AT: serve_create_post_page');

//     // The res.render function compiles your template (please don't use ejs), inserts locals there, and creates html output out of those two things.
//     res.render('posts/create', { title: 'Create', postData: new Post(), editing: false } ); // Here we pass in an empty post to create values for the Mongoose post.js variables in the create-edit-form.ejs form. This is necessary b/c the edit post functionality needs to populate the variables on the create-edit-form.ejs.
// }

// This serves the pages with the edit post form on it to the browser.
const serve_edit_post_page = (req, res) => {
    console.log('AT: serve_edit_post_page');

    // Pull the id of the post that has been requested to be edited
    const id = req.params.id;

    Post.findById(id) // This retrieves the post associated with the ID from the database. The post object is stored in 'result'.
        .then(result => {
            // Render the page (aka. send the page to the browser).
            // Note: .render() is an Express method/function: https://expressjs.com/en/api.html#res.render 
            res.render('posts/edit', { title: 'Edit', postData: result, editing: true } ); // First parameter is the path of the file to be rendered. Second parameter is an objec that contains variables (data) that we can use via EJS in the associated .ejs file. In this case, we could use 'Edit' in edit.ejs by writing `<%= title %>`.
        })
        .catch(err => {
            // console.log(err.message);
            res.status(404).render('404', { title: 'Blog not found' })
        })
}

/* Serves the page with the file upload form.
 */
const serve_file_upload_page = (req, res) => {
    console.log('AT: serve_file_upload_page');

    res.render('posts/file-upload-form', { title: 'File Upload' } );
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
            res.redirect(`/posts/edit/${result.id}`);
        })
        .catch( (err) => {
            console.log(err.message);
        })
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
            res.redirect(`/posts/edit/${id}`);
        })
        .catch(err => {
            // console.log(err.message);
            res.status(404).render('404', { title: 'Blog not found' })
        })
}

/* Deletes the specified post from the MongoDB database.
 */
const delete_post_from_database = (req, res) => {
    console.log('AT: delete_post_from_database');

    const id = req.params.id;
    
    Post.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/posts' });
      })
      .catch(err => {
        console.log(err.message);
      });
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

// This makes the specified functions available outside this module.
module.exports = {
    serve_index_page,
    serve_post_details_page,
    // serve_create_post_page,
    serve_edit_post_page,
    serve_file_upload_page,
    send_new_post_to_database,
    update_post_in_database,
    delete_post_from_database
}