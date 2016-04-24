/**
 * Dependencies
 */

var _             = require('lodash');


var files = ['accesstokens','addMoney','appFields','appSetting','appVersion','apps','bindFamily',
	'bugList','businessGroup','businessMan','businessShop','cacheT','cityAdvise','cityInfo','clientDomain',
	'client','conFile','conFolder','consoleInfo','consoleMsg','consumeDetail','consumeInfo','deleteMoney',
	'dictCity','dictDrugType','dictCompany','dictProvince','fileT','idoUser','infoNews','insuredCompany',
	'insuredFile','insuredUser','invCategory','invProduct','logInfo','menuT','messageInfo','mobileCity',
	'mobileCity','monthT','newRole','organization','parameterType','params','permissions','permissionApp',
	'permissionRole','permissionUser','posts','postTag','pushUser', 'refreshToken','repUser','roleMenu',
	'roleT','roles','roleUser','setPreference','settings','subCompany','sysLog','sysPermission','sysResource',
	'sysRole','sysUser','sysUserRole','sysSequence','tags','updateUserLog','uploadFile','userMenu','userRole',
	'users','userT','webSite','webPage','year','yiAnList'];



//exports = module.exports;
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
