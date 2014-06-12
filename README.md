Fruits
======

Fruit API - Node JS

A simple API app I created to learn Node

It uses MongoDB, Redis + Passport for Auth

API Exposes a REST API -> Make Sure to add ```username=foo&password=bar``` to all requests for simple Auth

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

Curl Samples
==

List Fruits
```
curl -X GET -H Cache-Control:no-cache -H Postman-Token:c2301f09-778e-b775-17aa-5091c48ad4c0 http://127.0.0.1:3000/api/fruits?username=foo&password=bar
```

Create Fruit
```
curl -X POST -H Cache-Control:no-cache -H Postman-Token:86bc444f-f080-b38b-d7b9-3e28e14e11e2 -H Content-Type:application/x-www-form-urlencoded -d 'name=Avocado&vitamins=A%2CB%2CC&carbs=16mg' http://127.0.0.1:3000/api/fruits
```

Find Fruit
```
curl -X GET -H Cache-Control:no-cache -H Postman-Token:2a016b7b-e251-55a8-4bc2-9a645103b22f http://127.0.0.1:3000/api/fruits/berry?username=foo&password=bar
```

Update Fruit
```
curl -X PUT -H Cache-Control:no-cache -H Postman-Token:e2329875-7666-5128-f92b-6cebb7844362 -H Content-Type:application/x-www-form-urlencoded -d 'vitamins=D&carbs=76mg' http://127.0.0.1:3000/api/fruits/avocado
```

Delete Fruit
```
curl -X DELETE -H Cache-Control:no-cache -H Postman-Token:1843fe20-30e3-c1de-14bf-0b6d95169a85 -H Content-Type:application/x-www-form-urlencoded -d 'false' http://127.0.0.1:3000/api/fruits/avocado
```

Get Stats
```
curl -X GET -H Cache-Control:no-cache -H Postman-Token:355cfdaa-524a-fac4-7735-2400c53db126 http://127.0.0.1:3000/api/stats
```

