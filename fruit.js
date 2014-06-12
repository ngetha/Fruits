var mongoose = require('mongoose');
var winston = require('winston');
var redis = require("redis");

// connect
mongoose.connect('mongodb://localhost/a');

// schema object
var Schema = mongoose.Schema; 

// redis connect
var client = redis.createClient({host: '127.0.0.1', port : 6379});

// handler for disconnect
client.on("error", function (err) {
	winston.error("redis error " + err);
});

// Fruits
var FruitSchema = new Schema({  
    name: { type: String, required: true, unique: true },  
    vitamins: { type: String, required: true },  
    carbs: { type: String},  
    modified: { type: Date, default: Date.now }
});


// the model
var Fruit = mongoose.model('Fruit', FruitSchema);

/**
	Fruit API
*/
module.exports = exports  = FruitAPI = function(){
	/**
		List all the Fruits
	*/
	this.list = function(req, res) {
		// stats collection
	    client.hincrby("stats", "list-calls",1, redis.print);
		
		return Fruit.find(function(err, fruits){
			if(err){
			    // stats collection
				client.hincrby("stats", "list-calls-ok",1, redis.print);
				
				winston.error(err);
				return res.send({status:500, msg : "Could not complete request"});
			}
			else{
				winston.info('Found %s fruits', JSON.stringify(fruits));
				return res.send(fruits);
			}
		});
	},
	
	/**
		Find a Fruit of a given name
		@param name - expected in the POST body
	*/
	this.findByName = function(req,res){	
		   // stats collection
		   client.hincrby("stats", "find-calls",1, redis.print);
		   
		  // query
		  return Fruit.find({name: req.params.name.toLowerCase()}, function (err, fruit) {
			if (!err) {
			  // stats collection
			  client.hincrby("stats", "find-calls-ok",1, redis.print);
			  
			  // send
			  winston.info('Found %s', JSON.stringify(fruit));
			  return res.send(fruit);
			} else {
			  winston.warn('Not Found %s', err);
			  return res.send(err);
			}
		  });
	},
	
	/**
		Given a fruit details create a new fruit
		@param name, carbs, vitamins - expected in the POST Body
	*/
	this.mkFruit = function(req, res){	
          // stats collection
		  client.hincrby("stats", "create-calls",1 , redis.print);
		   
		  // mk fruit
		  fruit = new Fruit({
			name: req.body.name.toLowerCase(),
			carbs: req.body.carbs,
			vitamins: req.body.vitamins,
		  });
		  
		  // save fruit
		  fruit.save(function (err) {
			if (!err) {
			  // stats collection
		      client.hincrby("stats", "create-calls-ok",1, redis.print); 
			  
			  winston.info("Fruit Created %s", JSON.stringify(fruit));
			  return res.send(fruit);
			} else {
			  winston.error(err);
			  return res.send(err);
			}
	  });
	},
	
	/**
		Given a name of a fruit from PUT /path/foo/<FruitName> 
		and Fruit params in the post body, update them.
		
		It assumes all params of the fruit are there
	*/
	this.updateFruit =  function(req, res){
	    // stats collection
		client.hincrby("stats", "update-calls",1 , redis.print);
		  
		return Fruit.update({name: req.params.name.toLowerCase()}, {vitamins : req.body.vitamins, carbs : req.body.carbs}, 
			function (err, fruit) {
				if (!err) {
				  // stats collection
				  client.hincrby("stats", "update-calls-ok",1 , redis.print);
		
				  winston.info("Fruit Updates %s", JSON.stringify(fruit));
				  return res.send(fruit > 0 ? {"status" : "200 ok"} : {"status" : "400 no-such-fruit"});
				} else {
				  winston.error(err);
				  return res.send(err);
				}		  
		});
	},
	
	/**
		Given a name of a fruit from DELETE /path/foo/<FruitName> 
		and Fruit params in the post body, update them.
		
		It assumes all params of the fruit are there
	*/
	this.deleteFruit = function(req, res){
	    // stats collection
		client.hincrby("stats", "delete-calls",1 , redis.print);
		
		return Fruit.remove({name: req.params.name.toLowerCase()},
		function (err, fruit) {
			if (!err) {
		      // stats collection
			  client.hincrby("stats", "delete-calls-ok",1 , redis.print);
			  
			  winston.info("Fruit Removed %s", JSON.stringify(fruit));
			  return res.send(fruit > 0 ? {"status" : "200 Ok"} : {"status" : "404 no-such-fruit"});
			} else {
			  winston.error(err);
			  return res.send(err);
			}
	  
		});
	},
	
	/**
		Print the stats Hash Set with the key stats
	**/
	this.getStats = function(req, res){
		return client.hgetall("stats", function(err, resp){
			
			if (!err) {
			    winston.info("Stats -> %s", JSON.stringify(resp));
				return res.send(JSON.stringify(resp));
			}
			else{
				winston.error(err);
				return res.send(err);
			}
		});
	}
	
	
}