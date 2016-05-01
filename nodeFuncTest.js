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
	var _ = require('lodash'),
	fs    = require('fs'),
	//models = require('./core/server/models/ido-user'),
	//user  =  require('./core/server/models/tags');
	models = require('./core/server/models');

var gather = {
	id : 1314,
	name : 'pom'
	//infor : {
	//	age : 20,
	//	sex : 'man',
	//	marry : false,
	//	identity : 622421,
	//	habit : ['篮球','台球','乒乓球','游戏',true]
	//},
	//family : ['妈妈','爸爸','弟弟'],
	//likeGames : ['PCgame','Netgame']

};
//models = [
//	'accesstokens',
//	'addmoney-record-detail',
//	'app-fields',
//	'app-settings',
//	'app-version',
//	'apps'
//];

//console.log(typeof JSON.stringify(gather));
//console.log(JSON.stringify(gather));
//console.log(typeof JSON.parse(JSON.stringify(gather)));
//console.log(JSON.parse(JSON.stringify(gather)).name);

//console.log(_.extend({hi:34},gather));
//console.log(_.assign({hi:34},gather));

//


//console.log(models);

models.idoUser.model().forge({id:50}).fetch().then(function(data){
	console.log(JSON.stringify(data));
});