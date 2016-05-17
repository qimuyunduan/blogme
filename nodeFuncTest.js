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
	models   = require('./core/server/models');


var salt = uuid.v4();
var id = uuid.v1();
var pass = utils.checkUser.cryptPass('101410',salt);
//
//console.log(salt);
//console.log(id);
//console.log(pass);
models['idoUser'].model().forge({
		user_name: 'qimuyun',
		user_salt: salt,
		user_id: id,
		user_unit: '爱都科技',
		user_pass: pass,
		user_email: '84622534@qq.com',
		del_tag: '1',
		user_phone: '16544542423'
	})
	.save()
	.then(function (user) {
		console.log(user);
	});




