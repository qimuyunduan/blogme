/**
 *
 * ProjectName：blogme
 * Description：
 * Created by qimuyunduan on 16/5/11 .
 * Revise person：qimuyunduan
 * Revise Time：16/5/11 下午7:02
 * @version
 *
 */
var iconV = require('iconv-lite');

function toUTF8(str){
	return iconV.decode(str,'gbk');
}
function toGBK(str){
	return icon.encode(str,'gbk');
}

module.exports = {
	utf8ToGbk:toGBK,
	gbkToUtf8:toUTF8
};