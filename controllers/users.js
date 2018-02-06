var config = require('../config/config.js')
exports.getRegistration = function(jwt,passcode){
	return function(req,res,next){
	var username = req.body.username;
	var password  = req.body.password
	console.log(username + " " + password)
	if(username == undefined || username == null || password== undefined || password == null)
		 res.json({ statusCode:404, message: 'username/password not provided' }); 
	else{	  
		var user = {username:username,password:password}
		var token = jwt.sign({user:user}, passcode, {
	          expiresIn: 1000
	        });
	
	        // return the information including token as JSON
        res.json({
          statusCode:200,
          message: 'Enjoy your token!',
          token: token,
          user:req.body
        });
	}        
 } 
}

exports.verifyLogin = function(jwt,passcode){
	return function(req,res,next){
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		console.log("token",token)
		jwt.verify(token,passcode,function(err,decoded){
			if(err){
				return res.json({ statusCode:404,message: 'Failed to authenticate token.' });    
			}
			console.log("decoded",decoded)
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
         next();
		})
	}
}

exports.applyPatch = function(jsonPatch,config){
	return function(req,res,next){
		console.log("patch ",req.body)
		var obj = req.body.jsonObject
		var patch  = req.body.jsonPatchObject
		jsonPatch.apply(obj, [patch]);
		console.log("patch ",patch+ "res",obj)
		res.json({
			statusCode:200,
			message:"result after applying patch",
			data:obj
		})
	}
}

exports.downloadFileFromUrl = function(request,im,fs){
	return function(req,res,next){
		var uri = req.body.uri
		if(uri == null){
			uri = config.imageUrl
		}
		console.log("uri"+uri)		
		var download = function(uri, filename, callback){
		  request.head(uri, function(err, res, body){
		    console.log('content-type:', res.headers['content-type']);
		    console.log('content-length:', res.headers['content-length']);

		    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
		  });
		};

		download(uri, 'google.png', function(){
		    console.log('downloaded file');
			im.resize({
			  srcPath: './google.png',
			  dstPath: 'google.png',
			  width: 50,
			  height:50
			}, function(err, stdout){
			  if (err) throw err;
			  console.log('resized image to fit 50*50');
			  res.json({
				statusCode:200,
				message:"download successful"
			  })
			});
		});
	}
}
