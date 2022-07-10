// This file defines a model for a blog post.

const mongoose = require('mongoose');
const Schema = mongoose.Schema; // .Schema is a constructor function

// This defines a Schema for an email subscriber
const emailSubscriberSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true }); // This will automatically genrate timestamps on each blog object

// This will mean that mongoose is looking for the "Posts" collection in the MongoDB database. The name it looks for is the plural of the passed name.
const EmailSubscriber = mongoose.model('EmailSubscriber', emailSubscriberSchema);

// Exporting this module so that it can be used elsewhere in the project.
module.exports = EmailSubscriber;