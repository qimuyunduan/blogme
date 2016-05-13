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
	uuid   = require('node-uuid'),
	utils  = require('./core/server/utils'),
	user   = require('./core/server/models/idoUser');


var egrth={dgd:'',eygh:'aeryrt'};
console.log(_.pick(egrth, _.isEqual(egrth,'')));
var object = { 'a': 1, 'b': '2', 'c': 3 };

_.omit(object, _.isNumber);
// → { 'a': 1, 'c': 3 }

//var salt = uuid.v4();
//var id = uuid.v1();
//var pass = utils.checkUser.cryptPass('101410',salt);
//
//console.log(salt);
//console.log(id);
//console.log(pass);
//    user.idoUser.model().forge({
//			user_name: "qimuyun",
//			user_email: "84602445@qq.com",
//			user_pass:pass,
//			user_salt:salt,
//			user_id:id,
//			user_unit:'爱都科技',
//			user_phone:'18648642133',
//			user_status:'正常'
//		})
//		.save()
//		.then(function (user) {
//			console.log(user);
//		});



