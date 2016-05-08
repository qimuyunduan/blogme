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
var crypto = require('crypto'),
	uuid = require('node-uuid'),
	moment = require('./core/server/utils/moment'),
	model = require("./core/server/models/idoUser");

	var hewig =["4","2","6","2","1","8"];

function test (waert){
	if(waert == undefined){
		console.log("undefined");
	}
}

test();
//model.idoUser.model().forge({
//		user_name: "qimu",
//		user_salt: salt,
//		user_id:uuid.v1(),
//		user_pass:af
//	})
//	.save()
//	.then(function (user) {
//		console.log({error: false, data: user});
//	})
//	.catch(function (err) {
//		console.log({error: true, data: {message: err.message}});
//	});

