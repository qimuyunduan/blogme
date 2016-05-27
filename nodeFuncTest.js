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
	crypto  = require('crypto'),
	utils  = require('./core/server/utils'),
	models   = require('./core/server/models'),
	Promise  = require('bluebird'),
	config   = require('./core/server/config');



var id   = uuid.v1();
var salt = uuid.v4();
var pass = utils.checkUser.cryptPass('101410',salt);
console.log(config);
//console.log(user);

//console.log(salt);
//console.log(id);
//console.log(pass);
//models['idoUser'].model().forge({
//		user_id: id,
//		user_name: 'yunduan',
//		user_salt:salt,
//		user_pass:pass,
//		user_type:"技术部",
//		user_unit:"爱都科技",
//		user_status:"正常",
//		user_phone: '16914264232',
//		user_email: '84656589@qq.com',
//		user_address: ''
//	})
//	.save()
//	.then(function (user) {
//		console.log(user);
//	});
//




