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



var md5 = crypto.createHash('md5');
var txt = "101410";
var salt = uuid.v4();
md5.update(txt);

var awre = md5.digest('hex');
console.log(awre+salt);

var md5Pass = crypto.createHash('md5');

md5Pass.update(awre+salt);
var af = md5Pass.digest('hex');
console.log(af);

//md5 = crypto.createHash('md5');
//
//console.log(salt);
//
//
//
//console.log(md5.update("101410").digest('hex'));
//console.log(md5.update("101410").digest('hex')+salt);
//var pass =md5.update(salt+md5.update("101410").digest('hex')).digest('hex');
//console.log(pass);
model.idoUser.model().forge({
		user_name: "qimu",
		user_salt: salt,
		user_id:uuid.v1(),
		user_pass:af
	})
	.save()
	.then(function (user) {
		console.log({error: false, data: user});
	})
	.catch(function (err) {
		console.log({error: true, data: {message: err.message}});
	});

