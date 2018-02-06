var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken')
var fs = require('fs')
var im = require('imagemagick')

var request = require('request')
var app = express();
var jsonPatch = require("json-patch")
var router = express.Router();
var userController = require('./controllers/users');
var config = require('./config/config.js')

//Body parser for getting form data

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Define Routes


router.route('/auth')
.post(userController.getRegistration(jwt,config.passcode))

router.route('/login')
	.post(userController.verifyLogin(jwt,config.passcode))

//Send json object with json patch object ,It return the reultant json object after applying the 
//corresponding json patch operation defined in patch object 
router.route('/applyPatch')
	.post(userController.verifyLogin(jwt,config.passcode),userController.applyPatch(jsonPatch,config))	

router.route('/downloadImage')
	.post(userController.verifyLogin(jwt,config.passcode),userController.downloadFileFromUrl(request,im,fs))


app.use('/', router);

app.all('*', function(req, res) {
  res.json({message:"wrong route ERROR 404"});
});
var server = app.listen(8000,function(){
	console.log('Server started on port 8000');
});

module.exports = server