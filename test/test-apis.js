const supertest =require('supertest');
const chai =require ('chai');
const chaiHttp = require('chai-http')
const should = chai.should();
const server =require('../app.js');
const request=require('request');
const expect    = require("chai").expect;
const config =require("../config/config");
const querystring =require("querystring");

describe("Server",(req,res)=>{
	var token ;
	describe("Auth Testing",(req,res)=>{

		it("authApiTestingPositive",(done)=>{
			let uri = config.appUrl +config.auth
			let username = "Abdulla"
			let password = "Tasleem"
			let formdata = {username:username,password:password}
			let headers = {
	            'Content-Length': querystring.stringify(formdata).length,
	            'Content-Type': 'application/x-www-form-urlencoded'
          	}
          	let requestoptions = {}
		 	requestoptions.uri = uri
		 	requestoptions.body = querystring.stringify(formdata)
		 	requestoptions.method = "post"
		 	requestoptions.headers = headers

          	request(requestoptions, function(err, response, body) {
		    	if(err){
		    		console.log("err"+err)
		    	}
		    	let parsedbody = JSON.parse(body)
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
			let uri = config.appUrl +config.auth
			let username = "Abdulla"
			let formdata = {username:username}
			let headers = {
	            'Content-Length': querystring.stringify(formdata).length,
	            'Content-Type': 'application/x-www-form-urlencoded'
          	}
          	let requestoptions = {}
		 	requestoptions.uri = uri
		 	requestoptions.body = querystring.stringify(formdata)
		 	requestoptions.method = "post"
		 	requestoptions.headers = headers

          	request(requestoptions, function(err, response, body) {
		    	if(err){
		    		console.log("err"+err)
		    	}
		    	let parsedbody = JSON.parse(body)
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
			let uri  = config.appUrl+config.applyPatch
		 	let postData = {
					jsonObject:{
					"name":"abdulla",
					"surname":"tasleem",
					"designation":"MERN stack developer",
					"op":"add"},
					jsonPatchObject:{op: 'add', path: '/foo', value: 'bar'},
					token:token
					}
		 	let options = {
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
			let uri  = config.appUrl+config.applyPatch
		 	let postData = {
					jsonObject:{
					"name":"abdulla",
					"surname":"tasleem",
					"designation":"MERN stack developer",
					"op":"add"},
					jsonPatchObject:{op: 'add', path: '/foo', value: 'bar'},
					}
		 	let options = {
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
			let url = config.appUrl +config.downloadImage
			let uri = "https://www.google.com/images/srpr/logo3w.png"
			let formdata = {uri:uri}
			let headers = {
	            'Content-Type': 'application/x-www-form-urlencoded',
	            'x-access-token' : token
          	}
          	let requestoptions = {}
		 	requestoptions.url = url
		 	requestoptions.method = "post"
		 	requestoptions.headers = headers

          	request(requestoptions, function(err, response, body) {
		    	if(err){
		    		console.log("err"+err)
		    	}
		    	let parsedbody = JSON.parse(body)

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