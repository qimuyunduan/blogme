/**
 * Dependencies
 */

var _             = require('lodash'),
	accesstokens  = require('./accesstokens'),
	addMoney      = require('addMoney'),
	appField      = require(''),
	appSetting    = require(''),
	appVersion    = require(''),
	apps          = require(''),
	bindFamily    = require(''),
	bugList       = require(''),
	businessGroup = require(''),
	businessMan   = require(''),
	businessShop  = require(''),
	cacheT        = require(''),
	cityAdvise    = require(''),
	cityInfo      = require(''),
	clientDomain  = require(''),
	client        = require(''),
	conFile       = require(''),
	conFolder     = require(''),
	consoleInfo   = require(''),
	consoleMsg    = require(''),
	consumeDetail = require(''),
	consumeInfo   = require(''),
	deleteMoney   = require(''),
	dictCity      = require(''),
	dictDrugType  = require(''),
	dictCompany   = require(''),
	dictProvince  = require(''),
	fileT         = require(''),
	idoUser       = require(''),
	infoNews      = require(''),
	insuredCompany= require(''),
	insuredFile   = require(''),
	insuredUnit   = require(''),
	insuredUser   = require(''),
	invCategory   = require(''),
	invProduct    = require(''),
	logInfo       = require(''),
	menuT         = require(''),
	messageInfo   = require(''),
	mobileCity    = require(''),
	monthT        = require(''),
	newRole       = require(''),
	organization  = require(''),
	parameterType = require(''),
	params        = require(''),
	permissions   = require(''),
	permissionApp = require(''),
	permissionRole= require(''),
	permissionUser= require(''),
	posts         = require(''),
	postTag       = require(''),

	pushUser      = require(''),
	refreshToken  = require(''),
	repUser       = require(''),
	roleMenu      = require(''),
	roleT         = require(''),
	roles          = require(''),
	roleUser      = require(''),
	setPreference = require(''),
	settings       = require(''),
	subCompany    = require(''),
	sysLog        = require(''),
	sysPermission = require(''),
	sysResource   = require(''),
	sysRole       = require(''),
	sysUser       = require(''),
	sysUserRole   = require(''),
	sysSequence   = require(''),
	tags           = require(''),
	updateUserLog = require(''),
	uploadFile    = require(''),
	userMenu      = require(''),
	userRole      = require(''),
	userT         = require(''),
	user          = require(''),
	webSite       = require(''),
	wenPage       = require(''),
	year          = require(''),
	yiAnList      = require(''),

	models;


//exports = module.exports;

// get fileNames under models directory ,set models

//function init() {
//
//	var deleteFiles = ['index.js', 'base'];
//	var fileNames = fs.readdirSync(__dirname);
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
//			_.assign(Models, require('./' + fileNames[i]));
//
//		}
//	}
//	console.log(Models);
//	return Models;
//}

// get fileNames under models directory ,set models
//function init() {
//
//	var deleteFiles = ['index.js', 'base'];
//
//	fs.readdirAsync(__dirname)
//		.then(function (files) {
//
//		if (!_.isEmpty(deleteFiles)) {
//			//delete deleteFiles from  fileNames
//			_.remove(files, function (fileName) {
//
//				return _.indexOf(deleteFiles, fileName) >= 0;
//
//			});
//		}
//		for (var i = 0; i < files.length; i++) {
//			if (_.endsWith(files[i], '.js')) {
//				files[i] = files[i].toLowerCase().slice(0, -3);
//				_.assign(Models, require('./' + files[i]));
//			}
//		}
//		return Models;
//	})  .then(function(models){
//		exports.models = models;
//		console.log(exports);
//	})
//		.catch(function() {
//		console.log("读取文件失败....");
//	});
//
//}

/**
 * Expose `init`
 */

module.exports = models;
init();