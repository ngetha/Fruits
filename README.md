Fruits
======

Fruit API - Node JS

A simple API app I created to learn Node

It uses MongoDB, Redis + Passport for Auth

API Exposes a REST API -> Make Sure to add username=foo&password=bar to all requests

```
GET /api/fruits -> creates fruits
GET /api/fruits/:name -> find a fruit with a given name
POST /api/fruits -> create a fruit from the post data
PUT /api/fruits/:name -> Update a fruit attributes
DELETE /api/fruits/:name -> Delete a fruit of a given name
```

```Javascript
// The Fruit Model
var FruitSchema = new Schema({  
    name: { type: String, required: true, unique: true },  
    vitamins: { type: String, required: true },  
    carbs: { type: String},  
    modified: { type: Date, default: Date.now }
});
```
