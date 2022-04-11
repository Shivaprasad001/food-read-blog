const express = require('express');
const router = express.Router();
const upload = require('express-fileupload');
const Post = require('./../models/post');
const {check, validationResult} = require ('express-validator');

router.get('/', (req, res) => {
    if(!req.session.isUserLoggedIn) {
        res.redirect('/login');
    } else {
        Post.find({}).exec((error, posts) => {
            if(posts)
            res.render('admin/admin',  {posts});
        });
    }
});

router.get('/posts', (req, res) => {
    if(!req.session.isUserLoggedIn) {
        res.redirect('/login');
    } else {
        Post.find({}).exec((error, posts) => {
            if(posts)
            res.render('admin/admin',  {posts});
        });
    }
});

router.get('/posts/:id', (req, res) => {
    if(!req.session.isUserLoggedIn) {
        res.redirect('/login');
    } else {
        let id = req.params.id;
        Post.findById({_id: id}).exec((error, post) => {
            res.render('detail', {post, isUserLoggedIn: req.session.isUserLoggedIn});
        });
    }
});

router.get('/new', (req, res) => {
    if(!req.session.isUserLoggedIn) {
        res.redirect('/login');
    } else {
        res.render('admin/new', {post: new Post(), errors: undefined});
    }
})

router.post('/edit/:id', (req, res) => {
    if(!req.session.isUserLoggedIn) {
        res.redirect('/login');
    } else {
        const id = req.params.id;
        Post.findOne({_id: id}).exec((error, post) => {
            if(post) {
                post.title = req.body.title;
                post.slug = req.body.slug;
                post.createdDate = new Date();
                post.description = req.body.description;
                post.save();
                res.redirect('/admin/posts');
            } else {
                res.redirect('/posts');
            }
        });
    }
});

router.post('/new', [
    check ('title', 'Title is required!').notEmpty(),
], async (req, res) => {
    if(!req.session.isUserLoggedIn) {
        res.redirect('/login');
    } else {
        const errors = validationResult(req);
        if (!errors.isEmpty())
        {
            res.render('new', {post: new Post(), errors : errors.array()});
        }

        const post = new Post({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
        });
        try {
            result = await post.save();
        res.redirect(`/admin/posts/${post.id}`);  
        } catch (error) {
            res.render('new', { post });
        }
    }
});

router.get('/edit/:id', (req, res) => {
    if(!req.session.isUserLoggedIn) {
        res.redirect('/login');
    } else {
        let id = req.params.id;
        Post.findById({_id: id}).exec((error, post) => {
            if(!error) {
                res.render('new', { post })
            }
        })
    }
});

router.get('/delete/:id', (req, res) => {
    if(!req.session.isUserLoggedIn) {
        res.redirect('/login');
    } else {
        let id = req.params.id;
        Post.findByIdAndDelete({_id: id}).exec((error, order) => {
            if(!error) 
                res.redirect('/admin');
        });
    }
})

module.exports = router;