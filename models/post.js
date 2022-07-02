// This file defines a model for a blog post.

const mongoose = require('mongoose');
const Schema = mongoose.Schema; // .Schema is a constructor function

// This defines a Schema for a blog post
const postSchema = new Schema({
    postStatus: { // Published or Draft. Note that we won't be able to schedule posts in GRBv1.0
        type: String,
        // required: true,
        // TODO: Might need to set a default value here. The HTML dropdown box might be able to do this for us instead of here.
    },
    author: { // The values for this must be selected from the list of extant users.
        type: String,
        // TODO: Figure out how to add the "required" field to all fields in here.
        // required: true,
    },
    featuredImage: {
        type: String,
    },
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
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
}, { timestamps: true }); // This will automatically genrate timestamps on each blog object

// This will mean that mongoose is looking for the "Posts" collection in the MongoDB database. The name it looks for is the plural of the passed name.
const Post = mongoose.model('Post', postSchema);

// Exporting this module so that it can be used elsewhere in the project.
module.exports = Post;