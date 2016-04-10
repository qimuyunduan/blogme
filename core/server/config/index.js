var path          = require('path'),
	Promise       = require('bluebird'),
	chalk         = require('chalk'),
	crypto        = require('crypto'),
	fs            = require('fs'),
	url           = require('url'),
	_             = require('lodash'),
	errors        = require('../errors'),
	appRoot       = path.resolve(__dirname, '../../../'),
	corePath      = path.resolve(appRoot, 'core/'),
	defaultConfig = {};

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
	var localPath = '',
		defaultStorage = 'local-file-store',
		contentPath,
		activeStorage,
		storagePath,
		subdir,
		assetHash;

	// Merge passed in config object onto our existing config object.
	// We're using merge here as it doesn't assign `undefined` properties
	// onto our cached config object.  This allows us to only update our
	// local copy with properties that have been explicitly set.
	_.merge(this._config, config);

	// Special case for the them.navigation JSON object, which should be overridden not merged
	if (config && config.theme && config.theme.navigation) {
		this._config.theme.navigation = config.theme.navigation;
	}

	// Protect against accessing a non-existant object.
	// This ensures there's always at least a paths object
	// because it's referenced in multiple places.
	this._config.paths = this._config.paths || {};

	// Parse local path location
	if (this._config.url) {
		localPath = url.parse(this._config.url).path;
		// Remove trailing slash
		if (localPath !== '/') {
			localPath = localPath.replace(/\/$/, '');
		}
	}

	subdir = localPath === '/' ? '' : localPath;

	if (!_.isEmpty(subdir)) {
		this._config.slugs.protected.push(subdir.split('/').pop());
	}

	// Allow contentPath to be over-written by passed in config object
	// Otherwise default to default content path location
	contentPath = this._config.paths.contentPath || path.resolve(appRoot, 'content');

	assetHash = this._config.assetHash ||
		(crypto.createHash('md5').update(packageInfo.version + Date.now()).digest('hex')).substring(0, 10);

	// Protect against accessing a non-existent object.
	// This ensures there's always at least a storage object
	// because it's referenced in multiple places.
	this._config.storage = this._config.storage || {};
	activeStorage = this._config.storage.active || defaultStorage;

	if (activeStorage === defaultStorage) {
		storagePath = path.join(corePath, '/server/storage/');
	} else {
		storagePath = path.join(contentPath, 'storage');
	}

	_.merge(this._config, {
		ghostVersion: packageInfo.version,
		paths: {
			appRoot:          appRoot,
			subdir:           subdir,
			config:           this._config.paths.config || path.join(appRoot, 'config.js'),
			configExample:    path.join(appRoot, 'config.example.js'),
			corePath:         corePath,

			storage:          path.join(storagePath, activeStorage),

			contentPath:      contentPath,
			themePath:        path.resolve(contentPath, 'themes'),
			appPath:          path.resolve(contentPath, 'apps'),
			imagesPath:       path.resolve(contentPath, 'images'),
			imagesRelPath:    'content/images',

			adminViews:       path.join(corePath, '/server/views/'),
			helperTemplates:  path.join(corePath, '/server/helpers/tpl/'),
			exportPath:       path.join(corePath, '/server/data/export/'),
			lang:             path.join(corePath, '/shared/lang/'),

			availableThemes:  this._config.paths.availableThemes || {},
			availableApps:    this._config.paths.availableApps || {},
			clientAssets:     path.join(corePath, '/built/assets/')
		},
		storage: {
			active: activeStorage
		},
		theme: {
			// normalise the URL by removing any trailing slash
			url: this._config.url ? this._config.url.replace(/\/$/, '') : ''
		},
		routeKeywords: {
			tag: 'tag',
			author: 'author',
			page: 'page',
			preview: 'p',
			private: 'private'
		},
		slugs: {
			// Used by generateSlug to generate slugs for posts, tags, users, ..
			// reserved slugs are reserved but can be extended/removed by apps
			// protected slugs cannot be changed or removed
			reserved: ['admin', 'app', 'apps', 'archive', 'archives', 'categories',
				'category', 'dashboard', 'feed', 'ghost-admin', 'login', 'logout',
				'page', 'pages', 'post', 'posts', 'public', 'register', 'setup',
				'signin', 'signout', 'signup', 'user', 'users', 'wp-admin', 'wp-login'],
			protected: ['ghost', 'rss']
		},
		uploads: {
			// Used by the upload API to limit uploads to images
			extensions: ['.jpg', '.jpeg', '.gif', '.png', '.svg', '.svgz'],
			contentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml']
		},
		deprecatedItems: ['updateCheck', 'mail.fromaddress'],
		// create a hash for cache busting assets
		assetHash: assetHash
	});

	// Also pass config object to
	// configUrl object to maintain
	// clean dependency tree
	configUrl.setConfig(this._config);

	// For now we're going to copy the current state of this._config
	// so it's directly accessible on the instance.
	// @TODO: perhaps not do this?  Put access of the config object behind
	// a function?
	_.extend(this, this._config);
};

/**
 * Allows you to read the config object.
 * @return {Object} The config object.
 */
ConfigManager.prototype.get = function () {
	return this._config;
};

ConfigManager.prototype.load = function (configFilePath) {

	return new Promise(function (resolve, reject) {});
};

/**
 * Read config.js file from file system using node's require
 * @param  {String} envVal Which environment we're in.
 * @return {Object}        The config object.
 */
ConfigManager.prototype.readFile = function (envVal) {
	return require(this._config.paths.config)[envVal];
};


module.exports = new ConfigManager(defaultConfig);//调用构造函数
