
/*global require, module */

var _           = require('lodash'),
    api         = require('../api/index'),
    path        = require('path'),
    config      = require('../config/index'),
    errors      = require('../errors/index'),
    Promise     = require('bluebird'),

    handleError         = require('./error'),
    reply       = require('./sendResponse'),
    setRequestIsSecure  = require('./secure'),
	models              = require('../models'),
    controllers;



controllers = {

	A: function (options) {

	},
	D: function(options){

	},
	U: function (options) {

	},
	Q: function(options){

		if(models[options.model]){
			models[options.model].collection().forge(options.requestParas).fetch()
				.then(function(collection){
				console.log(typeof  collection.toArray());//object
				console.log(collection.toJSON());
			}).catch(function(err){
				console.log(err);
			})
		}
	}

};

module.exports = controllers;
