var path          = require('path'),
	Promise       = require('bluebird'),
	chalk         = require('chalk'),
	crypto        = require('crypto'),
	fs            = require('fs'),
	url           = require('url'),
	_             = require('lodash'),
	errors        = require('../errors'),
	defaultConfig = require('../../../config.js'),
	appRoot       = path.resolve(__dirname, '../../../'),
	corePath      = path.resolve(appRoot, 'core/');

function ConfigManager(config) {
	this._config = {};
	if (config && _.isObject(config)) {
		this.set(config);
	}
}


/**
 * Allows you to set the config object.
 * @param {Object} config Only accepts an object at the moment.
 */
ConfigManager.prototype.set = function (config) {


	_.merge(this._config, config);

	this._config.paths = this._config.paths || {};

	// Allow contentPath to be over-written by passed in config object
	// Otherwise default to default content path location
	contentPath = this._config.paths.contentPath || path.resolve(appRoot, 'content');

	_.merge(this._config, {
		paths: {
			appRoot:          appRoot,
			config:           this._config.paths.config || path.join(appRoot, 'config.js'),
			corePath:         corePath,
			contentPath:      contentPath,
			imagesPath:       path.resolve(contentPath, 'images'),
			imagesRelPath:    'content/images',
			adminViews:       path.join(corePath, '/server/views/'),
			helperTemplates:  path.join(corePath, '/server/helpers/tpl/')

		},
		uploads: {
			// Used by the upload API to limit uploads to images
			extensions: ['.jpg', '.jpeg', '.gif', '.png', '.svg', '.svgz'],
			contentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml']
		},
		logging:true

	});

	_.extend(this, this._config);
};

/**
 * Allows you to read the config object.
 * @return {Object} The config object.
 */
ConfigManager.prototype.get = function () {
	return this._config;
};

ConfigManager.prototype.load = function () {

	return new Promise(function (resolve, reject) {});
};

/**
 * Read config.js file from file system using node's require
 * @param  {String} envVal Which environment we're in.
 * @return {Object}        The config object.
 */
ConfigManager.prototype.readFile = function (envVal) {
	return this._config[envVal];
};


module.exports = new ConfigManager(defaultConfig);//调用构造函数
