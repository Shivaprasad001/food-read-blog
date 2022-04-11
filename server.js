const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const articleRoutes = require('./routes/posts');
const loginRoutes = require('./routes/login');
const adminRoutes = require('./routes/admin');
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/foodreadblog',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'thisistherandomsecretkey',
    resave: false,
    saveUninitialized: true
}));
app.set('views', [
    path.join(__dirname, 'views'),
    path.join(__dirname, 'views/admin')
]);
app.use(express.static(path.join(__dirname + '/public')));
app.set('view engine', 'ejs');

app.use(loginRoutes);
app.use(articleRoutes);
app.use('/admin', adminRoutes);

app.listen(5000);