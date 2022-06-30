// This is a Schema for our posts. It defines the structure of the Documents (data) stored in the MongoDB database.
// This Schema is then surrounded by a Model which provides an interface for communicating with the database for this Document type (Post type Document).

const mongoose = require('mongoose');
const Schema = mongoose.Schema; // This is a constructor function that we are using to create a Schema

// This defines a Schema for a blog post
const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, { timestamps: true }); // This will automatically genrate timestamps on each blog object

// MongoDB & Mongoose will pluralize the name "Post" to "Posts" and that is the Collection it will store the Post objects in in the MongoDB database.
const Post = mongoose.model('Post', postSchema); // This is the model for this Schema.

// Exporting this module so that it can be used elsewhere in the project.
module.exports = Post;