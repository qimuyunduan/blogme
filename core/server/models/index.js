/**
 * Dependencies
 */

var _ = require('lodash'),
	Promise = require('bluebird'),
	fs = require('fs');
//utils   = require('../utils'),


exports = module.exports;
// get fileNames under models directory ,set models

function setModels() {

	var deleteFiles = ['index.js', 'base'];
	var fileNames = fs.readdirSync(__dirname);

	if (!_.isEmpty(deleteFiles)) {
		//delete deleteFiles from  fileNames
		_.remove(fileNames, function (fileName) {

			return _.indexOf(deleteFiles, fileName) >= 0;

		});
	}
	for (var i = 0; i < fileNames.length; i++) {
		if (_.endsWith(fileNames[i], '.js')) {
			fileNames[i] = fileNames[i].toLowerCase().slice(0, -3);
			_.assign(exports, require('./' + fileNames[i]));

		}
	}
}


function init() {

	setModels();

	return Promise.resolve();
}

/**
 * Expose `init`  'models'
 */

exports.init = init;
