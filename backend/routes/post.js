const express = require('express');

const postController = require('../controller/post');

const router = express.Router();

router.get('/', postController.getPosts);

router.post('/', postController.createPost);

router.get('/:id', postController.getPost);

router.put('/:id', postController.updatePost);

router.delete('/:id', postController.deletePost);

module.exports = router;


