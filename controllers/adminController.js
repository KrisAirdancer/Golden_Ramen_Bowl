const Post = require('../models/post');

// This serves the page with the create post form on it to the browser.
const serve_create_post_page = (req, res) => {
    console.log('AT: serve_create_post_page');

    // The res.render function compiles your template (please don't use ejs), inserts locals there, and creates html output out of those two things.
    res.render('admin/create', { title: 'Create', postData: new Post(), editing: false } ); // Here we pass in an empty post to create values for the Mongoose post.js variables in the create-edit-form.ejs form. This is necessary b/c the edit post functionality needs to populate the variables on the create-edit-form.ejs.
}

module.exports = {
    serve_create_post_page
}