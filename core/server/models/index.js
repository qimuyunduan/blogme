/**
 * Dependencies
 */

var _       = require('lodash'),
	Promise = require('bluebird'),
	fs      = Promise.promisifyAll(require("fs"));
	//models  = {};
//utils   = require('../utils'),


exports = module.exports;
// get fileNames under models directory ,set models

//function setModels() {
//
//	var deleteFiles = ['index.js', 'base'];
//	var fileNames = fs.readdirSync(__dirname);
//
//	if (!_.isEmpty(deleteFiles)) {
//		//delete deleteFiles from  fileNames
//		_.remove(fileNames, function (fileName) {
//
//			return _.indexOf(deleteFiles, fileName) >= 0;
//
//		});
//	}
//	for (var i = 0; i < fileNames.length; i++) {
//		if (_.endsWith(fileNames[i], '.js')) {
//			fileNames[i] = fileNames[i].toLowerCase().slice(0, -3);
//			_.assign(exports, require('./' + fileNames[i]));
//
//		}
//	}
//}

// get fileNames under models directory ,set models
function exportModels(dir) {

	var deleteFiles = ['index.js', 'base'];
	fs.readdirAsync(dir).then(function (files) {

		if (!_.isEmpty(deleteFiles)) {
			//delete deleteFiles from  fileNames
			_.remove(files, function (fileName) {

				return _.indexOf(deleteFiles, fileName) >= 0;

			});
		}
		for (var i = 0; i < files.length; i++) {
			if (_.endsWith(files[i], '.js')) {
				files[i] = files[i].toLowerCase().slice(0, -3);
				_.assign(exports, require('./' + files[i]));
			}
		}
	}).catch(function() {
		console.log("读取文件失败....");
	});
}

function init() {

	exportModels(__dirname);

	return Promise.resolve();
}

/**
 * Expose `init`
 */

exports.init = init;
