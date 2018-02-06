const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const fs = require('fs')
const im = require('imagemagick')

const request = require('request')
const app = express();
const jsonPatch = require("json-patch")
const router = express.Router();
const userController = require('./controllers/users');
const config = require('./config/config.js')

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