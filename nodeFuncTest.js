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


var grth = {};

var userId = uuid.v4();
grth[userId]="asertryj";

console.log(grth[userId]);  //可以uuid产生一个唯一性的session person id

//function saer(sert){
//	if(sert){
//		console.log("true");
//	}
//	else{console.log("false");}
//}
//saer({});// true




