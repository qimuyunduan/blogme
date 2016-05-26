var multer    = require('multer'),
	config    = require('../config'),
	upload;

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, config.paths.dataPath)
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
});
upload = multer({
	storage: storage
});

module.exports = upload;
