/**
 *
 * ProjectName：blogme
 * Description：
 * Created by qimuyunduan on 16/4/22 .
 * Revise person：qimuyunduan
 * Revise Time：16/4/22 上午8:41
 * @version
 *
 */
var _       = require('lodash'),
	fs      = require('fs');
function getFileNames(dir,deleteFiles){
	var fileNames = [];
	fs.stat(dir,function(stats){
		if(stats.isDirectory(dir)){
			fs.readdir(dir,function(files){
				fileNames = files;
				if (!deleteFiles){
					return fileNames;
				}
			})
		}
	});
	//delete deleteFiles from  fileNames
	_.remove(fileNames, function (fileName) {

		return (_.indexOf(deleteFiles,fileName)>=0)

	});
}
module.exports = getFileNames();