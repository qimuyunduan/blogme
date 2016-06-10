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
var _        = require('lodash'),
	uuid     = require('node-uuid'),
	crypto   = require('crypto'),
	utils    = require('./core/server/utils'),
	models   = require('./core/server/models'),
	Promise  = require('bluebird'),
	config   = require('./core/server/config'),
	client   = require('redis').createClient();



//client.HMSET("hosts", {"mjr": "1"});
//client.hgetall("hosts", function (err, obj) {
//	console.dir(obj);
//});
var fsf = "fwfwa";
client.HMSET(fsf,{"another":"23", "home": "1234"});
client.hgetall(fsf, function (err, obj) {
	console.dir(obj);
});