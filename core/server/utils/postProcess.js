/**
 *
 * ProjectName：blogme
 * Description：
 * Created by qimuyunduan on 16/5/11 .
 * Revise person：qimuyunduan
 * Revise Time：16/5/11 下午1:05
 * @version
 *
 */

var _  = require('lodash');
function replaceStr(str,replaceChar,start,length){
	if(_.isString(str)&&str.length&&(start+length)<str.length){
		var headStr = str.substr(0,start);
		var middleStr = '';
		var tailStr = str.substr(start+length);
		for(var i=0;i<length;i++){
			if(replaceChar){
				middleStr+=replaceChar;
			}else{
				middleStr+='*'
			}

		}
		return headStr+middleStr+tailStr;
	}
}
module.exports={
	replaceStr:replaceStr
};