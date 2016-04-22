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
var _ = require('lodash'),
	fs = require('fs');


//get the name of files under dir


function getFileNames(dir, deleteFiles) {

	var fileNames = [];
	fs.stat(dir, function (err, stats) {
		if (!err) {
			if (stats.isDirectory(dir)) {
				fs.readdir(dir,function(err,files){
					if(!err){
						fileNames = files;
						if (!_.isEmpty(deleteFiles)) {
							//delete deleteFiles from  fileNames
							fileNames = _.remove(files, function (fileName) {

								return (_.indexOf(deleteFiles, fileName) >= 0);

							});
						}
						console.log(fileNames);
						return fileNames;
					}
				});
			}
		}
	});

}
module.exports = getFileNames;



