
/*global require, module */

var _           = require('lodash'),
    api         = require('../api/index'),
    path        = require('path'),
    errors      = require('../errors/index'),
    handleError = require('./error'),
    reply       = require('./sendResponse'),
    setRequestIsSecure  = require('./secure'),
	models              = require('../models'),
    controllers;

function getResult(options,fromCollection) {

	if(models[options.model]){

		if(fromCollection){
			models[options.model].collection().forge(options.requestParas).fetch()
				.then(function(collection){
					console.log(typeof  collection.toArray());//object
					console.log(collection.toJSON());
				}).catch(function(){
				reply.fail();
			})
		}
		else{
			models[options.model].model().forge(options.requestParas).fetch()
				.then(function(model){

				}).catch(function(){
				reply.fail();
			})
		}

	}
}

controllers = {

	A: function (options) {
		getResult(options);
	},
	D: function(options){
		getResult(options);
	},
	U: function (options) {
		getResult(options);
	},
	Q: function(options){
		getResult(options,true);
	}

};

module.exports = controllers;
