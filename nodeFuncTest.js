/**
 *
 * ProjectName：blogme
 * Description：
 * Created by qimuyunduan on 16/4/4 .
 * Revise person：qimuyunduan
 * Revise Time：16/4/4 下午3:06
 * @version
 *
 */
var _      = require('lodash'),
	crypto = require('crypto'),
	uuid   = require('node-uuid'),
	moment = require('./core/server/utils/moment'),
	model  = require("./core/server/models/idoUser");

function fs(rg){
	if(rg){
		rg.sort();
		console.log(rg);
	}
}

fs([3,4,2,5]);
//function saer(sert){
//	if(sert){
//		console.log("true");
//	}
//	else{console.log("false");}
//}
//saer({});// true




