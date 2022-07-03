const express = require('express');
const adminController = require('../controllers/adminController')

const router = express.Router();

// Displays the form to create a new blog post.
router.get('/create', adminController.serve_create_post_page);

module.exports = router;