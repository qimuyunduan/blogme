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

var crypto = require('crypto');
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
module.exports=checkUser;