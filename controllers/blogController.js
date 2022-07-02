// This file contains all of the functions that act as control in the MVC model. The below functions are called in postRoutes.js

const Post = require('../models/post')

const blog_index = (req, res) => {
    Post.find().sort({ createdAt: -1 }) // Sorts the returned data based on the time it was created (createdAt) in descending order (-1).
    .then( (result) => {
        res.render('posts/index', { title: 'All Posts', posts: result }); // This sends the retrieved data to the browser. The "title" tag matches the HTML tag in header.ejs partial and therefore MUST include it. The "blogs" field is sending over the data itself (the data is stored in "result").
    })
    .catch( (err) => {
        console.log(err.message);
    })
}

const blog_details = (req, res) => {
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

// This serves the page with the create post form on it to the browser.
const blog_create_get = (req, res) => {
    // The res.render function compiles your template (please don't use ejs), inserts locals there, and creates html output out of those two things.
    res.render('posts/create', { title: 'Create', postData: new Post(), editing: false } ); // Here we pass in an empty post to create values for the Mongoose post.js variables in the create-edit-form.ejs form. This is necessary b/c the edit post functionality needs to populate the variables on the create-edit-form.ejs.
}

// This serves the pages with the edit post form on it to the browser.
const blog_edit = (req, res) => {
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

/* This sends a POST request to the MongoDB database to add a newly created post to
 * the database and then redirects the user to the blog homepage.
 */
const blog_create_post = (req, res) => {
    
    // Get list of tags from  - tags is a string
    let tags = req.body.tags;
    // Strip all whitespace
    tags = tags.replace(/\s+/g, '');
    // Split tags on commas - tagList is an Array
    let tagList = tags.split(',');

    // req.body contains all of the information from the submitted new blog post form. But we can only parse the data as a string if we use the .urlencoded middleware.
    const post = new Post(req.body); // This property (req.body) is made readable in app.js by the app.use(express.urlencoded()) call above.
    // Storing the array in the new object
    post.tags = tagList;
    console.log(req.body); // TODO: May want to remvoe this print line.
    post.save()
        .then( (result) => {
            res.redirect('/posts');
        })
        .catch( (err) => {
            console.log(err.message);
        })
}

// This sends a _______ request to the MongoDB database to update the contents of an existing post.
// TODO: Implement this function.

const blog_delete = (req, res) => {
    const id = req.params.id;
    
    Post.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/posts' });
      })
      .catch(err => {
        console.log(err.message);
      });
}

// This makes the specified functions available outside this module.
module.exports = {
    blog_index,
    blog_details,
    blog_create_get,
    blog_create_post,
    blog_delete,
    blog_edit
}