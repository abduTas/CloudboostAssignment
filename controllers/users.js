const config = require('../config/config.js')

exports.getRegistration = (jwt,passcode)=>{
	return (req,res,next)=>{
	let username = req.body.username;
	let password  = req.body.password
	if(username == undefined || username == null || password== undefined || password == null)
		 res.json({ statusCode:404, message: 'username/password not provided' }); 
	else{	  
		let user = {username:username,password:password}
		let token = jwt.sign({user:user}, passcode, {
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

exports.verifyLogin = (jwt,passcode)=>{
	return (req,res,next)=>{
		let token = req.body.token || req.query.token || req.headers['x-access-token'];
		jwt.verify(token,passcode,(err,decoded)=>{
			if(err){
				return res.json({ statusCode:404,message: 'Failed to authenticate token.' });    
			}
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
         next();
		})
	}
}

exports.applyPatch = (jsonPatch,config)=>{
	return (req,res,next)=>{
		console.log("patch ",req.body)
		let obj = req.body.jsonObject
		let patch  = req.body.jsonPatchObject
		jsonPatch.apply(obj, [patch]);
		res.json({
			statusCode:200,
			message:"result after applying patch",
			data:obj
		})
	}
}

exports.downloadFileFromUrl = (request,im,fs)=>{
	return (req,res,next)=>{
		let uri = req.body.uri
		if(uri == null){
			uri = config.imageUrl
		}
		let download = (uri, filename, callback)=>{
		  request.head(uri, (err, res, body)=>{
		    console.log('content-type:', res.headers['content-type']);
		    console.log('content-length:', res.headers['content-length']);

		    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
		  });
		};

		download(uri, 'google.png', ()=>{
		    console.log('downloaded file');
			im.resize({
			  srcPath: './google.png',
			  dstPath: 'google.png',
			  width: 50,
			  height:50
			}, (err, stdout)=>{
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
