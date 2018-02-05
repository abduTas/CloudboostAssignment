var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken')
var fs = require('fs')
var im = require('imagemagick')
var sharp = require('sharp');

var request = require('request')
var app = express();
var jsonPatch = require("json-patch")
var router = express.Router();
var userController = require('./routes/users');
var config = require('./config/config.js')


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

router.route('/download')
	.get(function(req,res,next){
		var download = function(uri, filename, callback){
		  request.head(uri, function(err, res, body){
		    console.log('content-type:', res.headers['content-type']);
		    console.log('content-length:', res.headers['content-length']);

		    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
		  });
		};

		download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function(){
		  console.log('downloaded');
		im.resize({
		  srcPath: './google.png',
		  dstPath: 'google-mini.png',
		  width: 50,
		  height:50
		}, function(err, stdout, stderr){
		  if (err) throw err;
		  console.log('resized image to fit 50*50');
		});

		});
	})


app.use('/', router);
// app.use('/users', users);
app.all('*', function(req, res) {
  res.send("wrong route ERROR 404");
});
app.listen(8000);
console.log('Server started on port 8000');
