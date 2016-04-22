/**
 * Dependencies
 */

var _       = require('lodash'),
	Promise = require('bluebird'),
	fs      = require('fs'),
	utils   = require('../utils'),
    models;






// get fileNames under models directory ,set models

function setModels(){
	
	if (models){
		return models;
	}
	else {
		var dbModels  = [];
		var deleteFiles = ['index.js','base'];
		fileNames = utils.getFileNames(__dirname,deleteFiles);
		
		for (var i = 0; i < fileNames.length; i++) {
			if (_.endsWith(fileNames[i], '.js')) {
				fileNames[i] = fileNames[i].toLowerCase().slice(0, -3);
				dbModels.push(require('./' + fileNames[i]));
			}
		}
		models = _.zipObject(fileNames, dbModels);

		return models;
	}

}


function init() {

   	setModels();

    return Promise.resolve();
}

/**
 * Expose `init`  'models'
 */

module.exports = {
	init:init(),
	models:setModels()
};
