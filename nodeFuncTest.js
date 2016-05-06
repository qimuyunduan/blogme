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
	moment = require('./core/server/utils/moment');
	//moment = require('moment');
//moment.locale('zh-cn');
//console.log(typeof moment().format('d'));



var gather = {
	id : 1314,
	name : "pom",
	ih : {
		age : 20,
		sex : 'man',
		marry : false,
		identity : 622421,
		habit : ['篮球','台球','乒乓球','游戏',true]
	},
	family : ['妈妈','爸爸','弟弟'],
	likeGames : ['PCgame','Netgame']

};

var  f = {models:[2.3,4]};
console.log(_.assign(gather,f));
