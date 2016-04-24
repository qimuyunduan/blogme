
/*global require, module */

var _           = require('lodash'),
    api         = require('../api/index'),
    path        = require('path'),
    config      = require('../config/index'),
    errors      = require('../errors/index'),
    Promise     = require('bluebird'),

    handleError         = require('./error'),
    formatResponse      = require('./format-response'),
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

	}

};

module.exports = controllers;
