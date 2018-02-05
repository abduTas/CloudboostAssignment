
exports.getRegistration = function(jwt,passcode){
	return function(req,res,next){
	var username = req.body.username;
	var password  = req.body.password
	var user = {username:username,password:password}
	var token = jwt.sign({user:user}, passcode, {
          expiresIn: 1000
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token,
          user:req.body
        });
 } 
}

exports.verifyLogin = function(jwt,passcode){
	return function(req,res,next){
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		console.log("token",token)
		jwt.verify(token,passcode,function(err,decoded){
			if(err){
				return res.json({ success: false, message: 'Failed to authenticate token.' });    
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
			status:200,
			message:"result after applying patch",
			data:obj
		})
	}
}

// // Register Page - GET
// router.get('/register', function(req, res){
// 	res.render('register', { message: req.flash('signupMessage','That email is already taken.') });
// });

// // Register - POST
// router.post('/register', function(req, res){
// 	// Get Form Values
// 	var name     		= req.body.name;
// 	var email    		= req.body.email;
// 	var username 		= req.body.username;
// 	var password 		= req.body.password;
// 	var password2 		= req.body.password2;



// 		var newUser = {
// 			name: name,
// 			email: email,
// 			username:username,
// 			password: password
// 		}
// 		var nuser = users({name:name,email:email,username:username,password:password
// 		});

// 		bcrypt.genSalt(10, function(err, salt){	
// 			bcrypt.hash(nuser.password, salt, function(err, hash){
// 			nuser.password = hash;

//                 nuser.save(function(err) {
//                     if (err)
//                         throw err;
//                     else{
// 					console.log('User Added...'+nuser);

// 					res.redirect('/');         
// 					}
// 		      });

// 			});
// 		});

// 		// bcrypt.genSalt(10, function(err, salt){	
// 		// 	bcrypt.hash(newUser.password, salt, function(err, hash){
// 		// 	newUser.password = hash;

// 		// 	db.users.insert(newUser, function(err, doc){
// 		// 		if(err){
// 		// 			res.send(err);
// 		// 		} else {
// 		// 			console.log('User Added...'+newUser);

// 		// 			res.redirect('/');
// 		// 		}
// 		// 	});
// 		// 	});
// 		// });
// });

// passport.serializeUser(function(user, done) {
//   done(null, user._id);
// });

// passport.deserializeUser(function(id, done) {
//  db.users.findOne({_id: mongojs.ObjectId(id)}, function(err, user){
//  	done(err, user);
//  });
// });

// passport.use(new LocalStrategy(
// 	function(username, password, done){
// 		db.users.findOne({username: username}, function(err, user){
// 		if(err) {
// 			return done(err);
// 		}
// 		if(!user){
// 			return done(null, false, {message: 'Incorrect username'});
// 		}

// 		bcrypt.compare(password, user.password, function(err, isMatch){
// 		if(err) {
// 			return done(err);
// 		}
// 		if(isMatch){
// 			return done(null, user);
// 		} else {
// 			return done(null, false, {message: 'Incorrect password'});
// 		}
// 		});
// 	 });
// 	}
// 	));

// // Login - POST
// router.post('/login',
//   passport.authenticate('local', { successRedirect: '/',
//                                    failureRedirect: '/users/login',
//                                     }), 
//   function(req, res){
//   	console.log('Auth Successfull');
//   	res.redirect('/');
//   });

// router.get('/logout', function(req, res){
// 	req.logout();
// 	res.redirect('/users/login');
// });

