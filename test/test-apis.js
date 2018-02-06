var supertest =require('supertest');
var chai =require ('chai');
var chaiHttp = require('chai-http')
var should = chai.should();
var server =require('../app.js');
var request=require('request');
var expect    = require("chai").expect;
var config =require("../config/config");
var querystring =require("querystring");
// var cookieParser = require('cookie-parser');
// var loginHelper = require('../loginhelper');

describe("Server",(req,res)=>{
	var token
	describe("Auth Testing",(req,res)=>{

		it("authApiTestingPositive",(done)=>{
			var uri = config.appUrl +config.auth
			var username = "Abdulla"
			var password = "Tasleem"
			var formdata = {username:username,password:password}
			var headers = {
	            'Content-Length': querystring.stringify(formdata).length,
	            'Content-Type': 'application/x-www-form-urlencoded'
          	}
          	var requestoptions = {}
		 	requestoptions.uri = uri
		 	requestoptions.body = querystring.stringify(formdata)
		 	requestoptions.method = "post"
		 	requestoptions.headers = headers

          	request(requestoptions, function(err, response, body) {
		    	if(err){
		    		console.log("err"+err)
		    	}
		    	var parsedbody = JSON.parse(body)
		    	token = parsedbody.token
				console.log(body+"here"+JSON.stringify(parsedbody))
				response.should.have.property('statusCode').eql(200);
		 		response.should.be.a('object');
		 		response.should.have.property('body');
		 		expect(response.body).to.not.equal(null)
		 		parsedbody.should.have.property('token')
				done()
			})
		})
		it("authApiTestingNegative",(done)=>{
			var uri = config.appUrl +config.auth
			var username = "Abdulla"
			var formdata = {username:username}
			var headers = {
	            'Content-Length': querystring.stringify(formdata).length,
	            'Content-Type': 'application/x-www-form-urlencoded'
          	}
          	var requestoptions = {}
		 	requestoptions.uri = uri
		 	requestoptions.body = querystring.stringify(formdata)
		 	requestoptions.method = "post"
		 	requestoptions.headers = headers

          	request(requestoptions, function(err, response, body) {
		    	if(err){
		    		console.log("err"+err)
		    	}
		    	var parsedbody = JSON.parse(body)
				console.log(body+"here"+JSON.stringify(response))
				parsedbody.should.have.property('statusCode').to.not.equal(200);
		 		response.should.be.a('object');
		 		parsedbody.should.not.have.property('token')
				done()
			})
		})
	})

	describe("testing applyPatch ",(req,res)=>{
		it("verifyApplyPatchApiPositive",(done)=>{
			var uri  = config.appUrl+config.applyPatch
		 	var postData = {
					jsonObject:{
					"name":"abdulla",
					"surname":"tasleem",
					"designation":"MERN stack developer",
					"op":"add"},
					jsonPatchObject:{op: 'add', path: '/foo', value: 'bar'},
					token:token
					}
		 	var options = {
			  method: 'post',
			  body: postData,
			  json: true,
			  uri: uri,
			}
			request(options, function(err, response, body) {
		    	if(err){
		    		console.log("err"+err)
		    	}
				response.should.have.property('statusCode').eql(200);
		 		response.should.be.a('object');
		 		body['data'].should.have.property('foo')
				done()
			})
		})

		it("verifyApplyPatchApiNegative",(done)=>{
			var uri  = config.appUrl+config.applyPatch
		 	var postData = {
					jsonObject:{
					"name":"abdulla",
					"surname":"tasleem",
					"designation":"MERN stack developer",
					"op":"add"},
					jsonPatchObject:{op: 'add', path: '/foo', value: 'bar'},
					}
		 	var options = {
			  method: 'post',
			  body: postData,
			  json: true,
			  uri: uri,
			}
			request(options, function(err, response, body) {
		    	if(err){
		    		console.log("err"+err)
		    	}
				response.should.have.property('statusCode').to.equal(200);
		 		response.should.be.a('object');
		 		body.should.not.have.property('data')
				done()
			})
		})		
	})



	describe("Testing downloadFile APi ",(req,res)=>{

		it("downloadFileApiTestingPositive",(done)=>{
			var url = config.appUrl +config.downloadImage
			var uri = "https://www.google.com/images/srpr/logo3w.png"
			var formdata = {uri:uri}
			var headers = {
	            'Content-Type': 'application/x-www-form-urlencoded',
	            'x-access-token' : token
          	}
          	var requestoptions = {}
		 	requestoptions.url = url
		 	requestoptions.method = "post"
		 	requestoptions.headers = headers

          	request(requestoptions, function(err, response, body) {
		    	if(err){
		    		console.log("err"+err)
		    	}
		    	var parsedbody = JSON.parse(body)

				response.should.have.property('statusCode').eql(200);
		 		response.should.be.a('object');
		 		response.should.have.property('body');
		 		expect(response.body).to.not.equal(null)
		 		parsedbody.should.have.property('message')
		 		parsedbody.should.have.property('message').eql('download successful')
				done()
			})
		})
	})		

	describe("Incorrect Path",(req,res)=>{
		it("Wrong path test",(done)=>{
			requestoptions={
				url: config.appUrl+'Wrongpath',
				method:'get'
			}
			request(requestoptions,function(err,response,body){
				response.should.not.have.property('message')
				done();
			})
		})
	})

})