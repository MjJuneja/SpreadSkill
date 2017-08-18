'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
//var cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const mfavicon=require("express-favicon");
const mongoStore = require('connect-mongo')(session);

const app = express();

const config= require('./config/config');


app.use(function(request,response,next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//app.use(cookieParser());


app.use(session({
    secret:config.sessionKey,
    saveUninitialized:false,
    resave:true,
    //httpOnly: true, //default true
    //secure: true,
    //ssl
    //ephemeral: true
    store: new mongoStore({
        url: config.mongoUrl,
        //ttl: 14 * 24 * 60 * 60,//14 days 
        ttl: config.defaultSessionDuration,// 2 hours 
        //mongoOptions: advancedOptions // See below for details 
    })
}));
module.exports=app;

const index = require('./routes/index');
const commonroutes = require('./routes/commonroutes');
const signup = require('./routes/signup');
const login = require('./routes/login');
const profile = require('./routes/profile');
const forgotpassword = require('./routes/forgotpassword');
const social =require('./routes/social');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(mfavicon(__dirname + '/public/favicon.icon'));

const Book =require('./models/book');
const mongoose  = require("mongoose");
mongoose.connect('mongodb://localhost/bookstore');
var db = mongoose.connection;
//books

app.get('/books', (req, res) => {
	Book.getBooks((err, books) => {
		if(err){
			throw err;
		}
		res.json(books);
	});
});

app.get('/books/:_id', (req, res) => {
	Book.getBookById(req.params._id, (err, book) => {
		if(err){
			throw err;
		}
		res.json(book);
	});
});

app.post('/books', (req, res) => {
	var book = req.body;
	Book.addBook(book, (err, book) => {
		if(err){
			throw err;
		}
		res.json(book);
	});
});

app.put('/books/:_id', (req, res) => {
	var id = req.params._id;
	var book = req.body;
	Book.updateBook(id, book, {}, (err, book) => {
		if(err){
			throw err;
		}
		res.json(book);
	});
});

app.delete('/books/:_id', (req, res) => {
	var id = req.params._id;
	Book.removeBook(id, (err, book) => {
		if(err){
			throw err;
		}
		res.json(book);
	});
});

//app.use(session({ secret:"string"}));
app.use('/', index);
app.use('/commonroutes',commonroutes);
app.use('/signup',signup);
app.use('/login',login);
app.use('/profile',profile);
app.use('/forgotpassword',forgotpassword);
app.use('/social',social);
app.use('*',index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.listen(1234,function(){
    console.log("Server Started....");
})

