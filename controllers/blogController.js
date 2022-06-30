// This file contains all of the functions that act as control in the MVC model.

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

const blog_create_get = (req, res) => {
    res.render('posts/create', { title: 'Create'} );
}

const blog_create_post = (req, res) => {
    // req.body contains all of the information from the submitted new blog post form. But we can only parse the data as a string if we use the .urlencoded middleware.
    const post = new Post(req.body); // This property (req.body) is made readable in app.js by the app.use(express.urlencoded()) call above.

    post.save()
        .then( (result) => {
            res.redirect('/posts');
        })
        .catch( (err) => {
            console.log(err.message);
        })
}

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
    blog_delete
}