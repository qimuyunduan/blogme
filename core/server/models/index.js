/**
 * Dependencies
 */

var _             = require('lodash'),
	fs            = require('fs');


var files = ['addMoney','appVersion','bindFamily',
	'bugList','businessGroup','businessMan','businessShop','cacheT','cityAdvise','cityInfo','conFile',
	'conFolder',
	'consoleInfo','consoleMsg','consumeDetail','consumeInfo','deleteMoney',
	'dictCity','dictCompany','dictDrugType','dictProvince','fileT','idoUser','infoNews','insuredCompany',
	'insuredFile','insuredUnit','insuredUser','invCategory','invProduct','logInfo','menuT','messageInfo',
	'mobileCity','monthT','newRole','organization','parameterType','params','pushUser','repUser','roleMenu',
	'roleT','setPreference','subCompany','sysLog','sysPermission','sysResource',
	'sysRole','sysSequence','sysUser','sysUserRole','updateUserLog','uploadFile','userMenu','userRole',
	'users','webPage','webSite','year','yiAnList'];



//exports = module.exports;
// get fileNames under models directory ,set models

//function init() {
//
//	var deleteFiles = ['index.js', 'base'];
//	var Models = {};
//	var file = fs.readdirSync(__dirname);
//	//.then(function (files) {
//
//	if (!_.isEmpty(deleteFiles)) {
//		//delete deleteFiles from  fileNames
//		_.remove(file, function (fileName) {
//
//			return _.indexOf(deleteFiles, fileName) >= 0;
//
//		});
//	}
//	for (var i = 0; i < file.length; i++) {
//		if (_.endsWith(file[i], '.js')) {
//			file[i] = file[i].slice(0, -3);
//			//_.assign(Models, require('./' + files[i]));
//		}
//	}
//	console.log(file);
//	if (file !== files) {
//		for (var j = 0; j < file.length; j++) {
//			if (file[j].toString!=files[j]) {
//				console.log(files[j]);
//				//_.assign(Models, require('./' + files[i]));
//			}
//		}
//
//	}
//	else{
//
//	}
//}
//	//}.then(function(models){
//	//	exports.models = models;
//	//	console.log(exports);
//	//})
//	//	.catch(function() {
//	//	console.log("读取文件失败....");
//	//});




function setModels(fileNames) {
	var  models = {};
	if(_.isArray(fileNames)){

		for(var i=0;i<fileNames.length;i++){

			_.assign(models,require('./'+fileNames[i]));
		}
	}
	return models;
}
/**
 * Expose `models`
 */

module.exports = setModels(files);
