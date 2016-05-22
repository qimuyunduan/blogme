/**
 *
 * ProjectName：blogme
 * Description：
 * Created by qimuyunduan on 16/5/7 .
 * Revise person：qimuyunduan
 * Revise Time：16/5/7 下午9:38
 * @version
 *
 */

var _      = require('lodash'),
	crypto = require('crypto'),
	uuid   = require('node-uuid');

// check user is valid
function checkUser(pass,salt,DBPass){
	var md5 = crypto.createHash('md5');

	md5.update(pass);

	var md5_pass = md5.digest('hex');

	var md5Pass = crypto.createHash('md5');

	md5Pass.update(md5_pass+salt);
	var pwd = md5Pass.digest('hex');
	return pwd==DBPass;
}
function cryptPass(pass,salt){
	var md5 = crypto.createHash('md5');

	md5.update(pass);

	var md5_pass = md5.digest('hex');

	var md5Pass = crypto.createHash('md5');

	md5Pass.update(md5_pass+salt);
	//var pwd = md5Pass.digest('hex');
	return md5Pass.digest('hex');
}
function newUser() {

	var initPassWord = '111111';
	var salt = uuid.v4();

	var id = uuid.v1();
	var md5 = crypto.createHash('md5');

	md5.update(initPassWord);

	var md5Pass = crypto.createHash('md5');

	md5Pass.update(md5.digest('hex')+salt);
	var cryptPass = md5Pass.digest('hex');

	return {user_id: id, user_salt: salt, user_pass: cryptPass};


}

module.exports={
	isValidUser:checkUser,
	cryptPass:cryptPass,
	newUser:newUser
};
