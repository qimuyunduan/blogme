
/*global require, module */

var _           = require('lodash'),
	promise     = require('bluebird'),
    api         = require('../api/index'),
    path        = require('path'),
    errors      = require('../errors/index'),
	utils       = require('../utils'),
    handleError = require('./error'),
    reply       = require('./sendResponse'),
    setRequestIsSecure  = require('./secure'),
	models              = require('../models'),
    controllers;

function getResult(req,res,options,url,fromCollection) {

	if(models[options.model]){


		if(fromCollection){
			models[options.model].collection().forge(options.requestParas).fetch()
				.then(function(collection){

					console.log(collection.toJSON());
					return reply.replyWithPageData(model.toJSON(),options.fetchFields) ;

				}).then(function(result){
					if(result.err){
						res.send("数据操作失败...");
					}
					res.render(url,result.data);
			}).catch(function(){
				res.send("数据操作失败...");
			})
		}
		else{
			models[options.model].model().forge(options.requestParas).fetch()
				.then(function(model){
					if(model&&url=='index'){
						//handle login
						//console.log(reply.replyWithData(model.toJSON(),options.fetchFields)) ;
						var result = reply.replyWithData(model.toJSON(),options.fetchFields) ;
						if(!result.err){

							if(utils.isValidUser(req.body.pwd,result.data[0],result.data[i])){
								// set cookie
								if(req.body.rememberName=="on"){
									if(!req.cookies.loginUserName){
										res.cookie("loginUserName",req.body.userName,{maxAge:60*1000*60*24*30})
									}
								}
								// set session
								//TODO:
								res.redirect("/authorized");
							}
						}

						else{
							res.send("用户名或密码错误...");
						}
					}

				}).catch(function(){
				promise.reject(reply.fail()) ;
			})
		}

	}
}

controllers = {

	handleRequest: function (req,res,options) {
		return getResult(options);
	}

};

module.exports = controllers;
