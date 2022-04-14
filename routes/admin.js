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

router.post('/edit/:id', [
    check ('title', 'Title is required!').notEmpty(),
    check('slug', 'Slug is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
], (req, res) => {
    if(!req.session.isUserLoggedIn) {
        res.redirect('/login');
    } else {
        const id = req.params.id;
        var file;
        let fileName;
        if(req.files) {
            file = req.files.file;
            fileName = file.name;
            file.mv(`public/assets/uploads/${fileName}`, function(err) {
                console.log(err)
            });
        }
        Post.findOne({_id: id}).exec((error, post) => {
            if(post) {
                post.title = req.body.title ? req.body.title : page.title;
                post.slug = req.body.slug ? req.body.slug : post.slug;
                post.createdDate = new Date();
                post.description = req.body.description ? req.body.description : post.description;
                if(fileName) {
                    post.image = fileName;
                }
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
    check('slug', 'Slug is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
], async (req, res) => {
    if(!req.session.isUserLoggedIn) {
        res.redirect('/login');
    } else {
        let errors = validationResult(req);
        var file;
        let fileName;
        if (!errors.isEmpty())
        {
            res.render('new', {post: new Post(), errors : errors.array()});
        } else {
            if(req.files) {
                file = req.files.file;
                fileName = file.name;
                file.mv(`public/assets/uploads/${fileName}`, function(err) {
                    console.log(err)
                });
            }

            const post = new Post({
                title: req.body.title,
                slug: req.body.slug,
                description: req.body.description,
                image: fileName,
            });
            try {
                result = await post.save();
            res.redirect(`/admin/posts/${post.id}`);  
            } catch (error) {
                res.render('new', { post });
            }
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