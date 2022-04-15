const express = require('express');
const router = express.Router();
const session = require('express-session');
const Users = require('./../models/users');

router.get('/login', (req, res) => {
    res.render('login', {isUserLoggedIn : false});
})

router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

   Users.findOne({username, password}).exec((error, user) => {
       if(user) {
           req.session.username = user.username,
           req.session.isUserLoggedIn = true;
           res.redirect('/admin');
       } else {
           res.render('login', {isUserLoggedIn: false, error: "Sorry Login Failed. Please try again!"})
       }
   })
});

router.get('/logout', (req, res) => {
    req.session.username = "";
    req.session.isUserLoggedIn = false;
    res.redirect('/');
})

module.exports = router;
