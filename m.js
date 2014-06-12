// imports
var mongoose 	 = require('mongoose');
var express 	 = require("express");
var session 	 = require('express-session')
var winston 	 = require('winston');
var bodyParser 	 = require('body-parser')
var FruitApi 	 = require("./fruit.js");
var cookieParser = require('cookie-parser')

// passport
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

// password auth  
passport.use(new LocalStrategy(
  function(username, password, done) {
	winston.info("authenticating user %s", username);
	if(username == "foo" && password == "bar"){
	    winston.info("auth OK %s", username);
		return done(null, {login : 100, id : 4});
	}
	else{
	    winston.info("auth Fail %s", username);
		return done(null, false, { message: 'Bad Credentials'});
	}
  }
));

// function to serialize logged in user
passport.serializeUser(function(user, done) {
  winston.info("serializing user %s", JSON.stringify(user));
  done(null, user.id);
});

// function to de serialize logged in user
passport.deserializeUser(function(id, done) {
  winston.info("de-serializing user with id %s", id);
  /*User.findById(id, function(err, user) {
    done(err, user);
  });*/
  return done(null, {login : 100, id : 4});
});

// instance of the API
var api = new FruitApi();

// express
var app = express();

// app usage
app.use(cookieParser()) 
app.use(bodyParser());
app.use(passport.initialize());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.session());

// log incoming requests
app.use(function(req, res, next){
  winston.info('%s %s %s <- %s', req.protocol, req.method, req.url, req.ip);
  next();
});

// authenticate incoming requests
app.use(passport.authenticate('local'), function(req, res, next){
  next();
});

// list all fruits
app.get('/api/fruits', function(req, res){
	winston.info('listing all fruits x');
	
	// call to API
	return api.list(req,res);
});

// find fruit by name
app.get('/api/fruits/:name', function (req, res){
  // log
  winston.info('looking for a fruit with the name %s',req.params.name );
  
  // call to API
  return api.findByName(req, res);
});

// create a fruit
app.post('/api/fruits', function (req, res){
  var fruit;
  winston.info("create fruit -> with request body ->  %s, ", JSON.stringify(req.body));
  return api.mkFruit(req, res);
});

// update a fruit
app.put('/api/fruits/:name', function (req, res){

   // log
   winston.info("updating fruit %s -> with request body ->  %s ", req.params.name.toLowerCase() , JSON.stringify(req.body));
   
   // call to API
   api.updateFruit(req, res);
});

// delete a fruit
app.delete('/api/fruits/:name', function (req, res){

   // log
   winston.info("removing fruit %s -> ", req.params.name.toLowerCase());
   
   // call to API
   return api.deleteFruit(req, res);
});

// get stats
app.get('/api/stats', function (req, res){
   // log
   winston.info("printing stats");
   
   // call to API
   return api.getStats(req, res);
});

// thing verse
app.get('/thing/verse', passport.authenticate('local'),
	function(req, res){
	res.send("Valar Morghulis");
});


var port = 3000
winston.info('valar morghulis http://127.0.0.1:%s', port);
app.listen(port);