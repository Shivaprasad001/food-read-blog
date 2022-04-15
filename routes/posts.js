const express = require('express');
const router = express.Router();
const Post = require('./../models/post');

router.get('/', (req, res) => {
    Post.find({}).exec((err, posts) => {
        res.render('posts', { posts, isUserLoggedIn: req.session.isUserLoggedIn });
    })
});

router.get('/posts/:id', (req, res) => {
    const id = req.params.id;
    Post.findById({_id: id}).exec((error, post) => {
        res.render('detail', { post, isUserLoggedIn: false });
    })
});

module.exports = router;